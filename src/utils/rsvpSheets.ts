import { createSign } from 'node:crypto';

type WhitelistRow = {
    rowNumber: number;
    householdKey: string;
    primaryContact: string;
    maxAttendees: number;
    aliasKeys: string[];
    responded: boolean;
};

type LookupResult = {
    rowNumber: number;
    householdKey: string;
    primaryContact: string;
    maxAttendees: number;
    responded: boolean;
};

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

function getSheetsConfig() {
    return {
        serviceAccountEmail: getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        privateKey: getEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
        sheetId: getEnv('GOOGLE_SHEET_ID'),
        whitelistRange: process.env.GOOGLE_SHEET_WHITELIST_RANGE || 'whitelist!A2:G',
        responsesRange: process.env.GOOGLE_SHEET_RESPONSES_RANGE || 'responses!A2:H'
    };
}

function base64UrlEncode(input: Buffer | string): string {
    const value = Buffer.isBuffer(input) ? input.toString('base64') : Buffer.from(input).toString('base64');
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeKey(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function getGoogleAccessToken(): Promise<string> {
    const { serviceAccountEmail, privateKey } = getSheetsConfig();
    const now = Math.floor(Date.now() / 1000);

    const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claimSet = base64UrlEncode(
        JSON.stringify({
            iss: serviceAccountEmail,
            scope: GOOGLE_SHEETS_SCOPE,
            aud: TOKEN_URL,
            exp: now + 3600,
            iat: now
        })
    );
    const unsignedJwt = `${header}.${claimSet}`;
    const signer = createSign('RSA-SHA256');
    signer.update(unsignedJwt);
    signer.end();
    const signature = base64UrlEncode(signer.sign(privateKey));

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${unsignedJwt}.${signature}`
        })
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Google token request failed: ${response.status} ${body}`);
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) throw new Error('Google token request did not return access_token');
    return data.access_token;
}

async function googleSheetsRequest(path: string, init?: RequestInit): Promise<Response> {
    const accessToken = await getGoogleAccessToken();
    return fetch(`https://sheets.googleapis.com/v4/${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...(init?.headers || {})
        }
    });
}

function parseWhitelistRow(row: string[], rowNumber: number): WhitelistRow | null {
    const householdKey = normalizeKey(row[0] || '');
    if (!householdKey) return null;

    const primaryContact = (row[1] || '').trim();
    const maxAttendeesRaw = Number.parseInt((row[2] || '1').trim(), 10);
    const maxAttendees = Number.isNaN(maxAttendeesRaw) ? 1 : maxAttendeesRaw;
    const alias1 = normalizeKey(row[3] || '');
    const alias2 = normalizeKey(row[4] || '');
    const responded = ['true', 'yes', '1'].includes((row[5] || '').trim().toLowerCase());

    return {
        rowNumber,
        householdKey,
        primaryContact,
        maxAttendees,
        aliasKeys: [alias1, alias2].filter(Boolean),
        responded
    };
}

export async function lookupHouseholdByName(inputName: string): Promise<LookupResult | null> {
    const key = normalizeKey(inputName || '');
    if (!key) return null;

    const { sheetId, whitelistRange } = getSheetsConfig();
    const response = await googleSheetsRequest(`spreadsheets/${sheetId}/values/${encodeURIComponent(whitelistRange)}`);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed reading whitelist: ${response.status} ${body}`);
    }

    const data = (await response.json()) as { values?: string[][] };
    const rows = data.values || [];
    const parsedRows = rows
        .map((row, index) => parseWhitelistRow(row, index + 2))
        .filter((row): row is WhitelistRow => Boolean(row));
    const match = parsedRows.find((row) => row.householdKey === key || row.aliasKeys.includes(key));
    if (!match) return null;

    return {
        rowNumber: match.rowNumber,
        householdKey: match.householdKey,
        primaryContact: match.primaryContact,
        maxAttendees: match.maxAttendees,
        responded: match.responded
    };
}

export async function appendRsvpResponse(params: {
    householdKey: string;
    primaryContact: string;
    submittedBy: string;
    attendance: 'yes' | 'no';
    attendingCount: number;
    notes: string;
    userAgent: string;
}): Promise<void> {
    const { sheetId, responsesRange } = getSheetsConfig();
    const payload = {
        values: [
            [
                new Date().toISOString(),
                params.householdKey,
                params.primaryContact,
                params.submittedBy,
                params.attendance,
                params.attendingCount,
                params.notes,
                params.userAgent
            ]
        ]
    };

    const response = await googleSheetsRequest(
        `spreadsheets/${sheetId}/values/${encodeURIComponent(responsesRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        { method: 'POST', body: JSON.stringify(payload) }
    );

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed writing response: ${response.status} ${body}`);
    }
}

export async function markHouseholdResponded(rowNumber: number): Promise<void> {
    const { sheetId } = getSheetsConfig();
    const range = `whitelist!F${rowNumber}:F${rowNumber}`;
    const response = await googleSheetsRequest(`spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        body: JSON.stringify({ values: [['TRUE']] })
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed marking household as responded: ${response.status} ${body}`);
    }
}

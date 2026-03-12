import type { APIRoute } from 'astro';
import { appendRsvpResponse, lookupHouseholdByName, markHouseholdResponded } from '../../utils/rsvpSheets';

export const prerender = false;

type SubmitBody = {
    fullName: string;
    attendance: 'yes' | 'no';
    attendingCount: number;
    notes?: string;
    botField?: string;
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = (await request.json()) as SubmitBody;

        if (body.botField?.trim()) {
            return new Response(JSON.stringify({ ok: true }));
        }

        const fullName = String(body.fullName || '').trim();
        if (!fullName) {
            return new Response(JSON.stringify({ error: 'Please provide your full name' }), { status: 400 });
        }

        const attendance = body.attendance;
        if (attendance !== 'yes' && attendance !== 'no') {
            return new Response(JSON.stringify({ error: 'Invalid attendance value' }), { status: 400 });
        }

        const attendingCount = Number(body.attendingCount);
        if (!Number.isInteger(attendingCount) || attendingCount < 0) {
            return new Response(JSON.stringify({ error: 'Invalid attendee count' }), { status: 400 });
        }

        const household = await lookupHouseholdByName(fullName);
        if (!household) {
            return new Response(JSON.stringify({ error: 'Name not recognized on the invitation list' }), { status: 404 });
        }

        if (household.responded) {
            return new Response(JSON.stringify({ error: 'This household already submitted a response' }), { status: 409 });
        }

        if (attendance === 'yes') {
            if (attendingCount < 1) {
                return new Response(JSON.stringify({ error: 'Attendee count must be at least 1 when attending' }), { status: 400 });
            }
            if (attendingCount > household.maxAttendees) {
                return new Response(JSON.stringify({ error: `Attendee count exceeds invitation limit of ${household.maxAttendees}` }), {
                    status: 400
                });
            }
        }

        if (attendance === 'no' && attendingCount !== 0) {
            return new Response(JSON.stringify({ error: 'Declined responses must use attendee count of 0' }), { status: 400 });
        }

        const notes = String(body.notes || '').trim();
        const userAgent = request.headers.get('user-agent') || '';

        await appendRsvpResponse({
            householdKey: household.householdKey,
            primaryContact: household.primaryContact,
            submittedBy: fullName,
            attendance,
            attendingCount,
            notes,
            userAgent
        });

        await markHouseholdResponded(household.rowNumber);

        return new Response(JSON.stringify({ ok: true }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Submission failed' }), { status: 500 });
    }
};

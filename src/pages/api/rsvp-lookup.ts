import type { APIRoute } from 'astro';
import { lookupHouseholdByName } from '../../utils/rsvpSheets';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    try {
        const fullName = (url.searchParams.get('fullName') || '').trim();
        if (!fullName) {
            return new Response(JSON.stringify({ error: 'Missing full name' }), { status: 400 });
        }

        const household = await lookupHouseholdByName(fullName);
        if (!household) {
            return new Response(JSON.stringify({ error: 'Name not recognized on the invitation list' }), { status: 404 });
        }

        return new Response(
            JSON.stringify({
                householdKey: household.householdKey,
                primaryContact: household.primaryContact,
                maxAttendees: household.maxAttendees,
                responded: household.responded
            })
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Lookup failed' }), { status: 500 });
    }
};

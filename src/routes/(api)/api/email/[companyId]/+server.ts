import type { RequestHandler } from './$types';
import { GmailAuth } from "$lib/modules/gmail/oauth";
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const auth = new GmailAuth(+params.companyId);
    const authenticated = await auth.authorize();

    if (authenticated)
        throw error(400, 'Already authenticated');

    const url = await auth.getNewToken();
    const message = `Please visit the following URL to authorize the app: <a href=${url}>Authenticate</a>`;
    return new Response(message, {
        status: 200,
        headers: {
            'Content-Type': 'text/html'
        }
    });
};
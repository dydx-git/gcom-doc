import { GmailAuth } from '$lib/modules/gmail/oauth';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const { searchParams } = new URL(url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code)
        throw error(400, 'No code provided');
    if (!state)
        throw error(400, 'No state provided');

    try {
        const { companyId } = JSON.parse(state);

        const auth = new GmailAuth(+companyId);
        const oAuth2Client = auth.getOAuth2Client();
        const token = await oAuth2Client.getToken(code);

        await auth.saveToken(token.tokens);
        return new Response('Successfully authenticated');
    } catch (e) {
        const err = e as Error;
        throw error(400, err.message);
    }
};
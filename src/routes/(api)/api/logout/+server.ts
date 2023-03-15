import { auth } from '$lib/modules/auth/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    const session = await locals.validate();
    if (!session) return new Response();

    await auth.invalidateSession(session.sessionId);
    locals.setSession(null);
    throw redirect(307, '/');
};
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const { user } = await locals.validateUser();

	if (user && !url.pathname.startsWith('/otp/register')) throw redirect(307, '/');
}) satisfies LayoutServerLoad;

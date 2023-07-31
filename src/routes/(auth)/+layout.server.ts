import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session && !dev) throw redirect(307, '/');
}) satisfies LayoutServerLoad;

import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user } = await locals.validateUser();

	if (user && !dev) throw redirect(307, '/');
}) satisfies LayoutServerLoad;

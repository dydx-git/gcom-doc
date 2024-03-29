import { User } from '$lib/modules/auth/user';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			const session = await new User().login(username, password);
			if (!session) return fail(401);

			locals.auth.setSession(session);
		} catch (error) {
			logger.error(error);
			return fail(400);
		}
	}
};

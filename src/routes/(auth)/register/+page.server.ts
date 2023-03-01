import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ locals }) => {
		const { user } = await locals.validateUser();
		if (user) throw redirect(307, '/');

		console.log(locals.form_data);
	}
} satisfies Actions;

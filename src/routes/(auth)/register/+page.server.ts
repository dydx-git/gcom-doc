import type { PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms/server";
import { fail, redirect, type Actions } from '@sveltejs/kit';
import client from '$lib/services/db/client';
import { User } from '$lib/modules/auth/user';
import { schema } from './meta';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, schema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const data = form.data;
		const auth = data.auth;

		try {
			await new User().create(auth.username, auth.password, auth.role);
			client.salesRepColors.create({
				data: {
					...data.colors,
					salesRep: {
						create: {
							...data.salesRep,
						}
					}
				}
			});
		} catch (err) {
			const actualError = err as Error;
			return fail(400, { form, error: { name: actualError.name, message: actualError.message } });
		}

		throw redirect(302, '/login');
	}
} satisfies Actions;

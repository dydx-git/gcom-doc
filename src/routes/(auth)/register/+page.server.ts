import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
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

		if (!form.valid)
			return message(form, 'Form is invalid. Please check the fields and try again.');

		const data = form.data;
		const auth = data.auth;

		try {
			await new User().create(auth.username, auth.password, auth.role);
			await client.colorSettings.create({
				data: {
					...data.colors,
					salesRep: {
						create: {
							...data.salesRep
						}
					}
				}
			});
		} catch (e) {
			const err = e as Error;
			let { message: msg } = err;

			return message(form, msg);
		}

		throw redirect(302, '/login');
	}
} satisfies Actions;

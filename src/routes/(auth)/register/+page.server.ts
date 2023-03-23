import type { PageServerLoad } from './$types';
import {
	SalesRepColorsUncheckedCreateInputSchema,
	SalesRepUncheckedCreateInputSchema,
	UserRolesSchema
} from '$baseTypes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { fail, type Actions } from '@sveltejs/kit';

const schema = z.object({
	colors: SalesRepColorsUncheckedCreateInputSchema,
	auth: z.object({
		username: z
			.string()
			.min(4, { message: 'Username must be at least 4 characters long' })
			.max(10, { message: 'Username cannot be longer than 10 characters' })
			.regex(/^[a-z0-9]+$/, {
				message: 'Username can only contain lowercase alphanumeric characters'
			}),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters long' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, {
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			}),
		role: UserRolesSchema
	}),
	salesRep: SalesRepUncheckedCreateInputSchema
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, schema);

	return { form };
};

export const actions = {
	default: async (event) => {
		// Same syntax as in the load function
		const form = await superValidate(event, schema);
		console.log('POST', form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated data

		// Yep, return { form } here too
		return { form };
	}
} satisfies Actions;

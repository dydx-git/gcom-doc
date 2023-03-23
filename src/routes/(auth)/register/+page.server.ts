import type { PageServerLoad } from './$types';
import {
	SalesRepColorsSchema,
	SalesRepOptionalDefaultsSchema,
	UserRolesSchema
} from '$baseTypes';
import { superValidate } from "sveltekit-superforms/server";
import { z } from 'zod';
import { fail, type Actions } from '@sveltejs/kit';
import client from '$lib/services/db/client';
import { User } from '$lib/modules/auth/user';


const SalesRepDefaultCompanySchema = SalesRepOptionalDefaultsSchema.merge(z.object({
	companyId: z.number().int().gte(1, { message: 'Please select a valid company' })
}));

const schema = z.object({
	colors: SalesRepColorsSchema.omit({ salesRepUsername: true }),
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
	salesRep: SalesRepDefaultCompanySchema
});

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
		// Yep, return { form } here too
		return { form };
	}
} satisfies Actions;

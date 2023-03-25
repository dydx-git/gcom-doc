import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { schema } from './meta';
import { Clients } from './client';

export const load: PageServerLoad = async (event) => {
	const form = superValidate(event, schema);
	const salesRep = prisma.salesRep.findMany({ select: { username: true, name: true } });
	const { locals } = event;
	const { user } = await locals.validateUser();
	if (!user) {
		return fail(401, { message: 'You must be logged in to access this page' });
	}
	const client = new Clients().read(user);

	console.log('client', client);


	return { form, salesRep, client };
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	}
};

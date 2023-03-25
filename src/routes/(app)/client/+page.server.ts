import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { schema } from './meta';

export const load: PageServerLoad = async (event) => {
	const form = superValidate(event, schema);
	const salesRep = await prisma.salesRep.findMany({ select: { username: true, name: true } });

	return { form, salesRep };
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

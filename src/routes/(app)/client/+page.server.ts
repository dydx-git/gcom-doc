import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { schema } from './meta';
import { Clients } from '$lib/modules/client/client';
import hash from 'object-hash';
import { Prisma } from '@prisma/client';

export const load: PageServerLoad = async (event) => {
	const form = superValidate(event, schema);
	const salesRep = prisma.salesRep.findMany({ select: { username: true, name: true } });
	const { locals } = event;
	const { user } = await locals.validateUser();
	if (!user) {
		return fail(401, { message: 'You must be logged in to access this page' });
	}
	const client = new Clients().read(user);

	return { form, salesRep, client };
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const { client } = data;

		const clientId = hash({
			name: client.name,
			companyId: client.companyId,
			username: client.salesRepUsername,
			emails: data.emails.map((e) => e.email),
			phones: data.phones.map((p) => p.phone)
		}, { algorithm: 'md5' });

		try {
			await new Clients().create({ id: clientId, ...client }, data.address, data.emails, data.phones);
		} catch (e) {
			const err = e as Error;
			let { message } = err;
			if (e instanceof Prisma.PrismaClientKnownRequestError)
				if (e.code === 'P2002')
					message = `Cannot create a new client. ${client.name} already exists on ${client.salesRepUsername}'s account.`;

			return fail(400, { form, error: { name: err.name, message } });
		}

		return { form, error: null };
	}
};

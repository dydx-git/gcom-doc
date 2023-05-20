import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { Clients } from '$lib/modules/client/client';
import { Prisma } from '@prisma/client';
import { schema } from '$lib/modules/client/meta';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, depends, url, request }) => {
	const form = superValidate(request, schema);
	const salesRep = prisma.salesRep.findMany({ select: { username: true, name: true } });

	const { user } = await locals.validateUser();
	if (!user) return fail(401, { message: 'You must be logged in to access this page' });

	const client = await new Clients().read(user);

	depends(url.pathname);

	return { form, salesRep, client };
};

export const actions: Actions = {
	create: async ({ locals, url, request }) => {
		let form = await superValidate(request, schema);

		if (!form.valid) {
			return message(form, "Form is invalid. Please check the fields and try again.");
		}

		const { data } = form;
		const { client } = data;

		try {
			await new Clients().create(client, data.address, data.emails, data.phones);
		} catch (e) {
			const err = e as Error;
			let { message: msg } = err;
			if (e instanceof Prisma.PrismaClientKnownRequestError)
				if (e.code === 'P2002')
					msg = `Cannot create a new client. ${client.name} already exists on ${client.salesRepUsername}'s account.`;

			return message(form, msg);
		}
		locals.room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: url.pathname });

		form = await superValidate(schema); // empty form
		return { form, error: null };
	}
};

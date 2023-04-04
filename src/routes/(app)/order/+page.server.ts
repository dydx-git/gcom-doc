import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { Clients } from '$lib/modules/client/client';
import { Prisma } from '@prisma/client';
import { schema } from '$lib/modules/client/meta';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { Jobs } from '$lib/modules/order/order';

export const load: PageServerLoad = async (event) => {
	const form = superValidate(event, schema);
	const clients = prisma.client.findMany({ select: { id: true, name: true } });
	const { depends, url } = event;

	const client = await new Jobs().read();

	depends(url.pathname);

	return { form, salesRep: clients, client };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, url } = event;
		const form = await superValidate(event, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const { client } = data;

		try {
			await new Clients().create(client, data.address, data.emails, data.phones);
		} catch (e) {
			const err = e as Error;
			let { message } = err;
			if (e instanceof Prisma.PrismaClientKnownRequestError)
				if (e.code === 'P2002')
					message = `Cannot create a new client. ${client.name} already exists on ${client.salesRepUsername}'s account.`;

			return fail(400, { form, error: { name: err.name, message } });
		}
		locals.room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: url.pathname });

		return { form, error: null };
	}
};

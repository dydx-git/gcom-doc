// import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { Prisma } from '@prisma/client';
import { schema } from '$lib/modules/client/meta';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { Jobs } from '$lib/modules/order/order';
import dayjs from 'dayjs';
import { UserSettings } from '$lib/modules/userSettings/userSettings';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { depends, url, locals: { validateUser } } = event;

	const form = superValidate(event, schema);

	const clients = prisma.client.findMany({ select: { id: true, name: true } });

	const { user } = await validateUser();
	if (!user) return fail(401, { message: 'Unauthorized' });

	const userSettings = await new UserSettings().read({ username: user.username });
	const dateUntil = dayjs().subtract(userSettings.datatable.order.showRecordsForLastDays, 'day').toDate();
	const orders = await new Jobs().read(dateUntil);

	depends(url.pathname);

	return { form, clients, orders };
};

// export const actions: Actions = {
// 	create: async (event) => {
// 		const { locals, url } = event;
// 		const form = await superValidate(event, schema);

// 		if (!form.valid) {
// 			return fail(400, { form });
// 		}

// 		const { data } = form;
// 		const { client } = data;

// 		try {
// 			await new Clients().create(client, data.address, data.emails, data.phones);
// 		} catch (e) {
// 			const err = e as Error;
// 			let { message } = err;
// 			if (e instanceof Prisma.PrismaClientKnownRequestError)
// 				if (e.code === 'P2002')
// 					message = `Cannot create a new client. ${client.name} already exists on ${client.salesRepUsername}'s account.`;

// 			return fail(400, { form, error: { name: err.name, message } });
// 		}
// 		locals.room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: url.pathname });

// 		return { form, error: null };
// 	}
// };

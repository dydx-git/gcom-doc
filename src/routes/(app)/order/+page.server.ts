// import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { JobStatus, Prisma } from '@prisma/client';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { Jobs } from '$lib/modules/order/order';
import dayjs from 'dayjs';
import { error, fail, type Actions } from '@sveltejs/kit';
import { UserSettings } from '$lib/modules/userSettings/userSettings';
import { createSchema, type OrderSchema } from '$lib/modules/order/meta';
import { Vendors } from '$lib/modules/vendor/vendor';
import { Companies } from '$lib/modules/company/company';
import { OrderMailer } from '$lib/modules/order/orderMailer';
import { AttachmentPersister } from '$lib/modules/persister/attachmentPersister';
import { OrderStats } from '$lib/modules/stats/order';
import { Clients } from '$lib/modules/client/client';
import { deserialize } from '$app/forms';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async (event) => {
	const { depends, url, locals: { validateUser } } = event;

	const form = superValidate(event, createSchema);
	const clients = new Clients().readClientsWithPrices();

	const { user } = await validateUser();
	if (!user) return fail(401, { message: 'Unauthorized' });


	const userSettings = await new UserSettings().read({ username: user.username });
	const dateUntil = dayjs().subtract(userSettings.datatable.order.showRecordsForLastDays, 'day').toDate();
	const vendors = new Vendors().getPendingOrdersAggregate();

	const orders = new Jobs().readForDataTable(dateUntil);
	const orderStats = new OrderStats();
	const orderCount = orderStats.getOrderCount(dayjs().toDate());
	const pendingOrderDetails = orderStats.getPendingOrderDetails();

	depends(url.pathname);

	return { form, clients, orders, vendors, orderCount, pendingOrderDetails };
};

export const actions: Actions = {
	create: async ({ locals, request, url }) => {
		let form = await superValidate(request, createSchema);

		if (!form.valid)
			return message(form, "Form is invalid. Please check the fields and try again.");

		const { data } = form;
		const { order, po, gmail } = data;

		try {
			await new Jobs().create({
				...order,
				...po,
				...gmail,
			});
		} catch (e) {
			const err = e as Error;
			let { message: msg } = err;
			if (e instanceof Prisma.PrismaClientKnownRequestError)
				if (e.code === 'P2002')
					msg = `Cannot create a new order. ${order.name} already exists.`;

			return message(form, msg);
		}

		locals.room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: url.pathname });
		if (gmail.companyId && gmail.inboxMsgId)
			sendOrder(data).catch(err => {
				logger.error(err);
			});
		form = await superValidate(createSchema); // empty form
		return { form, error: null };
	},
	update: async ({ request, locals, url }) => {
		const body = await request.json() as { id: string, status: JobStatus };
		const { id, status } = body;
		if (!id || !status)
			return fail(400, { message: 'Invalid request' });

		await new Jobs().update(id, { status });
		locals.room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: url.pathname });
		return { status };
	}
};

async function sendOrder(data: Omit<OrderSchema, "gmail"> & { gmail: Omit<OrderSchema["gmail"], "attachments"> }) {
	const { order, po, gmail } = data;
	const company = await new Companies().readById(gmail.companyId);
	if (!company)
		throw error(500, "Company not found")

	const mailer = new OrderMailer(company);
	const attachments = await new AttachmentPersister().readAttachmentOrDownload(gmail.inboxMsgId, await mailer.mailer);
	mailer.sendToVendor({
		...order,
		...po,
		...gmail,
		attachments
	}).catch(err => {
		console.error(err);
	});
}

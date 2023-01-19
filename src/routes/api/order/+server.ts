import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import client from '$db/client';
import dayjs from 'dayjs';
import type { Order } from '$lib/models/job';

export const GET: RequestHandler = async (req) => {
	const { url } = req;
	const showRecordsForLastDays = Number(url.searchParams.get('showRecordsForLastDays'));

	if (!showRecordsForLastDays)
		throw error(400, 'Missing required parameter: showRecordsForLastDays');

	const dateUntil = dayjs().subtract(showRecordsForLastDays, 'day').toDate();

	const orders: Order[] = await client.purchaseOrder.findMany({
		where: {
			jobs: {
				every: {
					createdAt: {
						gte: dateUntil
					}
				}
			}
		},
		include: {
			jobs: true,
			client: true
		}
	});

	return json(orders);
};

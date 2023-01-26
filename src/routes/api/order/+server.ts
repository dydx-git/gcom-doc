import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import client from '$db/client';
import dayjs from 'dayjs';
import type { Job, PurchaseOrder } from '@prisma/client';

export type OrderResponse = (PurchaseOrder & {
	jobs: (Job & {
		vendor: {
			id: number;
			name: string;
		};
	})[];
	client: {
		id: string;
		name: string;
		companyName: string;
		salesRep: {
			name: string;
		};
	};
})[];

export const GET: RequestHandler = async (req) => {
	const { url } = req;
	const showRecordsForLastDays = Number(url.searchParams.get('showRecordsForLastDays'));

	if (!showRecordsForLastDays) throw error(400, 'Missing parameter: showRecordsForLastDays');

	const dateUntil = dayjs().subtract(showRecordsForLastDays, 'day').toDate();

	const data: OrderResponse = await client.purchaseOrder.findMany({
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
			jobs: {
				include: {
					vendor: {
						select: {
							id: true,
							name: true
						}
					}
				}
			},
			client: {
				select: {
					id: true,
					name: true,
					companyName: true,
					salesRep: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});

	return json(data);
};

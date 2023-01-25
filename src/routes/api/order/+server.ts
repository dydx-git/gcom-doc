import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import client from '$db/client';
import dayjs from 'dayjs';
import type { OrderDataTable } from '$lib/content/core';

export const GET: RequestHandler = async (req) => {
	const { url } = req;
	const showRecordsForLastDays = Number(url.searchParams.get('showRecordsForLastDays'));

	if (!showRecordsForLastDays) throw error(400, 'Missing parameter: showRecordsForLastDays');

	const dateUntil = dayjs().subtract(showRecordsForLastDays, 'day').toDate();

	const data = await client.purchaseOrder.findMany({
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

	const result: OrderDataTable[] = [];

	data.forEach((job) => {
		const { client, jobs } = job;
		jobs.forEach((job) => {
			result.push({
				id: job.id,
				name: job.name,
				price: job.price.toString(),
				client: client.name + ' ' + client.companyName,
				clientId: client.id,
				vendor: job.vendor.name,
				vendorId: job.vendor.id,
				date: job.createdAt.toString(),
				status: job.status
			});
		});
	});

	return json(result);
};

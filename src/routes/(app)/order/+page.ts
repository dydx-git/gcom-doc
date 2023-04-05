import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { userPreferencesStore } from '$lib/store';
import dayjs from 'dayjs';
import { type JobsWithVendorAndClient, type OrderDataTable, OrderStatus } from '$lib/modules/order/meta';

// export const load: PageLoad = async ({ data }) => {
// 	if (!data?.orders)
// 		throw error(500, 'No orders found');

// 	const orders: JobsWithVendorAndClient = data.orders;

// 	const result: OrderDataTable[] = [];

// 	orders.forEach((job) => {
// 		const { client, jobs } = job;
// 		jobs.forEach((job) => {
// 			const status: OrderStatus = dayjs().isAfter(dayjs(job.createdAt), 'day')
// 				? OrderStatus.OVERDUE
// 				: (job.status as OrderStatus);

// 			result.push({
// 				id: job.id,
// 				name: job.name,
// 				price: job.price.toString(),
// 				client: client.name,
// 				companyName: client.companyName,
// 				clientId: client.id,
// 				vendor: job.vendor.name,
// 				vendorId: job.vendor.id,
// 				date: job.createdAt.toString(),
// 				status: status
// 			});
// 		});
// 	});

// 	console.info('result', result);
// 	return { orders: result };
// };

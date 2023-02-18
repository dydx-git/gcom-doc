import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { userPreferencesStore } from '$lib/store';
import type { JobsWithVendorAndClient } from '$lib/models/order';
import dayjs from 'dayjs';
import { type OrderDataTable, OrderStatus } from '$lib/models/client-form';

export const load: PageLoad = async ({ fetch }) => {
	const userPreferences = get(userPreferencesStore);
	const { order } = userPreferences.datatable;
	const response = await fetch(`/api/order?showRecordsForLastDays=${order.showRecordsForLastDays}`);
	if (response.status !== 200) throw error(response.status, { message: await response.text() });

	const orders: JobsWithVendorAndClient = await response.json();

	const result: OrderDataTable[] = [];

	orders.forEach((job) => {
		const { client, jobs } = job;
		jobs.forEach((job) => {
			const status: OrderStatus = dayjs().isAfter(dayjs(job.createdAt), 'day')
				? OrderStatus.OVERDUE
				: (job.status as OrderStatus);

			result.push({
				id: job.id,
				name: job.name,
				price: job.price.toString(),
				client: client.name,
				companyName: client.companyName,
				clientId: client.id,
				vendor: job.vendor.name,
				vendorId: job.vendor.id,
				date: job.createdAt.toString(),
				status: status
			});
		});
	});

	return { orders: result };
};

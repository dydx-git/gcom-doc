import type { Order } from '$lib/models/job';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { userPreferencesStore } from '../store';
import { OrderStatus, type OrderDataTable } from '$lib/content/core';
import type { OrderResponse } from '../api/order/+server';
import dayjs from 'dayjs';

export const load: PageLoad = async ({ fetch }) => {
	const userPreferences = get(userPreferencesStore);
	const { order } = userPreferences.datatable;
	const response = await fetch(`/api/order?showRecordsForLastDays=${order.showRecordsForLastDays}`);
	if (response.status !== 200) throw error(response.status, { message: await response.text() });

	const orders: OrderResponse = await response.json();

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

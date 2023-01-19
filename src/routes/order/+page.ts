import type { Order } from '$lib/models/job';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { showRecordsForLastDays } from './store';

export const load = (async ({ fetch }) => {
	const daysUpUntil = get(showRecordsForLastDays);
	const response = await fetch(`/api/order?showRecordsForLastDays=${daysUpUntil}`);

	const orders: Order[] = await response.json();

	return { orders };
}) satisfies PageLoad;

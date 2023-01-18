import type { Order } from '$lib/models/job';
import type { PageLoad } from './$types';
import { showRecordsForLastDays } from './store';

export const load = (async ({ fetch }) => {
	const response = await fetch(`/api/order?showRecordsForLastDays${showRecordsForLastDays}`);

	const data: Order[] = await response.json();

	return data;
}) satisfies PageLoad;

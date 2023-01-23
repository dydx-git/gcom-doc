import type { Order } from '$lib/models/job';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { userPreferencesStore } from '../store';

export const load = (async ({ fetch }) => {
	const userPreferences = get(userPreferencesStore);
	const { order } = userPreferences.datatable;
	const response = await fetch(`/api/order?showRecordsForLastDays=${order.showRecordsForLastDays}`);
	if (response.status !== 200) throw error(response.status, { message: await response.text() });

	const orders: Order[] = await response.json();

	return { orders };
}) satisfies PageLoad;

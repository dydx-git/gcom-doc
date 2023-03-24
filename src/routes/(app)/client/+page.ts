import type { Client } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
	const response = await fetch(`/api/client`);
	if (response.status !== 200) throw error(response.status, { message: await response.text() });

	const clients: Client[] = await response.json();

	return { clients, ...data };
};

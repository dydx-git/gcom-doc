import type { Client } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
	return { ...data };
};

import { SalesRep } from '$lib/modules/sales-rep/sales-rep';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const salesReps = new SalesRep();
	const data = await salesReps.read({ select: { id: true, name: true } });

	return json(data);
};

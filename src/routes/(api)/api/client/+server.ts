import client from '$db/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
	const clients = await client.client.findMany();
	return json(clients);
};
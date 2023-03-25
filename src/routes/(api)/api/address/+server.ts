import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Address } from '$lib/modules/client/address';

export const GET: RequestHandler = async (req) => {
	const inputAddress = req.url.searchParams.get('address');
	if (!inputAddress) throw error(400, { message: 'Missing parameter: address' });

	try {
		const result = Address.getParsedAddress(inputAddress);
		return json(result);
	} catch (err) {
		const { message } = err as App.Error;
		throw error(500, { message });
	}
};
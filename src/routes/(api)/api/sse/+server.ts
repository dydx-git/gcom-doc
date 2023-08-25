import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async event => {
	const { locals } = event;
	const { room, auth: { validate } } = locals;

	if (!await validate()) throw error(401, { message: 'You must be logged in to access this page' });

	return room.server(event.getClientAddress());
}
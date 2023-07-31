import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = (event) => {
	const { locals } = event;
	const { room, auth: { validate } } = locals;

	if (!validate()) throw error(401, { message: 'You must be logged in to access this page' });

	return room.server(event.getClientAddress(), {
		connect: ({ user }) => {
			console.log(`User ${user} connected to ${room.room}-room`);
		},
		disconnect: ({ user }) => {
			console.log(`User ${user} disconnected from ${room.room}-room`);
		}
	});
}
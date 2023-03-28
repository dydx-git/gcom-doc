import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { ServerManager } from '@ghostebony/sse/server';
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = (event) => {
	const { locals } = event;
	const { room, validateUser } = locals;

	if (!validateUser) return fail(401, { message: 'You must be logged in to access this page' });

	return room.server(event.getClientAddress(), {
		connect: ({ user }) => {
			console.log(`User ${user} connected to ${room.room}-room`);
		},
		disconnect: ({ user }) => {
			console.log(`User ${user} disconnected from ${room.room}-room`);
		}
	});
}
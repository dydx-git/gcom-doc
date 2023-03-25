import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { ServerManager } from '@ghostebony/sse/server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = (event) => {
	const { locals: { room } } = event;

	return room.server(event.getClientAddress(), {
		connect: ({ user }) => {
			console.log(`User ${user} connected to ${room.room}-room`);
		},
		disconnect: ({ user }) => {
			console.log(`User ${user} disconnected from ${room.room}-room`);
		}
	});
}

import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { ServerManager } from '@ghostebony/sse/server';
import type { RequestHandler } from './$types';

const room = PUBLIC_SSE_CHANNEL;
const sse = ServerManager.addRoom(room);

export const GET: RequestHandler = (event) => {
	return sse.server(event.getClientAddress(), {
		connect: ({ user }) => {
			console.log(`User ${user} connected to ${room}-room`);
		},
		disconnect: ({ user }) => {
			console.log(`User ${user} disconnected from ${room}-room`);
		}
	});
}
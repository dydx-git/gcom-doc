import { ServerManager } from '@ghostebony/sse/server';
import type { RequestHandler } from './$types';

const sse = ServerManager.addRoom('job-room');

export const GET: RequestHandler = (event) =>
	sse.server(event.getClientAddress(), {
		connect: ({ user }) => {
			console.log(`User ${user} connected to job-room`);
		},
		disconnect: ({ user }) => {
			console.log(`User ${user} disconnected from job-room`);
		}
	});

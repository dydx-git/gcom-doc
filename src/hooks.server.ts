import { auth } from '$lib/modules/auth/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { ServerManager } from '@ghostebony/sse/server';

const handleAuth: Handle = async ({ event, resolve }) => {
	const authRequest = auth.handleRequest(event);
	event.locals.auth = authRequest;

	const pathname = event.url.pathname;
	let allowedPaths = ['/login', '/api/login'];
	if (dev) allowedPaths = allowedPaths.concat(['/api/register', '/register']);

	if (!allowedPaths.includes(pathname)) {
		const session = await event.locals.auth.validate();

		if (!session) {
			throw redirect(307, '/login');
		}
	}
	return resolve(event);
};

const addRoom: Handle = async ({ event, resolve }) => {
	const { locals } = event;
	locals.room = ServerManager.getRoom(PUBLIC_SSE_CHANNEL) || ServerManager.addRoom(PUBLIC_SSE_CHANNEL);

	return resolve(event);
}

export const handle: Handle = sequence(handleAuth, addRoom);

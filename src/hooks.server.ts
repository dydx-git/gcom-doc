import { handleHooks } from '@lucia-auth/sveltekit';
import { auth } from '$lib/models/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
const handleAuth: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	let allowedPaths = ['/login', '/api/login'];
	if (dev) allowedPaths = allowedPaths.concat(['/api/register', '/register']);

	if (!allowedPaths.includes(pathname)) {
		const { user } = await event.locals.validateUser();
		if (!user) {
			throw redirect(307, '/login');
		}
	}
	return await resolve(event);
};
export const handle: Handle = sequence(handleHooks(auth), handleAuth);

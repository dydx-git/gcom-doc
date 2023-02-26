import { handleHooks } from '@lucia-auth/sveltekit';
import { auth } from '$lib/models/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { form_data } from 'sk-form-data';
import { dev } from '$app/environment';

const handleAuth: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	if (!pathname.startsWith('/login') && !pathname.startsWith('/api/login')) {
		const { user } = await event.locals.validateUser();
		if (!user && !dev) {
			return new Response('Unauthorized. Please <a href="login">sign in</a>', {
				status: 401,
				headers: {
					'Content-Type': 'text/html'
				}
			});
		}
	}
	return await resolve(event);
};
export const handle: Handle = sequence(handleHooks(auth), handleAuth, form_data);

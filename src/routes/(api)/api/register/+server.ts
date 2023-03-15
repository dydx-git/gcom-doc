import { dev } from '$app/environment';
import { User } from '$lib/modules/auth/user';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) return new Response('Not allowed', { status: 403 });

	const { body } = request as { body: unknown };
	const { username, password } = body as { username: string; password: string };

	try {
		new User().create(username, password, 'ADMIN');
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
	return new Response('User created successfully');
};

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
	return new Response('all clients');
};

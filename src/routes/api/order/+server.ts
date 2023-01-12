import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
	return new Response('Hello, world!');
};

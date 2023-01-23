import type { Client } from '@prisma/client';
import { createObjectFromFormData } from '../core';
import { z } from 'zod';
import { fail, type Actions } from '@sveltejs/kit';
import type { RequestHandler } from '../api/client/$types';

const clientSchema = z.object({
	name: z.string()
});

export const POST: RequestHandler = async ({ request, fetch }) => {
	return new Response();
};

// export const POST: Actions = {
// 	create: async ({ request, fetch }) => {
// 		const formData = await request.formData();

// 		const client = createObjectFromFormData<Client>(formData);
// 		const submit = await fetch('/api/client', {
// 			method: 'POST',
// 			body: JSON.stringify(client)
// 		});

// 		if (submit.ok) return { success: true };
// 		else return fail(submit.status);
// 	}
// };

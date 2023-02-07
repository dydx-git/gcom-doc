import { createObjectFromFormData } from '$lib/core';
import type { Client } from '@prisma/client';
import { fail, type Actions } from '@sveltejs/kit';
import type { RequestHandler } from '../api/client/$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	return new Response();
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();

		const client = createObjectFromFormData<Client>(formData);
		const submit = await fetch('/api/client', {
			method: 'POST',
			body: JSON.stringify(client)
		});

		if (submit.ok)
			return { success: true, message: 'Form submitted successfully', status: submit.status };
		else return fail(submit.status);
	}
};

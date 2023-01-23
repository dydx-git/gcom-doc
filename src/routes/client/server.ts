// import type { Client } from '@prisma/client';
// import { error } from '@sveltejs/kit';
// import { createObjectFromFormData, verifyAgainst } from '../core';
// import type { RequestHandler } from './$types';

// export const POST: RequestHandler = async ({ request, fetch }) => {
// 	const formData = await request.formData();
// 	const verification = verifyAgainst<Partial<Client>>({ name: '', companyName: '' }, formData);

// 	if (!verification.success) throw error(400, { messages: verification.errors });

// 	const client = createObjectFromFormData<Client>(formData);
// 	const submit = await fetch('/api/client', {
// 		method: 'POST',
// 		body: JSON.stringify(client)
// 	});

// 	if (submit.ok) return new Response('OK');
// 	else throw error(submit.status);
// };

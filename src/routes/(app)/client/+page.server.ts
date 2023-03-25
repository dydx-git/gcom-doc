import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import prisma from '$db/client';
import { schema } from './meta';
import { Clients } from './client';
import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
import { ServerManager } from '@ghostebony/sse/server';

export const load: PageServerLoad = async (event) => {
	const form = superValidate(event, schema);
	const salesRep = prisma.salesRep.findMany({ select: { username: true, name: true } });
	const { locals } = event;
	const { user } = await locals.validateUser();
	if (!user) {
		return fail(401, { message: 'You must be logged in to access this page' });
	}
	const client = new Clients().read(user);

	return { form, salesRep, client };
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, schema);
		const { locals } = event;

		if (!form.valid) {
			return fail(400, { form });
		}

		ServerManager.sendRoomEveryone(PUBLIC_SSE_CHANNEL, PUBLIC_SSE_CHANNEL, { test: 'test' });

		return { form };
	}
};

import type { LayoutServerLoad } from './$types';
import prisma from "$db/client";
import { fail } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url: { pathname } }) => {
	const { user } = await locals.validateUser();
	if (!user) throw fail(401, { message: 'Unauthorized' });

	const salesRep = prisma.salesRep.findFirst({ select: { name: true }, where: { username: user.username } });

	return { user, salesRep, pathname };
};

import type { LayoutServerLoad } from './$types';
import prisma from "$db/client";
import { fail } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url: { pathname } }) => {
	const { user } = await locals.validateUser();
	if (!user) return fail(401, { message: 'Unauthorized' });

	const data = await prisma.user.findUniqueOrThrow({
		select: {
			username: true,
			role: true,
			SalesRep: {
				select: {
					name: true
				}
			},
			UserSettings: {
				select: {
					settings: true
				}
			}
		},
		where: { username: user.username }
	});


	return {
		user: {
			username: data.username,
			role: data.role,
			name: data.SalesRep?.name ?? "Not Set",
			settings: data.UserSettings[0]?.settings
		}, pathname
	};
};

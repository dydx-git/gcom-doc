import type { LayoutServerLoad } from './$types';
import prisma from "$db/client";
import { fail } from '@sveltejs/kit';
import { UserSettings } from '$lib/modules/userSettings/userSettings';

export const load: LayoutServerLoad = async ({ locals, url: { pathname } }) => {
	const session = await locals.auth.validate();
	const user = session?.user;

	if (!user) return fail(401, { message: 'Unauthorized' });

	try {
		const data = await prisma.user.findUniqueOrThrow({
			select: {
				username: true,
				role: true,
				SalesRep: {
					select: {
						name: true
					}
				}
			},
			where: { username: user.username }
		});


		return {
			pathname,
			isPageLoaded: false,
			user: {
				username: data.username,
				id: user.userId,
				role: data.role,
				name: data.SalesRep?.name ?? "Unknown",
				settings: new UserSettings().read({ username: data.username })
			}
		};
	} catch (error) {
		const err = error as Error;
		return fail(500, { message: err.message });
	}

};

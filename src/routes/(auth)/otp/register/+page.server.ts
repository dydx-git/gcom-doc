import { UserRoles } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.validateUser();
	if (user?.role !== UserRoles.ADMIN) throw error(401, 
	{
		message: 'Only admins can access this page',
		code: 401
	});
};

import type { UserCreateData } from '$lib/modules/auth/meta';
import { User } from '$lib/modules/auth/user';
import { validateObject } from '$lib/modules/common/functions/core';
import { SalesRepColor } from '$lib/modules/sales-rep/color';
import type { SalesRepColorsCreateData } from '$lib/modules/sales-rep/meta';
import { SalesRep } from '$lib/modules/sales-rep/sales-rep';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	if (data.colors.length < 3) throw error(400, { message: 'Must choose at least 3 colors' });

	const userData = validateObject<UserCreateData>(data);
	const colors = validateObject<SalesRepColorsCreateData>(data.colors);

	const user = await new User().create(userData.username, userData.password, userData.role);
	const salesRep = await new SalesRep().create({ ...userData, username: user.username });
	await new SalesRepColor().create(colors, user.username);

	return new Response();
};

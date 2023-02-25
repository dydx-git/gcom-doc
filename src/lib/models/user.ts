import type { UserRoles } from '@prisma/client';
import { auth } from './auth';

export class User {
	public async create(username: string, password: string, role: UserRoles) {
		const attributes = {
			role,
			username
		} as Lucia.UserAttributes;

		const user = await auth.createUser({
			key: {
				providerId: 'username',
				providerUserId: username,
				password
			},
			attributes
		});

		return user;
	}
}

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

	public async login(username: string, password: string) {
		const key = await auth.validateKeyPassword(
			'username',
			username,
			password
		);

		const session = await auth.createSession(key.userId);
		return session;
	}
}

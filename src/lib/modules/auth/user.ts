import type { UserRoles } from '@prisma/client';
import { auth } from './auth';

export class User {
	public async create(username: string, password: string, role: UserRoles) {
		username = username.toLowerCase();
		const attributes = {
			role,
			username
		} as Lucia.UserAttributes;

		const user = await auth.createUser({
			primaryKey: {
				providerId: 'username',
				providerUserId: username,
				password
			},
			attributes
		});

		return user;
	}

	public async login(username: string, password: string) {
		try {
			const key = await auth.useKey('username', username, password);
			const session = await auth.createSession(key.userId);
			return session;
		} catch {
			return null;
		}
	}
}

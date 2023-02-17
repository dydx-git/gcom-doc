import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import client from '$db/client';
import { dev } from '$app/environment';
import { Environment } from '$lib/interfaces/core';

export const auth = lucia({
	adapter: prismaAdapter(client),
	env: dev ? Environment.Development : Environment.Production,
	transformUserData: (user) => {
		return {
			userId: user.id,
			username: user.username,
			email: user.email,
			role: user.role
		};
	}
});

export type Auth = typeof auth;

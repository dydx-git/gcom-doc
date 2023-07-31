import { lucia } from "lucia";
import { prisma } from '@lucia-auth/adapter-prisma';
import client from '$db/client';
import { dev } from '$app/environment';
import { Environment } from '$lib/modules/common/interfaces/core';
import { sveltekit } from "lucia/middleware";

export const auth = lucia({
	adapter: prisma(client),
	env: dev ? Environment.Development : Environment.Production,
	middleware: sveltekit(),
	getUserAttributes: (user) => {
		return {
			userId: user.id,
			username: user.username,
			role: user.role
		};
	},
	sessionTimeout: {
		activePeriod: 1000 * 60 * 60 * 8,
		idlePeriod: 1000 * 60 * 60 * 2
	}
});

export type Auth = typeof auth;

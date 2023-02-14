import type { User } from '@prisma/client';

/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/models/auth').Auth;
	type UserAttributes = User;
}

declare global {
	namespace App {
		interface Error {
			message?: string;
			messages?: string[];
		}
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

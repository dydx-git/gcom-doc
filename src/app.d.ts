import type { User } from '@prisma/client';

declare global {
	namespace App {
		interface Error {
			message?: string;
			messages?: string[];
			code: number;
		}
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
			form_data: Record<string, any>;
		}
		// interface PageData {}
		// interface Platform {}
	}

	/// <reference types="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/models/auth').Auth;
		type UserAttributes = User;
	}
}

export { };

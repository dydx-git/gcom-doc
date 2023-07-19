import type { User } from '@prisma/client';
import type { Server } from "@ghostebony/sse/server";
import type { Settings } from '$lib/modules/userSettings/meta';

declare global {
	namespace App {
		interface Error {
			message?: string;
			messages?: string[];
			code?: number;
		}
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
			room: Server;
		}
		// interface PageData {}
		// interface Platform {}
	}

	/// <reference types="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/modules/auth/auth').Auth;
		type UserAttributes = User;
	}
}

export { };

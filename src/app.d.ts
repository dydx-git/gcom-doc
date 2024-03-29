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
			auth: import("lucia").AuthRequest;
			room: Server;
		}
		// interface PageData {}
		// interface Platform {}
	}

	/// <reference types="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/modules/auth/auth').Auth;
		type DatabaseUserAttributes = User;
		type DatabaseSessionAttributes = {};
	}
}

export { };

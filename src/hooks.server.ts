import { handleHooks } from '@lucia-auth/sveltekit';
import { auth } from '$lib/models/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = handleHooks(auth);

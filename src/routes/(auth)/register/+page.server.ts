import type { Actions } from './$types';

export const actions = {
	default: async ({ locals }) => {
		console.log('register page');
	}
} satisfies Actions;

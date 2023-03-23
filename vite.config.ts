import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'node:path';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$models: path.resolve('./src/lib/models'),
			$db: path.resolve('./src/lib/services/db'),
			$baseTypes: path.resolve('./prisma/generated/zod')
		}
	}
};

export default config;

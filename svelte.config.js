import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { optimizeImports, optimizeCss, elements } from 'carbon-preprocess-svelte';
import path from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), optimizeImports(), elements()],
	kit: {
		adapter: adapter()
	},
	vite: {
		plugins: [process.env.NODE_ENV === 'production' && optimizeCss()]
	},
	alias: {
		$models: path.resolve('./src/lib/models'),
		$db: path.resolve('./src/lib/services/db'),
		$interfaces: path.resolve('./src/lib/interfaces')
	}
};

export default config;

import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { optimizeImports, optimizeCss, elements, icons } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), optimizeImports(), elements()],
	kit: {
		adapter: adapter()
	},
	vite: {
		plugins: [process.env.NODE_ENV === "production" && optimizeCss()],
	},
	alias: {
		models: "./src/lib/models",
	}
};

export default config;

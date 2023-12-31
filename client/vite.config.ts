import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			onwarn(warning, defaultHandler) {
				// don't warn on <marquee> elements, cos they're cool
				if ((warning.code as string).indexOf('a11y') === 0) return;

				// handle all other warnings normally
				defaultHandler(warning);
			}
		}),
		tsconfigPaths()
	],
	optimizeDeps: {
		exclude: ['playwright/*']
	}
});

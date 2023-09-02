import { test as base } from '@playwright/test';
import { home } from './home';
import { note } from './note';

export const test = base.extend<{
	home: ReturnType<typeof home>;
	note: ReturnType<typeof note>;
}>({
	home: async ({ page }, use) => {
		await use(home(page));
	},
	note: async ({ page }, use) => {
		await use(note(page));
	}
});

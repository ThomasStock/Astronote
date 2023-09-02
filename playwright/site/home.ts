import { Page } from '@playwright/test';

export const home = (page: Page) => {
	return {
		visit: () => page.goto('/'),
		note: page.locator('#Note')
	};
};

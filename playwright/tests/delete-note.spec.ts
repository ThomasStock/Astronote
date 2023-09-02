import { test, expect } from '@playwright/test';

test('delete note', async ({ page }) => {
	await page.goto('/');

	const noteInput = page.locator('#Note');
	await noteInput.click();
	await noteInput.type('a');

	const noteUrl = page.url();
});

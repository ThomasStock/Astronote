import { test, expect } from '@playwright/test';

test('url changes to note when typing and can be revisted', async ({ page }) => {
	await page.goto('/');

	const noteInput = page.locator('#Note');
	await noteInput.click();
	await noteInput.type('a');

	const noteUrl = page.url();

	expect(noteUrl, 'url changes to /somethingHere after typing a letter').toMatch(/^.*\w+$/);

	await page.goto('/');
	await noteInput.click();
	await noteInput.type('b');

	const secondNoteUrl = page.url();

	await page.goto(noteUrl);
	await expect(
		noteInput,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('a');

	await page.goto(secondNoteUrl);
	await expect(
		noteInput,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('b');
});

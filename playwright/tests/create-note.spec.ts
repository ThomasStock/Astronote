import { expect } from '@playwright/test';
import { test } from 'site/base';

test('create note', async ({ page, note }) => {
	await page.goto('/');

	await note.type('a');

	const noteUrl = page.url();

	expect(noteUrl, 'url changes to /somethingHere after typing a letter').toMatch(/^.*\w+$/);

	await page.goBack();

	expect(page.url(), 'url changes back to initial url after going back').toBe(process.env.BASE_URL);

	await note.type('b');

	const secondNoteUrl = page.url();

	await page.goto(noteUrl);
	await expect(
		note.locator,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('a');

	await page.goto(secondNoteUrl);
	await expect(
		note.locator,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('b');

	await page.goto(process.env.BASE_URL);
	await expect(note.locator, 'base url has empty note').toHaveText('');
});

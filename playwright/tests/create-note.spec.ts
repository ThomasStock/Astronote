import { expect } from '@playwright/test';
import { test } from 'site/base';
import { delay } from 'utils/delay';

test('create note', async ({ page, note }) => {
	await page.goto('/');

	await note.click();
	await note.fill('a');

	// Since we are debouncing typing, wait for the typing to get flushed.
	await delay(300);

	const noteUrl = page.url();

	expect(noteUrl, 'url changes to /somethingHere after typing a letter').toMatch(/^.*\w+$/);

	await page.goto('/');
	await note.click();
	await note.fill('b');

	await delay(300);

	const secondNoteUrl = page.url();

	await page.goto(noteUrl);
	await expect(
		note,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('a');

	await page.goto(secondNoteUrl);
	await expect(
		note,
		'A created note url can be revisted and shows the correct note content'
	).toHaveText('b');
});

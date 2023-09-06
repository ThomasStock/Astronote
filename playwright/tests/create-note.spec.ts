import { expect } from '@playwright/test';
import { test } from 'site/base';

test('create note', async ({ page, note }) => {
	await page.goto('/');

	await note.click();
	await note.fill('a');

	const undoButton = page.getByLabel('undo');
	// Since we are debouncing typing, wait for the undo button to become visible
	// This indicates that the note change is flushed.
	await expect(undoButton, 'undo button becomes visible').toBeVisible();

	const noteUrl = page.url();

	expect(noteUrl, 'url changes to /somethingHere after typing a letter').toMatch(/^.*\w+$/);

	await page.goto('/');
	await note.click();
	await note.fill('b');

	await expect(undoButton, 'undo button becomes visible').toBeVisible();

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

import { expect } from '@playwright/test';
import { test } from 'site/base';
import { delay } from 'utils/delay';

test('undo-redo', async ({ page, note }) => {
	await page.goto('/');

	const redoButton = page.getByLabel('redo');
	const undoButton = page.getByLabel('undo');

	await expect(redoButton, 'redo button is hidden at start').toBeHidden();
	await expect(undoButton, 'undo button is hidden at start').toBeHidden();

	await note.type('abc');

	// wait for debounce
	await delay(300);

	const noteUrl = page.url();

	await expect(redoButton, 'redo button is hidden after typing').toBeHidden();
	await expect(undoButton, 'undo button is visible after typing').toBeVisible();

	await undoButton.click();

	await expect(note, 'typing is undone after pressing undo').toBeEmpty();
	await expect(page, 'returns to empty note after undoing').toHaveURL(process.env.BASE_URL);

	await expect(redoButton, 'redo button is visible after undoing action').toBeVisible();
	await expect(undoButton, 'undo button is hidden after undoing action').toBeHidden();

	await redoButton.click();

	await expect(redoButton, 'redo button is hidden after redoing action').toBeHidden();
	await expect(undoButton, 'undo button is visible after redoing action').toBeVisible();

	await expect(page, 'returns to note url when redoing').toHaveURL(noteUrl);
});

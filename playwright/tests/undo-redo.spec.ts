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
	await expect(note).toHaveText('abc');

	const noteUrl = page.url();

	await expect(redoButton, 'redo button is hidden after typing').toBeHidden();
	await expect(undoButton, 'undo button is visible after typing').toBeVisible();

	await undoButton.click();

	await expect(note, 'typing is undone after pressing undo').toBeEmpty();
	await expect(page, 'returns to empty note after undoing').toHaveURL(noteUrl);

	await expect(redoButton, 'redo button is visible after undoing action').toBeVisible();
	await expect(undoButton, 'undo button is hidden after undoing action').toBeHidden();

	await redoButton.click();

	await expect(redoButton, 'redo button is hidden after redoing action').toBeHidden();
	await expect(undoButton, 'undo button is visible after redoing action').toBeVisible();

	await expect(page, 'stays on note url when redoing').toHaveURL(noteUrl);

	await note.click();
	await note.type('def');
	await expect(note).toHaveText('abcdef');

	await undoButton.click();

	await expect(note, 'abcdef can be undone to abc').toHaveText('abc');

	await expect(redoButton, 'redo button is visible after undoing second action').toBeVisible();
	await expect(undoButton, 'undo button is visible after undoing second action').toBeVisible();

	await note.click();
	await note.type('xxx');
	await expect(note).toHaveText('abcxxx');

	await expect(note, 'abc becomes abcxxx after typing when in "undone" state').toHaveText('abcxxx');

	await expect(
		redoButton,
		'redo button is no longer visible after typing in "undone" state'
	).toBeHidden();

	await undoButton.click();

	await expect(note, 'abcxxx can be undone to abc').toHaveText('abc');

	await undoButton.click();

	await expect(note, 'note is empty when undoing all actions').toHaveText('');
	await expect(page, 'undoing all actions keeps you on the note').toHaveURL(noteUrl);

	await expect(redoButton, 'redo button is visible after undoing last action').toBeVisible();
	await expect(
		undoButton,
		'undo button is no longer visible after undoing last undoable action'
	).toBeHidden();

	await note.click();
	await note.type('xx');
	await delay(300);

	await expect(redoButton, 'redo button is no longer visible after creating a note').toBeHidden();
	await expect(undoButton, 'undo button is visible after undoing second action').toBeVisible();

	await page.goBack();

	await expect(
		redoButton,
		'redo button is no longer visible after using browser history'
	).toBeHidden();
	await expect(
		undoButton,
		'undo button is no longer visible after using browser history'
	).toBeHidden();
});

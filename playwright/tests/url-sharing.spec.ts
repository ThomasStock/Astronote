import { expect } from '@playwright/test';
import { test } from 'site/base';
import { delay } from 'utils/delay';

test('Open url in different browser', async ({ page, browser, note }) => {
	await page.goto('/');

	await note.type('foo');

	await delay(400);

	const noteUrl = page.url();

	// open page in a different context
	const context2 = await browser.newContext();
	const page2 = await context2.newPage();
	await page2.goto(noteUrl);
	const note2 = note.withPage(page2);

	await expect(note2.locator).toHaveText('foo');
});

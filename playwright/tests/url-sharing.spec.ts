import { expect } from '@playwright/test';
import { test } from 'site/base';

test('Open url in different browser', async ({ page, browser, note }) => {
	await page.goto('/');

	await note.type('foo');

	const noteUrl = page.url();

	// open page in a different context
	const context2 = await browser.newContext();
	const page2 = await context2.newPage();
	await page2.goto(noteUrl);
	const note2 = note.withPage(page2);

	await expect(note2.locator).toHaveText('foo');
});

// postgresql policy example allow insert update delete on a table for anonymous users
// https://www.postgresql.org/docs/9.1/sql-grant.html
// GRANT SELECT, INSERT, UPDATE, DELETE ON products TO anonymous;

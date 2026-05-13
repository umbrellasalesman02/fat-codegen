import { expect, test } from '@playwright/test';

test('web loads and supports todo CRUD', async ({ page }) => {
  const todoTitle = `Ship TODO RPC ${Date.now()}`;

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TypeScript Effect TODO Starter' })).toBeVisible();
  await expect(page.locator('#health-status')).toContainText('API healthy');

  const input = page.getByLabel('New todo title');
  await input.fill(todoTitle);
  await page.getByRole('button', { name: 'Add' }).click();

  const item = page.getByText(todoTitle);
  await expect(item).toBeVisible();

  await page.getByLabel(`Toggle ${todoTitle}`).click();
  await expect(item.first()).toHaveCSS('text-decoration-line', 'line-through');

  await item.first().locator("xpath=../button[normalize-space()='Delete']").click();
  await expect(item.first()).not.toBeVisible();
});

test('title route renders seed summary and explicit scope messaging', async ({ page }) => {
  await page.goto('/titles/9B433A0E-7EBC-435C-8A99-D966BC17BA30');
  await expect(page.getByRole('heading', { name: 'Title Read Summary' })).toBeVisible();
  await expect(page.getByText('17976250-18D1-4894-92D9-45198AB5C309')).toBeVisible();

  await page.goto('/titles/not-in-slice');
  await expect(page.getByRole('heading', { name: 'Title Slice Scope' })).toBeVisible();
  await expect(page.locator('#title-scope-message')).toContainText(
    'outside the current slice scope',
  );
});

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

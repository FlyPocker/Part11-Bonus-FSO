import { test, expect } from '@playwright/test'

test('phonebook application loads', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Phonebook' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'add' })).toBeVisible()
})
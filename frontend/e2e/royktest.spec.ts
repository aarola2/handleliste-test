import { expect, test } from '@playwright/test'

test('siden laster og viser overskriften', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'Handleliste' })).toBeVisible()
})

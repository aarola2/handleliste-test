import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    items: page.getByRole('listitem'),
    remove: (name: string) => page.getByRole('button', { name: `Slett ${name}`, exact: true }),
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const { field } = controls(page)
  for (const name of ['Melk', 'Brød', 'Egg']) {
    await field.fill(name)
    await field.press('Enter')
  }
})

test('hver vare har en sletteknapp med varens navn', async ({ page }) => {
  const { remove } = controls(page)

  for (const name of ['Melk', 'Brød', 'Egg']) {
    await expect(remove(name)).toBeVisible()
  }
})

test('når den handlende trykker på knappen, forsvinner varen', async ({ page }) => {
  const { items, remove } = controls(page)

  await remove('Melk').click()

  await expect(remove('Melk')).toHaveCount(0)
  await expect(items).toHaveCount(2)
})

test('de andre varene blir stående', async ({ page }) => {
  const { items, remove } = controls(page)

  await remove('Brød').click()

  await expect(items).toHaveCount(2)
  await expect(items).toContainText(['Melk', 'Egg'])
})

test('sletteknappen kan brukes med tastatur', async ({ page }) => {
  const { field, items, remove } = controls(page)

  await remove('Brød').focus()
  await page.keyboard.press('Enter')
  await expect(remove('Brød')).toHaveCount(0)
  await expect(field).toBeFocused()

  await remove('Egg').focus()
  await page.keyboard.press('Space')
  await expect(remove('Egg')).toHaveCount(0)

  await expect(items).toHaveCount(1)
  await expect(items).toContainText(['Melk'])
})

import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    items: page.getByRole('listitem'),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
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

test('en vare som krysses av, står under alle varer som ikke er handlet', async ({ page }) => {
  const { items, checkbox } = controls(page)

  await checkbox('Melk').check()

  await expect(items).toContainText(['Brød', 'Egg', 'Melk'])
})

test('handlede varer vises med gjennomstreking', async ({ page }) => {
  const { items, checkbox } = controls(page)

  await checkbox('Brød').check()

  const name = (text: string) => items.getByText(text, { exact: true })
  await expect(name('Brød')).toHaveCSS('text-decoration-line', 'line-through')
  await expect(name('Melk')).toHaveCSS('text-decoration-line', 'none')
})

test('en vare som får fjernet avkrysningen, står igjen blant varene som ikke er handlet', async ({
  page,
}) => {
  const { items, checkbox } = controls(page)
  await checkbox('Melk').check()
  await checkbox('Brød').check()
  await expect(items).toContainText(['Egg', 'Melk', 'Brød'])

  await checkbox('Melk').uncheck()

  // Ellers står varene i den rekkefølgen de ble lagt til (antatt i issuet).
  await expect(items).toContainText(['Melk', 'Egg', 'Brød'])
  await expect(items.getByText('Melk', { exact: true })).toHaveCSS('text-decoration-line', 'none')
})

import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    add: page.getByRole('button', { name: 'Legg til' }),
    items: page.getByRole('listitem'),
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('«Melk» + Enter viser «Melk» i listen', async ({ page }) => {
  const { field, items } = controls(page)

  await field.fill('Melk')
  await field.press('Enter')

  await expect(items).toHaveText(['Melk'])
})

test('«Brød» + klikk på «Legg til» viser «Brød» i listen', async ({ page }) => {
  const { field, add, items } = controls(page)

  await field.fill('Brød')
  await add.click()

  await expect(items).toHaveText(['Brød'])
})

test('feltet er tomt etter at varen er lagt til', async ({ page }) => {
  const { field, add, items } = controls(page)

  await field.fill('Egg')
  await add.click()

  await expect(items).toHaveText(['Egg'])
  await expect(field).toHaveValue('')
})

test('feltet har synlig etikett, og feltet og knappen brukes med tastatur', async ({ page }) => {
  const { field, add, items } = controls(page)

  await expect(page.getByText('Vare', { exact: true })).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(field).toBeFocused()
  await page.keyboard.type('Melk')
  await page.keyboard.press('Tab')
  await expect(add).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(items).toHaveText(['Melk'])
})

test('en vare som heter <b>x</b> vises som ren tekst', async ({ page }) => {
  const { field, items } = controls(page)

  await field.fill('<b>x</b>')
  await field.press('Enter')

  await expect(items).toHaveText(['<b>x</b>'])
  await expect(items.getByText('x', { exact: true })).toHaveCount(0)
})

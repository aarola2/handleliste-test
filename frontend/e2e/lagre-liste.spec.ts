import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    items: page.getByRole('listitem'),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
    remove: (name: string) => page.getByRole('button', { name: `Slett ${name}`, exact: true }),
  }
}

async function addItems(page: Page, names: string[]) {
  const { field } = controls(page)
  for (const name of names) {
    await field.fill(name)
    await field.press('Enter')
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('en vare som er lagt til, står der etter at siden er lastet på nytt', async ({ page }) => {
  const { items } = controls(page)
  await addItems(page, ['Melk', 'Brød'])

  await page.reload()

  await expect(items).toHaveCount(2)
  await expect(items).toContainText(['Melk', 'Brød'])
})

test('avkrysningen er bevart etter omlasting', async ({ page }) => {
  const { checkbox } = controls(page)
  await addItems(page, ['Melk', 'Brød'])
  await checkbox('Melk').check()

  await page.reload()

  await expect(checkbox('Melk')).toBeChecked()
  await expect(checkbox('Brød')).not.toBeChecked()
})

test('en slettet vare kommer ikke tilbake etter omlasting', async ({ page }) => {
  const { items, remove } = controls(page)
  await addItems(page, ['Melk', 'Brød'])
  await remove('Melk').click()
  await expect(items).toHaveCount(1)

  await page.reload()

  await expect(items).toHaveCount(1)
  await expect(remove('Melk')).toHaveCount(0)
  await expect(remove('Brød')).toBeVisible()
})

test('det går ingen nettverkskall ut for å lagre listen', async ({ page }) => {
  const { checkbox, remove, items } = controls(page)
  const requests: string[] = []
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`))

  await addItems(page, ['Melk', 'Brød'])
  await checkbox('Melk').check()
  await remove('Brød').click()
  await expect(items).toHaveCount(1)

  expect(requests).toEqual([])

  // Listen er likevel lagret: den står der etter omlasting.
  await page.reload()
  await expect(checkbox('Melk')).toBeChecked()
})

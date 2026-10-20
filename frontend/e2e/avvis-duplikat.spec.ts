import { expect, test, type Page } from '@playwright/test'

const duplicateMessage = 'Melk står allerede på listen.'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    message: page.getByRole('alert'),
    items: page.getByRole('listitem'),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
  }
}

async function addItem(page: Page, name: string) {
  const { field } = controls(page)
  await field.fill(name)
  await field.press('Enter')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await addItem(page, 'Melk')
})

test('når «Melk» står i listen, gir «melk» og «MELK» ingen ny vare, og beskjeden vises', async ({
  page,
}) => {
  const { message, items } = controls(page)

  for (const name of ['melk', 'MELK']) {
    await addItem(page, name)

    await expect(message).toHaveText(duplicateMessage)
    await expect(items).toHaveCount(1)
  }
})

test('når «Melk» er krysset av som handlet, gir «melk» heller ingen ny vare, og beskjeden vises', async ({
  page,
}) => {
  const { message, items, checkbox } = controls(page)
  await checkbox('Melk').check()

  await addItem(page, 'melk')

  await expect(message).toHaveText(duplicateMessage)
  await expect(items).toHaveCount(1)
  await expect(checkbox('Melk')).toBeChecked()
})

test('« melk » regnes som duplikat', async ({ page }) => {
  const { message, items } = controls(page)

  await addItem(page, '  melk  ')

  await expect(message).toHaveText(duplicateMessage)
  await expect(items).toHaveCount(1)
})

test('beskjeden står i et varselområde som skjermlesere leser opp', async ({ page }) => {
  const { message } = controls(page)

  // Området må finnes før beskjeden kommer, ellers blir endringen ikke lest opp.
  await expect(message).toBeAttached()
  await expect(message).toHaveText('')

  await addItem(page, 'melk')

  await expect(message).toHaveText(duplicateMessage)
})

import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    counter: page.getByRole('status'),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
    remove: (name: string) => page.getByRole('button', { name: `Slett ${name}`, exact: true }),
  }
}

async function addItem(page: Page, name: string) {
  const { field } = controls(page)
  await field.fill(name)
  await field.press('Enter')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('med tre varer, der én er krysset av, viser telleren 2', async ({ page }) => {
  const { counter, checkbox } = controls(page)
  for (const name of ['Melk', 'Brød', 'Egg']) {
    await addItem(page, name)
  }

  await checkbox('Brød').check()

  await expect(counter).toHaveText('2 varer igjen')
})

test('telleren oppdateres når en vare legges til, krysses av, får fjernet avkrysningen eller slettes', async ({
  page,
}) => {
  const { counter, checkbox, remove } = controls(page)

  await addItem(page, 'Melk')
  await expect(counter).toHaveText('1 vare igjen')
  await addItem(page, 'Brød')
  await expect(counter).toHaveText('2 varer igjen')

  await checkbox('Melk').check()
  await expect(counter).toHaveText('1 vare igjen')
  await checkbox('Melk').uncheck()
  await expect(counter).toHaveText('2 varer igjen')

  await remove('Brød').click()
  await expect(counter).toHaveText('1 vare igjen')
})

test('telleren står i et statusområde som skjermlesere leser opp ved endring', async ({ page }) => {
  const { counter } = controls(page)

  // Området må finnes før endringen, ellers blir den ikke lest opp.
  await expect(counter).toHaveText('0 varer igjen')

  await addItem(page, 'Melk')

  await expect(counter).toHaveText('1 vare igjen')
})

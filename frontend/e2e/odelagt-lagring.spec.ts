import { expect, test, type Page } from '@playwright/test'

// Samme nøkkel som appen bruker. Lagringen fylles før appen starter.
const storageKey = 'handleliste'

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

/** Samler feil som ellers ville gitt hvit skjerm. */
function collectPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

async function openWithStored(page: Page, saved: string) {
  await page.addInitScript(
    ([key, value]) => {
      localStorage.setItem(key, value)
    },
    [storageKey, saved] as const,
  )
  await page.goto('/')
}

test('ugyldige lagrede data gir tom liste og ingen krasj', async ({ page }) => {
  const errors = collectPageErrors(page)
  const { items } = controls(page)

  await openWithStored(page, '{ikke json')

  await expect(page.getByRole('heading', { name: 'Handleliste' })).toBeVisible()
  await expect(page.getByText('Listen er tom.', { exact: true })).toBeVisible()
  await expect(items).toHaveCount(0)
  await addItems(page, ['Melk'])
  await expect(items).toHaveCount(1)
  expect(errors).toEqual([])
})

test('lagrede oppføringer med feil form, for eksempel uten navn, vises ikke', async ({ page }) => {
  const errors = collectPageErrors(page)
  const { items, checkbox } = controls(page)

  await openWithStored(
    page,
    JSON.stringify([
      { id: 1, name: 'Melk', bought: false },
      { id: 2, bought: false },
      { id: 3, name: 42, bought: true },
      null,
      { id: 4, name: 'Brød', bought: 'ja' },
    ]),
  )

  await expect(items).toHaveCount(1)
  await expect(checkbox('Melk')).not.toBeChecked()

  // Den filtrerte listen virker videre: en ny vare kan legges til og krysses av.
  await addItems(page, ['Egg'])
  await checkbox('Egg').check()
  await expect(items).toHaveCount(2)
  await expect(checkbox('Melk')).not.toBeChecked()
  expect(errors).toEqual([])
})

test('når lagring er blokkert, kan den handlende legge til, krysse av og slette', async ({ page }) => {
  const errors = collectPageErrors(page)
  const { items, checkbox, remove } = controls(page)
  // Slik oppfører nettleseren seg når nettstedsdata er blokkert, for eksempel i enkelte private moduser.
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('Lagring er blokkert', 'SecurityError')
    }
    Storage.prototype.getItem = blocked
    Storage.prototype.setItem = blocked
  })
  await page.goto('/')

  await addItems(page, ['Melk', 'Brød'])
  await checkbox('Melk').check()
  await remove('Brød').click()

  await expect(items).toHaveCount(1)
  await expect(checkbox('Melk')).toBeChecked()
  expect(errors).toEqual([])
})

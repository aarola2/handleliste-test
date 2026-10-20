import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
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
  await addItems(page, ['Melk', 'Brød'])
})

test('hver vare har en avkrysningsboks merket med varens navn', async ({ page }) => {
  const { checkbox } = controls(page)

  await expect(page.getByRole('checkbox')).toHaveCount(2)
  await expect(checkbox('Melk')).not.toBeChecked()
  await expect(checkbox('Brød')).not.toBeChecked()
})

test('når «Melk» krysses av, er boksen avkrysset', async ({ page }) => {
  const { checkbox } = controls(page)

  await checkbox('Melk').check()

  await expect(checkbox('Melk')).toBeChecked()
  await expect(checkbox('Brød')).not.toBeChecked()
})

test('når «Melk» krysses av igjen, er boksen ikke lenger avkrysset', async ({ page }) => {
  const { checkbox } = controls(page)

  await checkbox('Melk').click()
  await expect(checkbox('Melk')).toBeChecked()
  await checkbox('Melk').click()

  await expect(checkbox('Melk')).not.toBeChecked()
})

test('avkrysning virker med tastatur', async ({ page }) => {
  const { checkbox } = controls(page)

  await checkbox('Melk').focus()
  await page.keyboard.press('Space')
  await expect(checkbox('Melk')).toBeChecked()
  await expect(checkbox('Melk')).toBeFocused()

  // «Melk» er nå flyttet under «Brød» (#11). Sletteknappen står mellom avkrysningsboksene i tabulatorrekkefølgen (som i prototypen).
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: 'Slett Brød' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(checkbox('Brød')).toBeFocused()
  await page.keyboard.press('Space')
  await expect(checkbox('Brød')).toBeChecked()

  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Shift+Tab')
  await expect(checkbox('Melk')).toBeFocused()
  await page.keyboard.press('Space')
  await expect(checkbox('Melk')).not.toBeChecked()
})

import { expect, test, type Page } from '@playwright/test'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    empty: page.getByText('Listen er tom.', { exact: true }),
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

test('uten varer vises en melding om at listen er tom', async ({ page }) => {
  const { empty } = controls(page)

  await expect(empty).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(0)
})

test('meldingen forsvinner når den første varen legges til, og kommer tilbake når den siste slettes', async ({
  page,
}) => {
  const { empty, remove } = controls(page)

  await addItem(page, 'Melk')
  await expect(empty).toBeHidden()
  await addItem(page, 'Brød')

  await remove('Melk').click()
  await expect(empty).toBeHidden()

  await remove('Brød').click()
  await expect(empty).toBeVisible()
})

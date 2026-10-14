import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test, type Page } from '@playwright/test'

// Prototypen er en selvstendig fil i docs/design/ og åpnes direkte fra disk, uten appserveren.
const prototypeUrl = pathToFileURL(
  resolve(import.meta.dirname, '../../docs/design/handleliste.html'),
).href

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    add: page.getByRole('button', { name: 'Legg til' }),
    message: page.getByRole('alert'),
    items: page.getByRole('listitem'),
    checkbox: (name: string) => page.getByRole('checkbox', { name, exact: true }),
    remove: (name: string) => page.getByRole('button', { name: `Slett ${name}`, exact: true }),
  }
}

test('er én selvstendig fil som virker uten server og nett', async ({ page }) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) externalRequests.push(request.url())
  })
  await page.goto(prototypeUrl)
  const { field, add, checkbox } = controls(page)

  await field.fill('Ost')
  await add.click()

  await expect(checkbox('Ost')).toBeVisible()
  expect(externalRequests).toEqual([])
})

test('viser felt, knapp, avkrysning og sletting per vare, og teller', async ({ page }) => {
  await page.goto(prototypeUrl)
  const { field, add, checkbox, remove } = controls(page)

  await expect(field).toBeVisible()
  await expect(add).toBeVisible()
  for (const name of ['Melk', 'Brød', 'Egg']) {
    await expect(checkbox(name)).toBeVisible()
    await expect(remove(name)).toBeVisible()
  }
  await expect(page.getByText('2 varer igjen')).toBeVisible()
})

test('viser feilmelding ved tom tekst og beskjed ved duplikat', async ({ page }) => {
  await page.goto(prototypeUrl)
  const { field, add, message, items } = controls(page)

  await add.click()
  await expect(message).toHaveText('Skriv inn navnet på en vare.')

  await field.fill('   ')
  await add.click()
  await expect(message).toHaveText('Skriv inn navnet på en vare.')

  await field.fill('melk')
  await add.click()
  await expect(message).toHaveText('Melk står allerede på listen.')

  await field.fill('EGG')
  await add.click()
  await expect(message).toHaveText('Egg står allerede på listen.')

  await expect(items).toHaveCount(3)
})

test('viser handlede varer nederst med gjennomstreking, og melding ved tom liste', async ({ page }) => {
  await page.goto(prototypeUrl)
  const { items, checkbox, remove } = controls(page)
  const melk = page.getByText('Melk', { exact: true })

  await checkbox('Melk').check()
  await expect(items).toHaveText([/Brød/, /Melk/, /Egg/])
  await expect(melk).toHaveCSS('text-decoration-line', 'line-through')
  await expect(page.getByText('1 vare igjen')).toBeVisible()

  await checkbox('Melk').uncheck()
  await expect(items).toHaveText([/Melk/, /Brød/, /Egg/])
  await expect(melk).toHaveCSS('text-decoration-line', 'none')

  for (const name of ['Melk', 'Brød', 'Egg']) {
    await remove(name).click()
  }
  await expect(items).toHaveCount(0)
  await expect(page.getByText('Listen er tom.')).toBeVisible()
})

test.describe('på mobil', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('er brukbar i 375 px bredde og kan betjenes bare med tastatur', async ({ page }) => {
    await page.goto(prototypeUrl)
    const { field, add, checkbox, remove } = controls(page)

    // Uttrykket kjøres i nettleseren; e2e-oppsettet har ikke DOM-typer.
    const scrollsSideways = await page.evaluate<boolean>(
      'document.documentElement.scrollWidth > document.documentElement.clientWidth',
    )
    expect(scrollsSideways).toBe(false)

    await page.keyboard.press('Tab')
    await expect(field).toBeFocused()
    await page.keyboard.type('Ost')
    await page.keyboard.press('Enter')
    await expect(checkbox('Ost')).toBeVisible()
    await expect(field).toHaveValue('')

    await page.keyboard.press('Tab')
    await expect(add).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(checkbox('Melk')).toBeFocused()
    await page.keyboard.press('Space')
    await expect(checkbox('Melk')).toBeChecked()
    await expect(checkbox('Melk')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(remove('Melk')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(checkbox('Melk')).toHaveCount(0)
    await expect(field).toBeFocused()
  })
})

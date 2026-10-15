import { expect, test, type Page } from '@playwright/test'

const emptyNameMessage = 'Skriv inn navnet på en vare.'

function controls(page: Page) {
  return {
    field: page.getByLabel('Vare', { exact: true }),
    add: page.getByRole('button', { name: 'Legg til' }),
    message: page.getByRole('alert'),
    items: page.getByRole('listitem'),
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('tomt felt + «Legg til» legger ikke til noe og viser en feilmelding', async ({ page }) => {
  const { add, message, items } = controls(page)

  await add.click()

  await expect(message).toHaveText(emptyNameMessage)
  await expect(items).toHaveCount(0)
})

test('tekst med bare mellomrom gir samme resultat', async ({ page }) => {
  const { field, message, items } = controls(page)

  await field.fill('   ')
  await field.press('Enter')

  await expect(message).toHaveText(emptyNameMessage)
  await expect(items).toHaveCount(0)
})

test('feilmeldingen står i et varselområde som skjermlesere leser opp', async ({ page }) => {
  const { add, message } = controls(page)

  // Området må finnes før meldingen kommer, ellers blir endringen ikke lest opp.
  await expect(message).toBeAttached()
  await expect(message).toHaveText('')

  await add.click()

  await expect(message).toHaveText(emptyNameMessage)
})

test('feilmeldingen forsvinner når en gyldig vare legges til', async ({ page }) => {
  const { field, add, message, items } = controls(page)

  await add.click()
  await expect(message).toHaveText(emptyNameMessage)

  await field.fill('Melk')
  await add.click()

  // Sjekker navnet, ikke hele raden, så testen tåler flere kontroller i raden (avkrysning og sletting).
  await expect(items).toHaveCount(1)
  await expect(items).toContainText(['Melk'])
  await expect(message).toHaveText('')
})

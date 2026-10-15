import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { AddItemForm } from './AddItemForm.tsx'

function setup() {
  const onAdd = vi.fn<(name: string) => void>()
  render(<AddItemForm onAdd={onAdd} />)
  return {
    onAdd,
    user: userEvent.setup(),
    field: screen.getByLabelText('Vare'),
    button: screen.getByRole('button', { name: 'Legg til' }),
  }
}

test('sender navnet når jeg trykker Enter', async () => {
  const { onAdd, user, field } = setup()

  await user.type(field, 'Melk{Enter}')

  expect(onAdd).toHaveBeenCalledExactlyOnceWith('Melk')
})

test('sender navnet når jeg klikker «Legg til»', async () => {
  const { onAdd, user, field, button } = setup()

  await user.type(field, 'Brød')
  await user.click(button)

  expect(onAdd).toHaveBeenCalledExactlyOnceWith('Brød')
})

test('tømmer feltet etter innsending', async () => {
  const { user, field } = setup()

  await user.type(field, 'Melk{Enter}')

  expect(field).toHaveValue('')
})

test('sender ikke et tomt navn, men viser en feilmelding', async () => {
  const { onAdd, user, button } = setup()

  await user.click(button)

  expect(onAdd).not.toHaveBeenCalled()
  expect(screen.getByRole('alert')).toHaveTextContent('Skriv inn navnet på en vare.')
})

test('sender ikke et navn med bare mellomrom, men viser en feilmelding', async () => {
  const { onAdd, user, field } = setup()

  await user.type(field, '   {Enter}')

  expect(onAdd).not.toHaveBeenCalled()
  expect(screen.getByRole('alert')).toHaveTextContent('Skriv inn navnet på en vare.')
})

test('viser ingen feilmelding før skjemaet er sendt', () => {
  setup()

  expect(screen.getByRole('alert')).toBeEmptyDOMElement()
})

test('fjerner feilmeldingen når en gyldig vare sendes', async () => {
  const { onAdd, user, field, button } = setup()

  await user.click(button)
  await user.type(field, 'Melk{Enter}')

  expect(onAdd).toHaveBeenCalledExactlyOnceWith('Melk')
  expect(screen.getByRole('alert')).toBeEmptyDOMElement()
})

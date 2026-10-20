import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
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

describe('duplikat', () => {
  const melk = { id: 1, name: 'Melk', bought: false }

  function setupWithMelk() {
    const onAdd = vi.fn<(name: string) => void>()
    const findExisting = vi.fn((name: string) => (name.trim().toLowerCase() === 'melk' ? melk : undefined))
    render(<AddItemForm onAdd={onAdd} findExisting={findExisting} />)
    return { onAdd, findExisting, user: userEvent.setup(), field: screen.getByLabelText('Vare') }
  }

  test('sender ikke en vare som finnes, men sier fra med navnet slik det står i listen', async () => {
    const { onAdd, findExisting, user, field } = setupWithMelk()

    await user.type(field, 'mElK{Enter}')

    expect(findExisting).toHaveBeenCalledWith('mElK')
    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Melk står allerede på listen.')
  })

  test('lar teksten stå i feltet så den kan rettes', async () => {
    const { user, field } = setupWithMelk()

    await user.type(field, 'melk{Enter}')

    expect(field).toHaveValue('melk')
  })

  test('fjerner beskjeden når en ny vare sendes', async () => {
    const { onAdd, user, field } = setupWithMelk()

    await user.type(field, 'melk{Enter}')
    await user.clear(field)
    await user.type(field, 'Brød{Enter}')

    expect(onAdd).toHaveBeenCalledExactlyOnceWith('Brød')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
  })
})

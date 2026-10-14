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

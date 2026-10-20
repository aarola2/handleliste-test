import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App.tsx'

test('viser overskriften', () => {
  render(<App />)

  expect(screen.getByRole('heading', { level: 1, name: 'Handleliste' })).toBeInTheDocument()
})

test('legger en ny vare i listen', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByLabelText('Vare'), 'Melk{Enter}')

  expect(screen.getByRole('listitem')).toHaveTextContent('Melk')
})

test('sletter en vare, lar de andre stå og gir fokus til feltet', async () => {
  const user = userEvent.setup()
  render(<App />)
  const field = screen.getByLabelText('Vare')
  await user.type(field, 'Melk{Enter}')
  await user.type(field, 'Brød{Enter}')

  await user.click(screen.getByRole('button', { name: 'Slett Melk' }))

  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.getByRole('listitem')).toHaveTextContent('Brød')
  expect(field).toHaveFocus()
})

test('kan legge til samme navn på nytt etter sletting', async () => {
  const user = userEvent.setup()
  render(<App />)
  const field = screen.getByLabelText('Vare')
  await user.type(field, 'Melk{Enter}')
  await user.click(screen.getByRole('button', { name: 'Slett Melk' }))

  await user.type(field, 'Melk{Enter}')

  expect(screen.getByRole('button', { name: 'Slett Melk' })).toBeInTheDocument()
})

test('krysser av en vare og fjerner avkrysningen igjen', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Vare'), 'Melk{Enter}')
  const checkbox = screen.getByRole('checkbox', { name: 'Melk' })

  await user.click(checkbox)
  expect(checkbox).toBeChecked()

  await user.click(checkbox)
  expect(checkbox).not.toBeChecked()
})

test('husker varer, avkrysning og sletting når appen startes på nytt', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<App />)
  const field = screen.getByLabelText('Vare')
  for (const name of ['Melk', 'Brød', 'Egg']) {
    await user.type(field, `${name}{Enter}`)
  }
  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))
  await user.click(screen.getByRole('button', { name: 'Slett Brød' }))
  unmount()

  render(<App />)

  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(screen.getByRole('checkbox', { name: 'Melk' })).toBeChecked()
  expect(screen.getByRole('checkbox', { name: 'Egg' })).not.toBeChecked()
  expect(screen.queryByRole('checkbox', { name: 'Brød' })).not.toBeInTheDocument()
})

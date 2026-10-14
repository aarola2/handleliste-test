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

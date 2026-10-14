import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App.tsx'

test('viser overskriften', () => {
  render(<App />)

  expect(screen.getByRole('heading', { level: 1, name: 'Handlelista' })).toBeInTheDocument()
})

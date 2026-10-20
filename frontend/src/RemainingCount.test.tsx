import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RemainingCount } from './RemainingCount.tsx'

test('teller varene som ikke er handlet', () => {
  render(
    <RemainingCount
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: true },
        { id: 3, name: 'Egg', bought: false },
      ]}
    />,
  )

  expect(screen.getByRole('status')).toHaveTextContent('2 varer igjen')
})

test('bruker entall når én vare gjenstår', () => {
  render(<RemainingCount items={[{ id: 1, name: 'Melk', bought: false }]} />)

  expect(screen.getByRole('status')).toHaveTextContent('1 vare igjen')
})

test('viser 0 når alt er handlet', () => {
  render(<RemainingCount items={[{ id: 1, name: 'Melk', bought: true }]} />)

  expect(screen.getByRole('status')).toHaveTextContent('0 varer igjen')
})

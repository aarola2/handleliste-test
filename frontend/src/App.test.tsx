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

test('avviser en vare som allerede står i listen, også når den er krysset av', async () => {
  const user = userEvent.setup()
  render(<App />)
  const field = screen.getByLabelText('Vare')
  await user.type(field, 'Melk{Enter}')
  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))

  await user.type(field, 'MELK{Enter}')

  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.getByRole('alert')).toHaveTextContent('Melk står allerede på listen.')
})

test('flytter en avkrysset vare nederst og tilbake til plassen sin når avkrysningen fjernes', async () => {
  const user = userEvent.setup()
  render(<App />)
  const field = screen.getByLabelText('Vare')
  for (const name of ['Melk', 'Brød', 'Egg']) {
    await user.type(field, `${name}{Enter}`)
  }
  const names = () => screen.getAllByRole('listitem').map((item) => item.firstElementChild?.textContent)

  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))
  expect(names()).toEqual(['Brød', 'Egg', 'Melk'])

  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))
  expect(names()).toEqual(['Melk', 'Brød', 'Egg'])
})

test('viser at listen er tom til den første varen legges til, og igjen når den siste slettes', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(screen.getByText('Listen er tom.')).toBeInTheDocument()

  await user.type(screen.getByLabelText('Vare'), 'Melk{Enter}')
  expect(screen.queryByText('Listen er tom.')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Slett Melk' }))
  expect(screen.getByText('Listen er tom.')).toBeInTheDocument()
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

test('oppdaterer telleren når varer legges til, krysses av, får fjernet avkrysningen og slettes', async () => {
  const user = userEvent.setup()
  render(<App />)
  const field = screen.getByLabelText('Vare')
  const counter = screen.getByRole('status')
  expect(counter).toHaveTextContent('0 varer igjen')

  await user.type(field, 'Melk{Enter}')
  expect(counter).toHaveTextContent('1 vare igjen')
  await user.type(field, 'Brød{Enter}')
  expect(counter).toHaveTextContent('2 varer igjen')

  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))
  expect(counter).toHaveTextContent('1 vare igjen')
  await user.click(screen.getByRole('checkbox', { name: 'Melk' }))
  expect(counter).toHaveTextContent('2 varer igjen')

  await user.click(screen.getByRole('button', { name: 'Slett Brød' }))
  expect(counter).toHaveTextContent('1 vare igjen')
})

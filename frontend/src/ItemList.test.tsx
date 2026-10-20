import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { ItemList } from './ItemList.tsx'

const noop = () => undefined

test('viser varene i rekkefølge', () => {
  render(
    <ItemList
      onToggle={noop}
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: false },
      ]}
    />,
  )

  const names = screen.getAllByRole('listitem').map((item) => item.firstElementChild?.textContent)
  expect(names).toEqual(['Melk', 'Brød'])
})

test('viser et navn med HTML som ren tekst', () => {
  render(
    <ItemList
      onToggle={noop}
      onRemove={noop}
      items={[{ id: 1, name: '<b>x</b>', bought: false }]}
    />,
  )

  const item = screen.getByRole('listitem')
  expect(item).toHaveTextContent('<b>x</b>')
  expect(item.querySelector('b')).toBeNull()
})

test('gir hver vare en avkrysningsboks merket med navnet, avkrysset når varen er handlet', () => {
  render(
    <ItemList
      onToggle={noop}
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: true },
      ]}
    />,
  )

  expect(screen.getByRole('checkbox', { name: 'Melk' })).not.toBeChecked()
  expect(screen.getByRole('checkbox', { name: 'Brød' })).toBeChecked()
})

test('sender id-en til varen som krysses av', async () => {
  const onToggle = vi.fn<(id: number) => void>()
  const user = userEvent.setup()
  render(
    <ItemList
      onToggle={onToggle}
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: false },
      ]}
    />,
  )

  await user.click(screen.getByRole('checkbox', { name: 'Brød' }))

  expect(onToggle).toHaveBeenCalledExactlyOnceWith(2)
})

test('gir hver vare en sletteknapp med varens navn', () => {
  render(
    <ItemList
      onToggle={noop}
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: false },
      ]}
    />,
  )

  expect(screen.getByRole('button', { name: 'Slett Melk' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Slett Brød' })).toBeInTheDocument()
})

test('sender id-en til varen som slettes', async () => {
  const onRemove = vi.fn<(id: number) => void>()
  const user = userEvent.setup()
  render(
    <ItemList
      onToggle={noop}
      onRemove={onRemove}
      items={[
        { id: 1, name: 'Melk', bought: false },
        { id: 2, name: 'Brød', bought: false },
      ]}
    />,
  )

  await user.click(screen.getByRole('button', { name: 'Slett Brød' }))

  expect(onRemove).toHaveBeenCalledExactlyOnceWith(2)
})

test('viser handlede varer under varene som ikke er handlet', () => {
  render(
    <ItemList
      onToggle={noop}
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk', bought: true },
        { id: 2, name: 'Brød', bought: false },
        { id: 3, name: 'Egg', bought: false },
      ]}
    />,
  )

  const names = screen.getAllByRole('listitem').map((item) => item.firstElementChild?.textContent)
  expect(names).toEqual(['Brød', 'Egg', 'Melk'])
})

test('sier fra at listen er tom når det ikke finnes varer', () => {
  render(<ItemList onToggle={noop} onRemove={noop} items={[]} />)

  expect(screen.getByText('Listen er tom.')).toBeInTheDocument()
})

test('sier ikke at listen er tom når det finnes varer', () => {
  render(<ItemList onToggle={noop} onRemove={noop} items={[{ id: 1, name: 'Melk', bought: true }]} />)

  expect(screen.queryByText('Listen er tom.')).not.toBeInTheDocument()
})

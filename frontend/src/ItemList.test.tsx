import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { ItemList } from './ItemList.tsx'

const noop = () => undefined

test('viser varene i rekkefølge', () => {
  render(
    <ItemList
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk' },
        { id: 2, name: 'Brød' },
      ]}
    />,
  )

  const names = screen.getAllByRole('listitem').map((item) => item.firstElementChild?.textContent)
  expect(names).toEqual(['Melk', 'Brød'])
})

test('viser et navn med HTML som ren tekst', () => {
  render(<ItemList onRemove={noop} items={[{ id: 1, name: '<b>x</b>' }]} />)

  const item = screen.getByRole('listitem')
  expect(item).toHaveTextContent('<b>x</b>')
  expect(item.querySelector('b')).toBeNull()
})

test('gir hver vare en sletteknapp med varens navn', () => {
  render(
    <ItemList
      onRemove={noop}
      items={[
        { id: 1, name: 'Melk' },
        { id: 2, name: 'Brød' },
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
      onRemove={onRemove}
      items={[
        { id: 1, name: 'Melk' },
        { id: 2, name: 'Brød' },
      ]}
    />,
  )

  await user.click(screen.getByRole('button', { name: 'Slett Brød' }))

  expect(onRemove).toHaveBeenCalledExactlyOnceWith(2)
})

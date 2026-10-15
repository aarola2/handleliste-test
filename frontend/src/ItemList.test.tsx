import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ItemList } from './ItemList.tsx'

test('viser varene i rekkefølge', () => {
  render(
    <ItemList
      items={[
        { id: 1, name: 'Melk' },
        { id: 2, name: 'Brød' },
      ]}
    />,
  )

  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Melk', 'Brød'])
})

test('viser et navn med HTML som ren tekst', () => {
  render(<ItemList items={[{ id: 1, name: '<b>x</b>' }]} />)

  const item = screen.getByRole('listitem')
  expect(item).toHaveTextContent('<b>x</b>')
  expect(item.querySelector('b')).toBeNull()
})

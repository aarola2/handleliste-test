import { describe, expect, test } from 'vitest'
import { addItem, type Item } from './items.ts'

describe('addItem', () => {
  test('legger varen sist i listen', () => {
    const items: Item[] = [{ id: 1, name: 'Melk' }]

    expect(addItem(items, 'Brød').map((item) => item.name)).toEqual(['Melk', 'Brød'])
  })

  test('fjerner mellomrom før og etter navnet', () => {
    expect(addItem([], '  Egg  ')[0]?.name).toBe('Egg')
  })

  test('gir den nye varen en id som ingen andre har', () => {
    const items: Item[] = [
      { id: 1, name: 'Melk' },
      { id: 5, name: 'Brød' },
    ]

    const ids = addItem(items, 'Egg').map((item) => item.id)

    expect(new Set(ids).size).toBe(3)
  })

  test('endrer ikke den opprinnelige listen', () => {
    const items: Item[] = [{ id: 1, name: 'Melk' }]

    addItem(items, 'Brød')

    expect(items).toEqual([{ id: 1, name: 'Melk' }])
  })

  test('legger ikke til noe når navnet er tomt etter trimming', () => {
    const items: Item[] = [{ id: 1, name: 'Melk' }]

    expect(addItem(items, '   ')).toBe(items)
  })
})

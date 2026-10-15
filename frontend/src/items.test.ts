import { describe, expect, test } from 'vitest'
import { addItem, removeItem, toggleItem, type Item } from './items.ts'

describe('addItem', () => {
  test('legger varen sist i listen', () => {
    const items: Item[] = [{ id: 1, name: 'Melk', bought: false }]

    expect(addItem(items, 'Brød').map((item) => item.name)).toEqual(['Melk', 'Brød'])
  })

  test('fjerner mellomrom før og etter navnet', () => {
    expect(addItem([], '  Egg  ')[0]?.name).toBe('Egg')
  })

  test('gir den nye varen en id som ingen andre har', () => {
    const items: Item[] = [
      { id: 1, name: 'Melk', bought: false },
      { id: 5, name: 'Brød', bought: false },
    ]

    const ids = addItem(items, 'Egg').map((item) => item.id)

    expect(new Set(ids).size).toBe(3)
  })

  test('endrer ikke den opprinnelige listen', () => {
    const items: Item[] = [{ id: 1, name: 'Melk', bought: false }]

    addItem(items, 'Brød')

    expect(items).toEqual([{ id: 1, name: 'Melk', bought: false }])
  })

  test('legger ikke til noe når navnet er tomt etter trimming', () => {
    const items: Item[] = [{ id: 1, name: 'Melk', bought: false }]

    expect(addItem(items, '   ')).toBe(items)
  })

  test('legger til varen som ikke handlet', () => {
    expect(addItem([], 'Melk')[0]?.bought).toBe(false)
  })
})

describe('toggleItem', () => {
  const items: Item[] = [
    { id: 1, name: 'Melk', bought: false },
    { id: 2, name: 'Brød', bought: true },
  ]

  test('krysser av bare varen med riktig id', () => {
    expect(toggleItem(items, 1).map((item) => item.bought)).toEqual([true, true])
  })

  test('fjerner avkrysningen fra en handlet vare', () => {
    expect(toggleItem(items, 2).map((item) => item.bought)).toEqual([false, false])
  })

  test('endrer ikke den opprinnelige listen', () => {
    toggleItem(items, 1)

    expect(items[0]?.bought).toBe(false)
  })
})

describe('removeItem', () => {
  const items: Item[] = [
    { id: 1, name: 'Melk', bought: false },
    { id: 2, name: 'Brød', bought: false },
    { id: 3, name: 'Egg', bought: false },
  ]

  test('fjerner bare varen med riktig id og beholder rekkefølgen', () => {
    expect(removeItem(items, 2).map((item) => item.name)).toEqual(['Melk', 'Egg'])
  })

  test('endrer ikke den opprinnelige listen', () => {
    removeItem(items, 2)

    expect(items).toHaveLength(3)
  })

  test('gir en ny vare en id som ingen andre har etter sletting', () => {
    const ids = addItem(removeItem(items, 1), 'Ost').map((item) => item.id)

    expect(new Set(ids).size).toBe(3)
  })
})

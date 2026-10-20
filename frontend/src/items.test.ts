import { describe, expect, test } from 'vitest'
import { addItem, boughtLast, findByName, removeItem, toggleItem, type Item } from './items.ts'

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

  test('legger ikke til en vare som allerede står i listen', () => {
    const items: Item[] = [{ id: 1, name: 'Melk', bought: true }]

    expect(addItem(items, ' MELK ')).toBe(items)
  })
})

describe('findByName', () => {
  const items: Item[] = [
    { id: 1, name: 'Melk', bought: false },
    { id: 2, name: 'Brød', bought: true },
  ]

  test.each(['Melk', 'melk', 'MELK', ' melk '])('finner «Melk» når navnet er «%s»', (name) => {
    expect(findByName(items, name)?.id).toBe(1)
  })

  test('sammenligner æ, ø og å uavhengig av store og små bokstaver', () => {
    expect(findByName(items, 'BRØD')?.id).toBe(2)
  })

  test('finner ingenting når navnet bare ligner', () => {
    expect(findByName(items, 'Melke')).toBeUndefined()
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

describe('boughtLast', () => {
  const items: Item[] = [
    { id: 1, name: 'Melk', bought: true },
    { id: 2, name: 'Brød', bought: false },
    { id: 3, name: 'Egg', bought: true },
    { id: 4, name: 'Ost', bought: false },
  ]

  test('legger handlede varer under de andre og beholder rekkefølgen i hver gruppe', () => {
    expect(boughtLast(items).map((item) => item.name)).toEqual(['Brød', 'Ost', 'Melk', 'Egg'])
  })

  test('endrer ikke den opprinnelige listen', () => {
    boughtLast(items)

    expect(items.map((item) => item.id)).toEqual([1, 2, 3, 4])
  })
})

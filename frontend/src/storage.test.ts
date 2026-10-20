import { afterEach, describe, expect, test, vi } from 'vitest'
import { loadItems, saveItems } from './storage.ts'

// Nøkkelen står med vilje som tekst her: endres den i koden, mister brukerne listen sin, og da skal testene feile.
const storageKey = 'handleliste'

afterEach(() => {
  vi.restoreAllMocks()
})

function blockStorage() {
  const blocked = () => {
    throw new DOMException('Lagring er blokkert', 'SecurityError')
  }
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)
}

test('gir en tom liste når ingenting er lagret', () => {
  expect(loadItems()).toEqual([])
})

test('gir tilbake listen som ble lagret, med avkrysning og rekkefølge', () => {
  const items = [
    { id: 2, name: 'Brød', bought: true },
    { id: 1, name: 'Melk', bought: false },
  ]

  saveItems(items)

  expect(loadItems()).toEqual(items)
})

test('erstatter listen som var lagret fra før', () => {
  saveItems([{ id: 1, name: 'Melk', bought: false }])

  saveItems([])

  expect(loadItems()).toEqual([])
})

describe('ødelagt lagring', () => {
  test.each(['{ikke json', '', 'null', '{}', '"Melk"', '42'])('gir en tom liste når det lagrede er «%s»', (saved) => {
    localStorage.setItem(storageKey, saved)

    expect(loadItems()).toEqual([])
  })

  test('tar bare med oppføringer med riktig form', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([
        { id: 1, name: 'Melk', bought: false },
        { id: 2, bought: false },
        { id: 3, name: 42, bought: true },
        { id: 4, name: '   ', bought: false },
        { id: '5', name: 'Ost', bought: false },
        { id: 6.5, name: 'Smør', bought: false },
        { id: 7, name: 'Egg', bought: 'ja' },
        null,
        'Brød',
        { id: 8, name: 'Brød', bought: true },
      ]),
    )

    expect(loadItems()).toEqual([
      { id: 1, name: 'Melk', bought: false },
      { id: 8, name: 'Brød', bought: true },
    ])
  })

  test('tar bare med den første av to oppføringer med samme id', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([
        { id: 1, name: 'Melk', bought: false },
        { id: 1, name: 'Brød', bought: false },
      ]),
    )

    expect(loadItems().map((item) => item.name)).toEqual(['Melk'])
  })

  test('tar ikke med ekstra felt fra lagringen', () => {
    localStorage.setItem(storageKey, '[{"id":1,"name":"Melk","bought":false,"extra":"x"}]')

    expect(loadItems()).toEqual([{ id: 1, name: 'Melk', bought: false }])
  })
})

describe('blokkert lagring', () => {
  test('gir en tom liste når lagringen ikke kan leses', () => {
    blockStorage()

    expect(loadItems()).toEqual([])
  })

  test('kaster ikke feil når lagringen ikke kan skrives', () => {
    blockStorage()

    expect(() => {
      saveItems([{ id: 1, name: 'Melk', bought: false }])
    }).not.toThrow()
  })
})

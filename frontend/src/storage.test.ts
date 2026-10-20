import { expect, test } from 'vitest'
import { loadItems, saveItems } from './storage.ts'

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

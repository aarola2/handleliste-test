export interface Item {
  id: number
  name: string
  bought: boolean
}

/** Legger til en vare sist med trimmet navn. Et tomt navn gir listen uendret. */
export function addItem(items: readonly Item[], rawName: string): readonly Item[] {
  const name = rawName.trim()
  if (name === '') return items
  return [...items, { id: nextId(items), name, bought: false }]
}

/** Snur avkrysningen på varen med gitt id. */
export function toggleItem(items: readonly Item[], id: number): readonly Item[] {
  return items.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item))
}

function nextId(items: readonly Item[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

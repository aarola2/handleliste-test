import type { Item } from './items.ts'

const storageKey = 'handleliste'
// Langt over det appen selv lager, og langt under grensen der id + 1 ikke lenger gir et nytt tall.
const maxId = 1_000_000_000

/**
 * Henter listen som er lagret i nettleseren. Innholdet er ubetrodd: ødelagt eller blokkert lagring gir en tom liste,
 * og oppføringer med feil form tas ikke med.
 */
export function loadItems(): readonly Item[] {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved === null ? [] : validItems(JSON.parse(saved))
  } catch {
    return []
  }
}

/** Lagrer listen i nettleseren. Er lagringen blokkert eller full, virker listen likevel mens siden er åpen. */
export function saveItems(items: readonly Item[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items))
  } catch {
    // Ingenting å gjøre: listen ligger fortsatt i minnet.
  }
}

/** Beholder gyldige oppføringer med unik id, og bare feltene en vare har. */
function validItems(value: unknown): readonly Item[] {
  if (!Array.isArray(value)) return []
  const ids = new Set<number>()
  const items: Item[] = []
  for (const entry of value) {
    if (!isItem(entry) || ids.has(entry.id)) continue
    ids.add(entry.id)
    items.push({ id: entry.id, name: entry.name, bought: entry.bought })
  }
  return items
}

function isItem(value: unknown): value is Item {
  if (typeof value !== 'object' || value === null) return false
  const { id, name, bought } = value as Record<string, unknown>
  return isValidId(id) && typeof name === 'string' && name.trim() !== '' && typeof bought === 'boolean'
}

function isValidId(id: unknown): boolean {
  return typeof id === 'number' && Number.isInteger(id) && id > 0 && id <= maxId
}

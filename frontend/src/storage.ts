import type { Item } from './items.ts'

const storageKey = 'handleliste'

/** Henter listen som er lagret i nettleseren, eller en tom liste hvis ingenting er lagret. */
export function loadItems(): readonly Item[] {
  const saved = localStorage.getItem(storageKey)
  // Innholdet valideres ikke ennå. Ødelagt eller blokkert lagring håndteres i #16.
  return saved === null ? [] : (JSON.parse(saved) as readonly Item[])
}

/** Lagrer listen i nettleseren. Ingenting sendes over nettverket. */
export function saveItems(items: readonly Item[]): void {
  localStorage.setItem(storageKey, JSON.stringify(items))
}

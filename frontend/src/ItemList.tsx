import type { Item } from './items.ts'

interface ItemListProps {
  items: readonly Item[]
}

export function ItemList({ items }: ItemListProps) {
  return (
    <ul className="items" aria-label="Varer">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}

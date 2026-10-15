import type { Item } from './items.ts'

interface ItemListProps {
  items: readonly Item[]
  onToggle: (id: number) => void
}

export function ItemList({ items, onToggle }: ItemListProps) {
  return (
    <ul className="items" aria-label="Varer">
      {items.map((item) => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.bought}
              onChange={() => {
                onToggle(item.id)
              }}
            />
            {item.name}
          </label>
        </li>
      ))}
    </ul>
  )
}

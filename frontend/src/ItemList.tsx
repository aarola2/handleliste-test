import type { Item } from './items.ts'

interface ItemListProps {
  items: readonly Item[]
  onRemove: (id: number) => void
}

export function ItemList({ items, onRemove }: ItemListProps) {
  return (
    <ul className="items" aria-label="Varer">
      {items.map((item) => (
        <li key={item.id}>
          <span className="name">{item.name}</span>
          <button
            type="button"
            className="secondary"
            aria-label={`Slett ${item.name}`}
            onClick={() => {
              onRemove(item.id)
            }}
          >
            Slett
          </button>
        </li>
      ))}
    </ul>
  )
}

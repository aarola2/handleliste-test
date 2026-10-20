import type { Item } from './items.ts'

interface ItemListProps {
  items: readonly Item[]
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

export function ItemList({ items, onToggle, onRemove }: ItemListProps) {
  return (
    <>
      <ItemRows items={items} onToggle={onToggle} onRemove={onRemove} />
      {items.length === 0 && <p className="empty">Listen er tom.</p>}
    </>
  )
}

function ItemRows({ items, onToggle, onRemove }: ItemListProps) {
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

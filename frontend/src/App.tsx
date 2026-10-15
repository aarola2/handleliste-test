import { useRef, useState } from 'react'
import { AddItemForm } from './AddItemForm.tsx'
import { ItemList } from './ItemList.tsx'
import { addItem, removeItem, toggleItem, type Item } from './items.ts'
import './App.css'

function App() {
  const [items, setItems] = useState<readonly Item[]>([])
  const fieldRef = useRef<HTMLInputElement>(null)

  return (
    <main>
      <h1>Handleliste</h1>
      <AddItemForm
        fieldRef={fieldRef}
        onAdd={(name) => {
          setItems((current) => addItem(current, name))
        }}
      />
      <ItemList
        items={items}
        onToggle={(id) => {
          setItems((current) => toggleItem(current, id))
        }}
        onRemove={(id) => {
          setItems((current) => removeItem(current, id))
          // Knappen forsvinner med varen, så fokus flyttes til feltet i stedet for å gå tapt (som i prototypen).
          fieldRef.current?.focus()
        }}
      />
    </main>
  )
}

export default App

import { useState } from 'react'
import { AddItemForm } from './AddItemForm.tsx'
import { ItemList } from './ItemList.tsx'
import { addItem, toggleItem, type Item } from './items.ts'
import './App.css'

function App() {
  const [items, setItems] = useState<readonly Item[]>([])

  return (
    <main>
      <h1>Handleliste</h1>
      <AddItemForm
        onAdd={(name) => {
          setItems((current) => addItem(current, name))
        }}
      />
      <ItemList
        items={items}
        onToggle={(id) => {
          setItems((current) => toggleItem(current, id))
        }}
      />
    </main>
  )
}

export default App

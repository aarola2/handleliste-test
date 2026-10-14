import { useId, useState, type SubmitEvent } from 'react'

interface AddItemFormProps {
  onAdd: (name: string) => void
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const fieldId = useId()
  const [name, setName] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onAdd(name)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={fieldId}>Vare</label>
      <div className="add-row">
        <input
          id={fieldId}
          type="text"
          autoComplete="off"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
        />
        <button type="submit">Legg til</button>
      </div>
    </form>
  )
}

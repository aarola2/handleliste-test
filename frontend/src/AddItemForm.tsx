import { useId, useState, type Ref, type SubmitEvent } from 'react'

interface AddItemFormProps {
  onAdd: (name: string) => void
  fieldRef?: Ref<HTMLInputElement>
}

export function AddItemForm({ onAdd, fieldRef }: AddItemFormProps) {
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
          ref={fieldRef}
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

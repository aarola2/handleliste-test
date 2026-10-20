import { useId, useState, type Ref, type SubmitEvent } from 'react'
import type { Item } from './items.ts'

const emptyNameMessage = 'Skriv inn navnet på en vare.'

interface AddItemFormProps {
  onAdd: (name: string) => void
  /** Gir varen som allerede har samme navn, hvis den finnes. */
  findExisting?: (name: string) => Item | undefined
  fieldRef?: Ref<HTMLInputElement>
}

export function AddItemForm({ onAdd, findExisting, fieldRef }: AddItemFormProps) {
  const fieldId = useId()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim() === '') {
      setMessage(emptyNameMessage)
      return
    }
    const existing = findExisting?.(name)
    if (existing) {
      // Teksten blir stående i feltet, så den handlende kan rette den (som i prototypen).
      setMessage(`${existing.name} står allerede på listen.`)
      return
    }
    onAdd(name)
    setName('')
    setMessage('')
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
      {/* Står alltid i DOM-en, så skjermlesere leser opp meldingen når teksten endres. */}
      <p className="message" role="alert">
        {message}
      </p>
    </form>
  )
}

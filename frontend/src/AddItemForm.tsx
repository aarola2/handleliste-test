import { useId, useState, type SubmitEvent } from 'react'

const emptyNameMessage = 'Skriv inn navnet på en vare.'

interface AddItemFormProps {
  onAdd: (name: string) => void
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const fieldId = useId()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim() === '') {
      setMessage(emptyNameMessage)
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

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  // Listen lagres i nettleseren (#14), så hver test må starte med tom lagring.
  localStorage.clear()
})

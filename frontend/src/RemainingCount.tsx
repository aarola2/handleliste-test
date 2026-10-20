import type { Item } from './items.ts'

interface RemainingCountProps {
  items: readonly Item[]
}

/** Viser hvor mange varer som gjenstår. Statusområdet leses opp av skjermlesere når teksten endres. */
export function RemainingCount({ items }: RemainingCountProps) {
  const remaining = items.filter((item) => !item.bought).length
  return (
    <p className="counter" role="status">
      {remaining === 1 ? '1 vare igjen' : `${String(remaining)} varer igjen`}
    </p>
  )
}

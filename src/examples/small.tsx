import { Text } from 'ink'
import type { FC } from 'react'

export type Status = 'pending' | 'running' | 'success' | 'error'

interface Props {
  status: Status
  label: string
}

const STATUS_COLORS: Record<Status, string> = {
  pending: 'yellow',
  running: 'blue',
  success: 'green',
  error: 'red',
}

const STATUS_SYMBOLS: Record<Status, string> = {
  pending: '○',
  running: '◐',
  success: '✓',
  error: '✗',
}

/**
 * Small example — StatusBadge
 *
 * A pure display component that renders a coloured status symbol next to a
 * label. No internal state or side-effects — just props in, JSX out.
 */
const StatusBadge: FC<Props> = ({ status, label }) => {
  return (
    <Text color={STATUS_COLORS[status]}>
      {STATUS_SYMBOLS[status]} {label}
    </Text>
  )
}

export default StatusBadge

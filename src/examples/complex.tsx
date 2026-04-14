import { Box, Text, useApp, useInput } from 'ink'
import type { FC } from 'react'
import { useState } from 'react'

import StatusBadge, { type Status } from './small.js'

export interface TodoItem {
  id: string
  label: string
  status: Status
}

interface Props {
  initialItems?: TodoItem[]
}

const DEFAULT_ITEMS: TodoItem[] = [
  { id: '1', label: 'Install dependencies', status: 'success' },
  { id: '2', label: 'Write tests', status: 'running' },
  { id: '3', label: 'Implement feature', status: 'pending' },
  { id: '4', label: 'Review PR', status: 'pending' },
]

const STATUS_CYCLE: Status[] = ['pending', 'running', 'success', 'error']

const BAR_WIDTH = 20

/**
 * Complex example — TodoApp
 *
 * An interactive todo/task manager that demonstrates:
 *  - `useState` for managing task list and cursor position
 *  - `useInput` for keyboard-driven navigation and actions
 *  - `useApp` for clean Ink-managed exit (no `process.exit`)
 *  - Component composition — each row is rendered via `StatusBadge`
 *  - Derived rendering (progress bar, percentage) clamped to [0, BAR_WIDTH]
 *    to avoid RangeError when the task list is empty or all items share the
 *    same state
 *
 * Controls:
 *   ↑ / ↓       Navigate tasks
 *   space / ↵   Cycle selected task's status
 *   r           Reset all tasks to initial state
 *   q           Quit
 */
const TodoApp: FC<Props> = ({ initialItems = DEFAULT_ITEMS }) => {
  const { exit } = useApp()
  const [items, setItems] = useState<TodoItem[]>(initialItems)
  const [cursor, setCursor] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
    }

    if (key.downArrow) {
      setCursor((c) => Math.min(items.length - 1, c + 1))
    }

    if (input === ' ' || key.return) {
      setItems((prev) =>
        prev.map((item, i) => {
          if (i !== cursor) return item
          const idx = STATUS_CYCLE.indexOf(item.status)
          const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
          return { ...item, status: next }
        }),
      )
    }

    if (input === 'r') {
      setItems(initialItems)
      setCursor(0)
    }

    if (input === 'q') {
      exit()
    }
  })

  const done = items.filter((t) => t.status === 'success').length
  const total = items.length
  const percentage =
    total === 0 ? 0 : Math.min(100, Math.max(0, (done / total) * 100))
  const filled = Math.min(
    BAR_WIDTH,
    Math.max(0, Math.round((percentage / 100) * BAR_WIDTH)),
  )

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Todo Manager
        </Text>
        <Text dimColor>
          {'  '}({done}/{total} done)
        </Text>
      </Box>

      {items.map((item, i) => (
        <Box key={item.id}>
          <Text>{i === cursor ? '▶ ' : '  '}</Text>
          <StatusBadge status={item.status} label={item.label} />
        </Box>
      ))}

      <Box marginTop={1}>
        <Text>Progress: [</Text>
        <Text color="green">{'█'.repeat(filled)}</Text>
        <Text>{'░'.repeat(BAR_WIDTH - filled)}</Text>
        <Text>] {Math.round(percentage)}%</Text>
      </Box>

      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold>Controls</Text>
        <Text>↑ / ↓ : Navigate</Text>
        <Text>space / enter : Cycle status</Text>
        <Text>r : Reset</Text>
        <Text>q : Quit</Text>
      </Box>
    </Box>
  )
}

export default TodoApp

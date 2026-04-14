import { Box, Text, useApp, useInput } from 'ink'
import type { FC } from 'react'
import { useRef, useState } from 'react'

import StatusBadge, { type Status } from './small.js'

export interface TodoItem {
  id: string
  label: string
  status: Status
}

/** Which interaction mode the app is currently in. */
type Mode = 'normal' | 'add' | 'edit'

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
 * A fully-interactive todo manager that demonstrates:
 *  - `useState` for task list, cursor position, input mode, and text buffer
 *  - `useRef` for stable unique-ID generation (no module-level mutable state)
 *  - `useInput` for keyboard-driven navigation and CRUD actions
 *  - `useApp` for clean Ink-managed exit (no `process.exit`)
 *  - Component composition — each row is rendered via `StatusBadge`
 *  - Multi-mode UI (normal / add / edit) with inline text-input prompt
 *  - Derived rendering (progress bar, percentage) clamped to [0, BAR_WIDTH]
 *    to prevent RangeError / NaN on an empty list
 *
 * Controls — normal mode:
 *   ↑ / ↓         Navigate tasks
 *   space / ↵     Cycle selected task's status
 *   a             Add a new task (opens input prompt)
 *   e             Edit selected task's label (opens input prompt)
 *   d             Delete the selected task
 *   r             Reset all tasks to initial state
 *   q             Quit
 *
 * Controls — add / edit mode:
 *   ↵             Confirm (save the new or updated label)
 *   Esc           Cancel (discard input, return to normal mode)
 *   Backspace     Delete last character
 */
const TodoApp: FC<Props> = ({ initialItems = DEFAULT_ITEMS }) => {
  const { exit } = useApp()
  const idCounter = useRef(initialItems.length + 1)

  const [items, setItems] = useState<TodoItem[]>(initialItems)
  const [cursor, setCursor] = useState(0)
  const [mode, setMode] = useState<Mode>('normal')
  const [inputText, setInputText] = useState('')

  useInput((input, key) => {
    // ── Input / Edit mode ──────────────────────────────────────────────────
    if (mode === 'add' || mode === 'edit') {
      if (key.escape) {
        setMode('normal')
        setInputText('')
        return
      }

      if (key.return) {
        const trimmed = inputText.trim()
        if (trimmed) {
          if (mode === 'add') {
            const newItem: TodoItem = {
              id: String(idCounter.current++),
              label: trimmed,
              status: 'pending',
            }
            // Capture the current length before the state update so the cursor
            // can point to the newly appended item (index = old length).
            const newCursor = items.length
            setItems((prev) => [...prev, newItem])
            setCursor(newCursor)
          } else {
            setItems((prev) =>
              prev.map((item, i) =>
                i === cursor ? { ...item, label: trimmed } : item,
              ),
            )
          }
        }
        setMode('normal')
        setInputText('')
        return
      }

      if (key.backspace || key.delete) {
        setInputText((prev) => prev.slice(0, -1))
        return
      }

      // Append printable characters to the input buffer.
      if (input && !key.ctrl && !key.meta) {
        setInputText((prev) => prev + input)
      }
      return
    }

    // ── Normal mode ────────────────────────────────────────────────────────
    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
    }

    if (key.downArrow) {
      setCursor((c) => Math.min(items.length - 1, c + 1))
    }

    if (input === ' ' || key.return) {
      if (items.length === 0) return
      setItems((prev) =>
        prev.map((item, i) => {
          if (i !== cursor) return item
          const idx = STATUS_CYCLE.indexOf(item.status)
          const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
          return { ...item, status: next }
        }),
      )
    }

    if (input === 'a') {
      setInputText('')
      setMode('add')
    }

    if (input === 'e' && items.length > 0) {
      setInputText(items[cursor]?.label ?? '')
      setMode('edit')
    }

    if (input === 'd' && items.length > 0) {
      // Capture the pre-deletion length so the cursor can be clamped to the
      // correct range of the post-deletion array (max valid index = length - 2).
      const maxCursor = items.length - 2
      setItems((prev) => prev.filter((_, i) => i !== cursor))
      setCursor((c) => Math.max(0, Math.min(c, maxCursor)))
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
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Todo Manager
        </Text>
        <Text dimColor>
          {'  '}({done}/{total} done)
        </Text>
      </Box>

      {/* Task list */}
      {items.length === 0 && (
        <Text dimColor>No tasks yet — press 'a' to add one.</Text>
      )}
      {items.map((item, i) => (
        <Box key={item.id}>
          <Text>{i === cursor ? '▶ ' : '  '}</Text>
          <StatusBadge status={item.status} label={item.label} />
        </Box>
      ))}

      {/* Progress bar */}
      <Box marginTop={1}>
        <Text>Progress: [</Text>
        <Text color="green">{'█'.repeat(filled)}</Text>
        <Text>{'░'.repeat(BAR_WIDTH - filled)}</Text>
        <Text>] {Math.round(percentage)}%</Text>
      </Box>

      {/* Inline input prompt (add / edit mode) */}
      {(mode === 'add' || mode === 'edit') && (
        <Box marginTop={1} borderStyle="round" borderColor="cyan" paddingX={1}>
          <Text bold color="cyan">
            {mode === 'add' ? 'New task: ' : 'Edit task: '}
          </Text>
          <Text>{inputText}</Text>
          <Text dimColor>█</Text>
        </Box>
      )}

      {/* Controls */}
      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold>Controls</Text>
        {mode === 'normal' ? (
          <>
            <Text>↑ / ↓ : Navigate</Text>
            <Text>space / enter : Cycle status</Text>
            <Text>a : Add task</Text>
            <Text>e : Edit task</Text>
            <Text>d : Delete task</Text>
            <Text>r : Reset</Text>
            <Text>q : Quit</Text>
          </>
        ) : (
          <>
            <Text>enter : Confirm</Text>
            <Text>esc : Cancel</Text>
            <Text>backspace : Delete character</Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export default TodoApp

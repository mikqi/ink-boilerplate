/**
 * Complex Example — Multi-feature todo manager
 *
 * Demonstrates multiple hooks, derived state, filtering, and multi-mode input.
 *
 *   ↑/↓     — navigate tasks
 *   Space   — toggle task done/undone
 *   a       — enter Add mode (type title, Enter to confirm, Esc to cancel)
 *   d       — delete selected task
 *   f       — cycle filter (All → Active → Completed)
 *   q       — quit
 *
 * Run with: npx tsx examples/complex.tsx
 */

import { Box, Text, render, useInput, useStdin } from 'ink'
import { type FC, useEffect, useMemo, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Filter = 'all' | 'active' | 'completed'

interface Task {
  id: number
  title: string
  done: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

let nextId = 1
const makeTask = (title: string): Task => ({ id: nextId++, title, done: false })

const INITIAL_TASKS: Task[] = [
  makeTask('Read the Ink docs'),
  makeTask('Build something cool'),
  makeTask('Ship it 🚀'),
]

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}
const FILTERS: Filter[] = ['all', 'active', 'completed']

// ─── Sub-components ───────────────────────────────────────────────────────────

const TaskRow: FC<{ task: Task; selected: boolean }> = ({ task, selected }) => (
  <Box gap={1}>
    <Text color={selected ? 'cyan' : 'gray'}>{selected ? '▶' : ' '}</Text>
    <Text color={task.done ? 'gray' : 'white'} strikethrough={task.done}>
      {task.done ? '✔' : '○'} {task.title}
    </Text>
  </Box>
)

const StatusBar: FC<{ tasks: Task[]; filter: Filter }> = ({ tasks, filter }) => {
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  return (
    <Box gap={2} marginTop={1}>
      <Text color="gray">
        {done}/{total} done
      </Text>
      {FILTERS.map((f) => (
        <Text key={f} color={f === filter ? 'cyan' : 'gray'} bold={f === filter}>
          {FILTER_LABELS[f]}
        </Text>
      ))}
    </Box>
  )
}

const AddInput: FC<{ value: string }> = ({ value }) => (
  <Box gap={1} marginTop={1} borderStyle="single" borderColor="yellow" paddingX={1}>
    <Text color="yellow">New task:</Text>
    <Text color="white">
      {value}
      <Text color="yellow">█</Text>
    </Text>
  </Box>
)

const Help: FC = () => (
  <Box marginTop={1}>
    <Text color="gray">
      <Text color="white">↑↓</Text> nav{'  '}
      <Text color="white">Space</Text> toggle{'  '}
      <Text color="white">a</Text> add{'  '}
      <Text color="white">d</Text> delete{'  '}
      <Text color="white">f</Text> filter{'  '}
      <Text color="white">q</Text> quit
    </Text>
  </Box>
)

// ─── Main App ─────────────────────────────────────────────────────────────────

const TodoApp: FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [cursor, setCursor] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const [mode, setMode] = useState<'normal' | 'add'>('normal')
  const [draft, setDraft] = useState('')

  const { setRawMode } = useStdin()

  // Enable raw mode so individual keystrokes are captured
  useEffect(() => {
    setRawMode(true)
    return () => setRawMode(false)
  }, [setRawMode])

  const visible = useMemo(
    () =>
      tasks.filter((t) => {
        if (filter === 'active') return !t.done
        if (filter === 'completed') return t.done
        return true
      }),
    [tasks, filter],
  )

  // Keep cursor in bounds when list shrinks
  useEffect(() => {
    if (cursor >= visible.length) setCursor(Math.max(0, visible.length - 1))
  }, [visible.length, cursor])

  useInput((input, key) => {
    if (mode === 'add') {
      if (key.escape) {
        setDraft('')
        setMode('normal')
      } else if (key.return) {
        const trimmed = draft.trim()
        if (trimmed) {
          setTasks((prev) => [...prev, makeTask(trimmed)])
        }
        setDraft('')
        setMode('normal')
      } else if (key.backspace || key.delete) {
        setDraft((d) => d.slice(0, -1))
      } else if (input && !key.ctrl && !key.meta) {
        setDraft((d) => d + input)
      }
      return
    }

    // Normal mode
    if (key.upArrow || input === 'k') {
      setCursor((c) => Math.max(0, c - 1))
    } else if (key.downArrow || input === 'j') {
      setCursor((c) => Math.min(visible.length - 1, c + 1))
    } else if (input === ' ') {
      const selected = visible[cursor]
      if (selected) {
        setTasks((prev) =>
          prev.map((t) => (t.id === selected.id ? { ...t, done: !t.done } : t)),
        )
      }
    } else if (input === 'd') {
      const selected = visible[cursor]
      if (selected) {
        setTasks((prev) => prev.filter((t) => t.id !== selected.id))
      }
    } else if (input === 'a') {
      setMode('add')
    } else if (input === 'f') {
      setFilter((f) => FILTERS[(FILTERS.indexOf(f) + 1) % FILTERS.length])
    } else if (input === 'q') {
      process.exit(0)
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        ✓ Todo Manager
      </Text>

      <Box flexDirection="column" marginTop={1}>
        {visible.length === 0 ? (
          <Text color="gray" dimColor>
            No tasks. Press <Text color="white">a</Text> to add one.
          </Text>
        ) : (
          visible.map((task, i) => <TaskRow key={task.id} task={task} selected={i === cursor} />)
        )}
      </Box>

      <StatusBar tasks={tasks} filter={filter} />

      {mode === 'add' && <AddInput value={draft} />}

      <Help />
    </Box>
  )
}

render(<TodoApp />)

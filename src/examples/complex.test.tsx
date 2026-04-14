import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import TodoApp, { type TodoItem } from './complex'

const sampleItems: TodoItem[] = [
  { id: '1', label: 'Install dependencies', status: 'success' },
  { id: '2', label: 'Write tests', status: 'running' },
  { id: '3', label: 'Implement feature', status: 'pending' },
  { id: '4', label: 'Review PR', status: 'error' },
]

// ── Static rendering ──────────────────────────────────────────────────────────

test('renders the component title', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  expect(lastFrame()).toContain('Todo Manager')
})

test('renders all task labels', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('Install dependencies')
  expect(output).toContain('Write tests')
  expect(output).toContain('Implement feature')
  expect(output).toContain('Review PR')
})

test('renders status symbols via StatusBadge', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('✓') // success
  expect(output).toContain('◐') // running
  expect(output).toContain('○') // pending
  expect(output).toContain('✗') // error
})

test('shows done/total summary', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  expect(lastFrame()).toContain('1/4 done')
})

test('renders the progress bar without NaN or Infinity', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('[')
  expect(output).toContain(']')
  expect(output).toContain('%')
  expect(output).not.toContain('NaN')
  expect(output).not.toContain('Infinity')
})

test('renders cursor indicator on first item by default', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  expect(lastFrame()).toContain('▶')
})

test('progress bar shows 100% when all tasks are done', () => {
  const allDone: TodoItem[] = sampleItems.map((t) => ({
    ...t,
    status: 'success' as const,
  }))
  const { lastFrame } = render(<TodoApp initialItems={allDone} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('100%')
  expect(output).not.toContain('NaN')
  expect(output).not.toContain('Infinity')
})

test('progress bar shows 0% when no tasks are done', () => {
  const noneDone: TodoItem[] = sampleItems.map((t) => ({
    ...t,
    status: 'pending' as const,
  }))
  const { lastFrame } = render(<TodoApp initialItems={noneDone} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('0%')
  expect(output).not.toContain('NaN')
  expect(output).not.toContain('Infinity')
})

test('renders without throwing for an empty task list', () => {
  const renderEmpty = () => render(<TodoApp initialItems={[]} />)
  expect(renderEmpty).not.toThrow()
  const { lastFrame } = renderEmpty()
  const output = lastFrame() ?? ''
  expect(output).toContain('0/0 done')
  expect(output).toContain('No tasks yet')
  expect(output).not.toContain('NaN')
  expect(output).not.toContain('Infinity')
})

test('renders default items when no props are passed', () => {
  const { lastFrame } = render(<TodoApp />)
  expect(lastFrame()).toContain('Todo Manager')
})

// ── Controls panel ────────────────────────────────────────────────────────────

test('controls panel shows add / edit / delete shortcuts', () => {
  const { lastFrame } = render(<TodoApp initialItems={sampleItems} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('a : Add task')
  expect(output).toContain('e : Edit task')
  expect(output).toContain('d : Delete task')
  expect(output).toContain('Navigate')
  expect(output).toContain('Cycle status')
  expect(output).toContain('Reset')
  expect(output).toContain('Quit')
})

// ── Derived-state variants (verifiable via props) ─────────────────────────────

test('single-item list renders exactly one task row', () => {
  const single: TodoItem[] = [
    { id: '1', label: 'Only task', status: 'pending' },
  ]
  const { lastFrame } = render(<TodoApp initialItems={single} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('Only task')
  expect(output).toContain('0/1 done')
})

test('renders a mix of all four statuses without throwing', () => {
  const mixed: TodoItem[] = [
    { id: '1', label: 'A', status: 'pending' },
    { id: '2', label: 'B', status: 'running' },
    { id: '3', label: 'C', status: 'success' },
    { id: '4', label: 'D', status: 'error' },
  ]
  const renderMixed = () => render(<TodoApp initialItems={mixed} />)
  expect(renderMixed).not.toThrow()
  const { lastFrame } = renderMixed()
  const output = lastFrame() ?? ''
  expect(output).toContain('1/4 done')
  expect(output).not.toContain('NaN')
})

test('progress bar is well-formed for a 50% completed list', () => {
  const half: TodoItem[] = [
    { id: '1', label: 'Done 1', status: 'success' },
    { id: '2', label: 'Done 2', status: 'success' },
    { id: '3', label: 'Pending 1', status: 'pending' },
    { id: '4', label: 'Pending 2', status: 'pending' },
  ]
  const { lastFrame } = render(<TodoApp initialItems={half} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('50%')
  expect(output).not.toContain('NaN')
  expect(output).not.toContain('Infinity')
})

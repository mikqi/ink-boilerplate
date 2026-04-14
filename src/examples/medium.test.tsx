import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import TaskList, { type Task } from './medium'

const tasks: Task[] = [
  { id: '1', name: 'Install dependencies', status: 'success' },
  { id: '2', name: 'Run type checks', status: 'running' },
  { id: '3', name: 'Run tests', status: 'pending' },
  { id: '4', name: 'Build project', status: 'error' },
]

test('renders all task names', () => {
  const { lastFrame } = render(<TaskList tasks={tasks} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('Install dependencies')
  expect(output).toContain('Run type checks')
  expect(output).toContain('Run tests')
  expect(output).toContain('Build project')
})

test('renders the default title', () => {
  const { lastFrame } = render(<TaskList tasks={tasks} />)
  expect(lastFrame()).toContain('Tasks')
})

test('renders a custom title', () => {
  const { lastFrame } = render(<TaskList tasks={tasks} title="CI Pipeline" />)
  expect(lastFrame()).toContain('CI Pipeline')
})

test('shows correct completion count', () => {
  const { lastFrame } = render(<TaskList tasks={tasks} />)
  expect(lastFrame()).toContain('1/4 completed')
})

test('shows all completed when every task succeeds', () => {
  const allDone: Task[] = tasks.map((t) => ({
    ...t,
    status: 'success' as const,
  }))
  const { lastFrame } = render(<TaskList tasks={allDone} />)
  expect(lastFrame()).toContain('4/4 completed')
})

test('renders status symbols for each task', () => {
  const { lastFrame } = render(<TaskList tasks={tasks} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('✓')
  expect(output).toContain('◐')
  expect(output).toContain('○')
  expect(output).toContain('✗')
})

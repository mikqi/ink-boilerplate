import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import Counter from './complex'

test('renders the component title', () => {
  const { lastFrame } = render(<Counter />)
  expect(lastFrame()).toContain('Interactive Counter')
})

test('renders the default initial count of zero', () => {
  const { lastFrame } = render(<Counter />)
  expect(lastFrame()).toContain('Count:')
  expect(lastFrame()).toContain('0')
})

test('renders a custom initial count', () => {
  const { lastFrame } = render(<Counter initialCount={5} />)
  expect(lastFrame()).toContain('+5')
})

test('renders a negative initial count', () => {
  const { lastFrame } = render(<Counter initialCount={-3} />)
  expect(lastFrame()).toContain('-3')
})

test('renders the controls panel', () => {
  const { lastFrame } = render(<Counter />)
  const output = lastFrame() ?? ''
  expect(output).toContain('Controls')
  expect(output).toContain('Increment')
  expect(output).toContain('Decrement')
  expect(output).toContain('Reset')
  expect(output).toContain('Quit')
})

test('renders the progress bar', () => {
  const { lastFrame } = render(<Counter initialCount={0} min={-10} max={10} />)
  const output = lastFrame() ?? ''
  expect(output).toContain('[')
  expect(output).toContain(']')
  expect(output).toContain('50%')
})

test('renders history with initial value', () => {
  const { lastFrame } = render(<Counter initialCount={3} />)
  expect(lastFrame()).toContain('History:')
  expect(lastFrame()).toContain('3')
})

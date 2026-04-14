import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import StatusBadge from './small'

test('renders pending status with correct symbol and label', () => {
  const { lastFrame } = render(<StatusBadge status="pending" label="Waiting" />)
  expect(lastFrame()).toContain('○ Waiting')
})

test('renders running status with correct symbol and label', () => {
  const { lastFrame } = render(
    <StatusBadge status="running" label="Installing" />,
  )
  expect(lastFrame()).toContain('◐ Installing')
})

test('renders success status with correct symbol and label', () => {
  const { lastFrame } = render(<StatusBadge status="success" label="Done" />)
  expect(lastFrame()).toContain('✓ Done')
})

test('renders error status with correct symbol and label', () => {
  const { lastFrame } = render(<StatusBadge status="error" label="Failed" />)
  expect(lastFrame()).toContain('✗ Failed')
})

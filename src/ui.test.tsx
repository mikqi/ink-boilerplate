import { render } from 'ink-testing-library'
import { describe, expect, test } from 'vitest'

import InkBoilerplate from './ui'

describe('InkBoilerplate', () => {
  test('renders greeting with provided name', () => {
    const name = 'John Doe'
    const { lastFrame } = render(<InkBoilerplate name={name} />)
    expect(lastFrame()).toContain(`Hello, ${name}. From Ink Boilerplate`)
  })

  test('renders greeting with default name when no name is provided', () => {
    const { lastFrame } = render(<InkBoilerplate />)
    expect(lastFrame()).toContain('Hello, Someone. From Ink Boilerplate')
  })

  test('displays exit instruction', () => {
    const { lastFrame } = render(<InkBoilerplate name="Test" />)
    // ui.tsx uses &lsquo; / &rsquo; which render as Unicode curly quotes
    expect(lastFrame()).toContain('Press \u2018q\u2019 for exit')
  })

  test('renders greeting with different names', () => {
    const names = ['Alice', 'Bob', 'Charlie']
    for (const name of names) {
      const { lastFrame } = render(<InkBoilerplate name={name} />)
      expect(lastFrame()).toContain(`Hello, ${name}. From Ink Boilerplate`)
    }
  })
})

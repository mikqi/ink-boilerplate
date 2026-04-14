import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import InkBoilerplate from './ui'

test('it should work properly', () => {
  const name = 'John Doe'
  const { lastFrame } = render(<InkBoilerplate name={name} />)
  expect(lastFrame()).toContain(`Hello, ${name}. From Ink Boilerplate`)
})

test('it should use default name when no name is provided', () => {
  const { lastFrame } = render(<InkBoilerplate />)
  expect(lastFrame()).toContain('Hello, Someone. From Ink Boilerplate')
})

test('it should display the exit hint message', () => {
  const { lastFrame } = render(<InkBoilerplate name="Jane" />)
  expect(lastFrame()).toContain('for exit')
})

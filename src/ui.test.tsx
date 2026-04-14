import { render } from 'ink-testing-library'
import { expect, test } from 'vitest'

import InkBoilerplate from './ui'

test('it should work properly', () => {
  const name = 'John Doe'
  const { lastFrame } = render(<InkBoilerplate name={name} />)
  expect(lastFrame()).toContain(`Hello, ${name}. From Ink Boilerplate`)
})

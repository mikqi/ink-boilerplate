/**
 * Medium Example — Interactive counter
 *
 * Demonstrates useState, useInput, and conditional rendering.
 *   ↑ / k  — increment
 *   ↓ / j  — decrement
 *   r       — reset
 *   q       — quit
 *
 * Run with: npx tsx examples/medium.tsx
 */

import { Box, Text, render, useApp, useInput } from 'ink'
import { type FC, useState } from 'react'

const STEP = 1
const MAX = 10
const MIN = -10

const CounterBar: FC<{ value: number }> = ({ value }) => {
  const filled = Math.round(((value - MIN) / (MAX - MIN)) * 20)
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
  const color = value > 0 ? 'green' : value < 0 ? 'red' : 'yellow'
  return (
    <Box>
      <Text color={color}>[{bar}]</Text>
    </Box>
  )
}

const Counter: FC = () => {
  const [count, setCount] = useState(0)
  const { exit } = useApp()

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCount((c) => Math.min(c + STEP, MAX))
    } else if (key.downArrow || input === 'j') {
      setCount((c) => Math.max(c - STEP, MIN))
    } else if (input === 'r') {
      setCount(0)
    } else if (input === 'q') {
      exit()
    }
  })

  const valueColor = count > 0 ? 'green' : count < 0 ? 'red' : 'yellow'

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Text bold color="cyan">
        Interactive Counter
      </Text>

      <Box gap={2} alignItems="center">
        <Text bold color={valueColor} dimColor={count === 0}>
          {count.toString().padStart(4, ' ')}
        </Text>
        <CounterBar value={count} />
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text color="gray">
          <Text color="white">↑/k</Text> increment{'  '}
          <Text color="white">↓/j</Text> decrement{'  '}
          <Text color="white">r</Text> reset{'  '}
          <Text color="white">q</Text> quit
        </Text>
      </Box>
    </Box>
  )
}

render(<Counter />)

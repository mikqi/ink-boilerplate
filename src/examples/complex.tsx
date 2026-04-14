import { Box, Text, useInput } from 'ink'
import type { FC } from 'react'
import { useState } from 'react'

interface Props {
  initialCount?: number
  min?: number
  max?: number
}

const BAR_WIDTH = 20

/**
 * Complex example — Counter
 *
 * An interactive component that demonstrates:
 *  - `useState` for managing local state (count + history)
 *  - `useInput` for keyboard-driven updates
 *  - Derived rendering (progress bar, percentage) computed from state
 *  - Multi-panel layout using nested `<Box>` components
 *
 * Controls:
 *   ↑ / +   Increment
 *   ↓ / -   Decrement
 *   r       Reset to initial value
 *   q       Quit
 */
const Counter: FC<Props> = ({ initialCount = 0, min = -10, max = 10 }) => {
  const [count, setCount] = useState(initialCount)
  const [history, setHistory] = useState<number[]>([initialCount])

  useInput((input, key) => {
    if (key.upArrow || input === '+') {
      setCount((prev) => {
        const next = Math.min(prev + 1, max)
        setHistory((h) => [...h, next])
        return next
      })
    }

    if (key.downArrow || input === '-') {
      setCount((prev) => {
        const next = Math.max(prev - 1, min)
        setHistory((h) => [...h, next])
        return next
      })
    }

    if (input === 'r') {
      setCount(initialCount)
      setHistory([initialCount])
    }

    if (input === 'q') {
      process.exit(0)
    }
  })

  const percentage = ((count - min) / (max - min)) * 100
  const filled = Math.round((percentage / 100) * BAR_WIDTH)
  const countLabel = count > 0 ? `+${count}` : String(count)
  const countColor = count < 0 ? 'red' : count > 0 ? 'green' : 'yellow'

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Interactive Counter
        </Text>
      </Box>

      <Box>
        <Text>Count: </Text>
        <Text bold color={countColor}>
          {countLabel}
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text>[</Text>
        <Text color="green">{'█'.repeat(filled)}</Text>
        <Text>{'░'.repeat(BAR_WIDTH - filled)}</Text>
        <Text>] {Math.round(percentage)}%</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>History: {history.slice(-5).join(' → ')}</Text>
      </Box>

      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold>Controls</Text>
        <Text>↑ / + : Increment</Text>
        <Text>↓ / - : Decrement</Text>
        <Text>r : Reset</Text>
        <Text>q : Quit</Text>
      </Box>
    </Box>
  )
}

export default Counter

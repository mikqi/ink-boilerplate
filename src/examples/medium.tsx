import { Box, Text } from 'ink'
import type { FC } from 'react'

import type { Status } from './small.js'

export interface Task {
  id: string
  name: string
  status: Status
}

interface Props {
  tasks: Task[]
  title?: string
}

const STATUS_ICONS: Record<Status, string> = {
  pending: '○',
  running: '◐',
  success: '✓',
  error: '✗',
}

const STATUS_COLORS: Record<Status, string> = {
  pending: 'yellow',
  running: 'blue',
  success: 'green',
  error: 'red',
}

/**
 * Medium example — TaskList
 *
 * A display component that accepts a list of tasks and renders each one with a
 * coloured status icon. It also computes a summary (done / total) from the
 * incoming props, showing how to derive state without `useState`.
 */
const TaskList: FC<Props> = ({ tasks, title = 'Tasks' }) => {
  const done = tasks.filter((t) => t.status === 'success').length
  const total = tasks.length

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
        <Text dimColor>
          {' '}
          ({done}/{total} completed)
        </Text>
      </Box>
      {tasks.map((task) => (
        <Box key={task.id}>
          <Text color={STATUS_COLORS[task.status]}>
            {STATUS_ICONS[task.status]} {task.name}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

export default TaskList

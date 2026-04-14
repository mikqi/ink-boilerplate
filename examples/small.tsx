/**
 * Small Example — Static styled output
 *
 * Demonstrates basic Ink layout primitives: Box, Text, and color props.
 * No interactivity — just renders a styled system-info card and exits.
 *
 * Run with: npx tsx examples/small.tsx
 */

import { Box, Text, render } from 'ink'

const SystemInfo = () => (
  <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
    <Box marginBottom={1}>
      <Text bold color="cyan">
        System Info
      </Text>
    </Box>

    <Box>
      <Text color="gray">Platform: </Text>
      <Text color="white">{process.platform}</Text>
    </Box>

    <Box>
      <Text color="gray">Node:     </Text>
      <Text color="white">{process.version}</Text>
    </Box>

    <Box>
      <Text color="gray">PID:      </Text>
      <Text color="white">{String(process.pid)}</Text>
    </Box>

    <Box marginTop={1}>
      <Text color="green" dimColor>
        ✔ Ready
      </Text>
    </Box>
  </Box>
)

const { unmount } = render(<SystemInfo />)
// Static display — unmount immediately after rendering
unmount()

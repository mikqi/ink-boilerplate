import React, { FunctionComponent } from 'react'
import { Box, Color, Text, useInput } from 'ink'

interface IProps {
  name?: string
}
const InkBoilerplate: FunctionComponent<IProps> = ({ name = 'Someone' }) => {
  useInput(input => {
    if (input === 'q') {
      process.exit(0)
    }
  })

  return (
    <>
      <Box>
        <Text>
          Hello, {name}. <Color green>From Ink Boilerplate></Color>
        </Text>
      </Box>
      <Box marginTop={1}>
        <Color redBright>Press 'q' for exit</Color>
      </Box>
    </>
  )
}

export default InkBoilerplate

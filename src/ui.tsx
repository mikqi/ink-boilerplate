import React, { FunctionComponent } from 'react'
import { Box, Text, useInput } from 'ink'

interface IProps {
  name?: string
}
const InkBoilerplate: FunctionComponent<IProps> = ({ name = 'Someone' }) => {
  useInput((input) => {
    console.log(input)
    if (input === 'q') {
      process.exit(0)
    }
  })

  return (
    <>
      <Box>
        <Text color="green">Hello, {name}. From Ink Boilerplate</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="redBright">Press 'q' for exit</Text>
      </Box>
    </>
  )
}

export default InkBoilerplate

#!/usr/bin/env node

import { render } from 'ink'
import meow from 'meow'
import { createElement } from 'react'

import InkBoilerplate from './ui.js'

const cli = meow(
  `
    Usage
      $ inkboilerplate

    Options
      --name  Your name

    Examples
      $ inkboilerplate --name=John
      Hello, John. From Ink Boilerplate
  `,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: 'string',
      },
    },
  },
)

render(createElement(InkBoilerplate, { name: cli.flags.name }))

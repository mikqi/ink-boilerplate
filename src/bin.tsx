#!/usr/bin/env node

import React from 'react'
import { render } from 'ink'
import meow from 'meow'

import InkBoilerplate from '.'

const cli = meow(`
  Usage
    $ inkboilerplate

  Options
    --name  Your name

  Examples
    $ inkboilerplate --name=John
    Hello, John. From Ink Boilerplate
`)

render(React.createElement(InkBoilerplate, cli.flags))

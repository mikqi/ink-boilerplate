import { execFileSync } from 'node:child_process'
import { chmodSync, existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '..')
const hooksDirectory = resolve(repositoryRoot, '.githooks')
const preCommitHook = resolve(hooksDirectory, 'pre-commit')
const warn = (message) => {
  console.warn(`[git-hooks] ${message}`)
}
const info = (message) => {
  console.log(`[git-hooks] ${message}`)
}
const getErrorMessage = (error) => {
  return error instanceof Error ? error.message : String(error)
}

if (!existsSync(preCommitHook)) {
  console.error(
    `[git-hooks] Expected ${relative(repositoryRoot, preCommitHook)} to exist before setup.`,
  )
  process.exit(1)
}

let gitCheckResult = ''

try {
  gitCheckResult = execFileSync(
    'git',
    ['rev-parse', '--is-inside-work-tree'],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  ).trim()
} catch (error) {
  warn(
    `Skipped setup because Git repository status could not be checked. ${getErrorMessage(error)}`,
  )
  process.exit(0)
}

if (gitCheckResult !== 'true') {
  warn('Skipped setup because the current directory is not a Git repository.')
  process.exit(0)
}

try {
  chmodSync(preCommitHook, 0o755)
} catch (error) {
  warn(
    `Skipped setup because ${relative(repositoryRoot, preCommitHook)} permissions could not be updated. ${getErrorMessage(error)}`,
  )
  process.exit(0)
}

try {
  execFileSync(
    'git',
    ['config', 'core.hooksPath', hooksDirectory],
    {
      cwd: repositoryRoot,
      stdio: 'ignore',
    },
  )
} catch (error) {
  warn(`Skipped setup because core.hooksPath could not be configured. ${getErrorMessage(error)}`)
  process.exit(0)
}

info(`Configured core.hooksPath to ${hooksDirectory}.`)

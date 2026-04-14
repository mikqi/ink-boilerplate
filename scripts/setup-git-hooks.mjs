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

if (!existsSync(preCommitHook)) {
  console.error(
    `[git-hooks] Expected ${relative(repositoryRoot, preCommitHook)} to exist before setup.`,
  )
  process.exit(1)
}

try {
  const isGitRepository = execFileSync(
    'git',
    ['rev-parse', '--is-inside-work-tree'],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  ).trim()

  if (isGitRepository !== 'true') {
    warn('Skipped setup because the current directory is not a Git repository.')
    process.exit(0)
  }

  chmodSync(preCommitHook, 0o755)

  execFileSync(
    'git',
    ['config', 'core.hooksPath', relative(repositoryRoot, hooksDirectory)],
    {
      cwd: repositoryRoot,
      stdio: 'ignore',
    },
  )
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  warn(`Skipped setup because Git hooks could not be configured. ${message}`)
  process.exit(0)
}

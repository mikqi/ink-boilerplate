import { execFileSync } from 'node:child_process'
import { chmodSync, existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '..')
const hooksDirectory = resolve(repositoryRoot, '.githooks')
const preCommitHook = resolve(hooksDirectory, 'pre-commit')

if (!existsSync(preCommitHook)) {
  process.exit(0)
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
} catch {
  process.exit(0)
}

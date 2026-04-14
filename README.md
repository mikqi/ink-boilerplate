<h1 align="center">
  <img src="assets/logo.png" width="300" />
</h1>

# Ink Boilerplate

> Ink CLI Project Starter Kit

## Useful Package Included

- [Typescript](http://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/)
- [PNPM](https://pnpm.js.org/)
- [tsup](https://tsup.egoist.dev/)
- [Vitest](https://vitest.dev/)
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)

You can read [ink documentation here](https://github.com/vadimdemedes/ink) and use these [component to make your CLI cool, cooler, coolest](https://github.com/vadimdemedes/ink#useful-components)

This project inspired by [Emma-cli](https://github.com/maticzav/emma-cli/) project structures.

## TypeScript Best Practices

This project uses strict TypeScript with ESM output (`module: NodeNext`). Follow these conventions when contributing:

### Naming Conventions

- Use `Props` (not `IProps`) for React component prop interfaces — no Hungarian notation.
- Prefer `type` imports for type-only symbols: `import type { FC } from 'react'`.

### Imports

Because the project builds as ESM with `moduleResolution: NodeNext`, always use explicit `.js` extensions in relative imports — even when importing TypeScript source files:

```ts
// ✅ Correct
import InkBoilerplate from './ui.js'

// ❌ Wrong — will fail at runtime
import InkBoilerplate from './ui'
```

### tsconfig Highlights

| Option | Purpose |
|--------|---------|
| `strict: true` | Enables all strict type checks |
| `noUnusedLocals` / `noUnusedParameters` | Catches dead code early |
| `noImplicitReturns` | Ensures every code path returns a value |
| `forceConsistentCasingInFileNames` | Prevents cross-platform import bugs |
| `declaration` + `declarationMap` | Emits `.d.ts` files with source map support |
| `incremental` | Speeds up subsequent builds via `.tsbuildinfo` cache |
| `isolatedModules` | Compatible with single-file transpilers |

### Running the Project

```bash
# Install dependencies
pnpm install

# Build (emits JS + declaration files to dist/)
pnpm run build

# Run tests
pnpm run test

# Lint / format
pnpm run lint
pnpm run format
```

## Development

During the `prepare` lifecycle (including `pnpm install`), the repository configures Git hooks with `simple-git-hooks`.
The included `pre-commit` hook runs `pnpm run check`.
If the hook rewrites files, review and re-stage those changes before re-running the commit.
If you are migrating from an older local checkout that used a custom hooks path, reset it with `git config core.hooksPath .git/hooks`.

## License

MIT © [Muhammad Rivki](https://github.com/mikqi/)

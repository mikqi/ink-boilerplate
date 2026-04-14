<h1 align="center">
  <img src="assets/logo.png" width="300" />
</h1>

# Ink Boilerplate

> Ink CLI Project Starter Kit

## Useful Packages Included

- [Typescript](http://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [PNPM](https://pnpm.js.org/)
- [Jest](https://jestjs.io/)
- [Husky](https://github.com/typicode/husky)

You can read [ink documentation here](https://github.com/vadimdemedes/ink) and use these [component to make your CLI cool, cooler, coolest](https://github.com/vadimdemedes/ink#useful-components)

This project inspired by [Emma-cli](https://github.com/maticzav/emma-cli/) project structures.

## TypeScript Best Practices

This project uses strict TypeScript with ESM output (`module: NodeNext`). Follow these conventions when contributing:

### Naming Conventions

- Use `Props` (not `IProps`) for React component prop interfaces — no Hungarian notation.
- Prefer `type` imports for type-only symbols: `import { type FC } from 'react'`.

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
| `isolatedModules` | Compatible with single-file transpilers (e.g. ts-jest) |

### Running the Project

```bash
# Install dependencies
pnpm install

# Build (emits JS + declaration files to dist/)
pnpm run build

# Run tests
pnpm run test

# Lint
pnpm run lint
```

## License

MIT © [Muhammad Rivki](https://github.com/mikqi/)

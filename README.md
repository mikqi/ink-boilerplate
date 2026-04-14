<h1 align="center">
  <img src="assets/logo.png" width="300" />
</h1>

# Ink Boilerplate

> Ink CLI Project Starter Kit

## Usefull Package Included

- [Typescript](http://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [PNPM](https://pnpm.js.org/)
- [Jest](https://jestjs.io/)
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)

You can read [ink documentation here](https://github.com/vadimdemedes/ink) and use these [component to make your CLI cool, cooler, coolest](https://github.com/vadimdemedes/ink#useful-components)

This project inspired by [Emma-cli](https://github.com/maticzav/emma-cli/) project structures.

## Development

During the `prepare` lifecycle (including `pnpm install`), the repository configures Git hooks with `simple-git-hooks`.
The included `pre-commit` hook runs `pnpm run lint:fix`.
If the hook rewrites files, review and re-stage those changes before re-running the commit.

## License

MIT © [Muhammad Rivki](https://github.com/mikqi/)

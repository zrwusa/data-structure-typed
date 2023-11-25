# Commands

Overview of the commands to test, run and build this project as well as those that were used to set up it.

## Most important commands for development

- `npm install` Installs all dependencies and creates the folder `node_modules`, that is needed for all following
  commands.
- `npm run lint` Lint src/ and test/ codebase (using ESLint)
- `npm run format` Pretty src/ and test/ codebase (using Prettier)
- `npm run inspect` Check src/ and test/ codebase (using TSC and ESLint)
- `npm run changelog` Update CHANGELOG.md
- `npm login` + `npm publish` To publish a new release. Be sure to run npm run package first.

## Commands to test, run and build the project

- `npm test` or `npm run test:unit` Run all unit tests (using Jest) with reporting coverage
- `npm test:perf` Run all performance tests (using Benchmark.js) with reporting results
- `npm run test:perf -- priority-queue.test` Run specific performance test

[//]: # (- `npm run coverage-badge` Updates code coverage badge inside `README.md`)

- `npm run build:docs` Generates JSDoc Documentation in folder "docs"
- `npm run build` Build the application for production including es6(ESModule), es5(CommonJS) and minification(UMD)

## Commands used to set up the project

- `npm audit fix` Fixes vulnerabilities
- `npm install typedoc --save-dev` Setup TypeScript Documentation (typedoc)
- `npm install eslint --save-dev` Setup linter (static code quality analyzer)
- `npx eslint --init` Initialize linter configuration file

## References

- [ESLint - Getting Started](https://eslint.org/docs/user-guide/getting-started)

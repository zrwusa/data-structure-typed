# Deprecated Scripts Archive

These scripts were removed from `package.json` during the v2.5.1 cleanup.
Kept here for reference in case they're needed again.

## build:docs (old TypeDoc HTML output)

Generates TypeDoc HTML docs (pre-Docusaurus). Replaced by `docs:build`.

```bash
npm run gen:examples && npm run generate:schema && npm run build:typedoc-plugin && typedoc --plugin ./scripts/typedoc-plugin-example-rewrite.js --out docs/api ./src
```

## build:docs-class (old TypeDoc HTML, classes only)

Same as `build:docs` but scoped to `./src/data-structures`. Replaced by `docs:api`.

```bash
npm run gen:examples && npm run build:typedoc-plugin && typedoc --plugin ./scripts/typedoc-plugin-example-rewrite.js --out docs/api ./src/data-structures
```

## test:in-band

Identical to `test`. Removed as redundant.

```bash
jest --runInBand
```

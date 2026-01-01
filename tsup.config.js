import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { "data-structure-typed": "src/index.ts" },
    target: 'es6',
    format: ["iife"],
    clean: true,
    sourcemap: true,
    minify: true,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    outExtension: () => ({ js: '.min.js' }),
  },
  // 配置 2: Unminified (开发调试用)
  {
    entry: { "data-structure-typed": "src/index.ts" },
    target: 'es6',
    format: ["iife"],
    clean: false,
    sourcemap: true,
    minify: false,
    outDir: "dist/umd",
    globalName: "dataStructureTyped",
    platform: "browser",
    outExtension: () => ({ js: '.js' }),
  }
]);

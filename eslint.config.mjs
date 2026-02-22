import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: ["**/lib/", "**/dist/", "**/umd/", "**/coverage/", "**/docs/"],
}, ...compat.extends("plugin:@typescript-eslint/recommended", "prettier"), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    import: fixupPluginRules(_import),
  },

  languageOptions: {
    parser: tsParser,
  },

  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },

    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"],
      },
    },
  },

  rules: {
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-require-imports": "off",
    "lines-around-comment": ["warn", {
      beforeLineComment: false,
      beforeBlockComment: true,
      allowBlockStart: true,
      allowClassStart: true,
      allowObjectStart: true,
      allowArrayStart: true,
    }],

    "newline-before-return": "off",

    "import/newline-after-import": ["warn", {
      count: 1,
    }],


    "object-curly-spacing": ["warn", "always"],
  },
}];

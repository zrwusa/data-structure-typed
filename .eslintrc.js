module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "eslint-plugin-import"
  ],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "ignorePatterns": ["lib/", "dist/", "umd/", "coverage/", "docs/"],
  "rules": {
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "lines-around-comment": [
      "warn",
      {
        "beforeLineComment": false,
        "beforeBlockComment": true,
        "allowBlockStart": true,
        "allowClassStart": true,
        "allowObjectStart": true,
        "allowArrayStart": true
      }
    ],
    "newline-before-return": "off",
    "import/newline-after-import": [
      "warn",
      {
        "count": 1
      }
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        "extendDefaults": true,
        "types": {
          "{}": false
        }
      }
    ],
    // "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "object-curly-spacing": ["warn", "always"]
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts"
      ]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": [
          "./tsconfig.json"
        ]
      }
    }
  }
}

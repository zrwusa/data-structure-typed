module.exports = {
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  'rules': {
    'import/no-anonymous-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // add new line above comment
    'lines-around-comment': [
      'error',
      {
        'beforeLineComment': false,
        'beforeBlockComment': true,
        'allowBlockStart': true,
        'allowClassStart': true,
        'allowObjectStart': true,
        'allowArrayStart': true
      }
    ],
    // add new line above return
    'newline-before-return': 'off',
    // add new line below import
    'import/newline-after-import': [
      'error',
      {
        'count': 1
      }
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'extendDefaults': true,
        'types': {
          '{}': false
        }
      }
    ]
  },
  'plugins': [
    'import'
  ],
  'settings': {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts'
      ]
    },
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true,
        'project': [
          './tsconfig.json'
        ]
      }
    }
  }
}

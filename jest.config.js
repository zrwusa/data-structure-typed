module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/unit/**/*.test.ts', '<rootDir>/test/unit/**/*.test.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  },
  collectCoverage: true,
  coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }], 'json-summary'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/data-structures/**/*.{ts,js}',
    'src/types/**/*.{ts,js}',
    'src/interfaces/**/*.{ts,js}',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/fixtures/**',
    '!src/**/examples/**',
    '!src/**/bench/**',
    '!src/**/cli/**'
  ]
};

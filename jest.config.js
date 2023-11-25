module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/unit/**/*.test.ts', '<rootDir>/test/unit/**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }], "json-summary"],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/data-structures/**/*.{ts,js}',
    'src/types/**/*.{ts,js}',
    'src/interfaces/**/*.{ts,js}',
  ],
};

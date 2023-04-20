// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
  coverageAnalysis: 'perTest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.unit.config.js',
    enableFindRelatedTests: true,
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  disableTypeChecks: true,
  mutate: [
    // executes one module per time, because it consumes a lot of memory
    // 'src/store/catalog/**/*.ts?(x)',
    'src/store/sales/**/*.ts?(x)',
    // 'src/store/users/**/*.ts?(x)',
    // 'src/store/shared/**/*.ts?(x)',
    // 'src/store/payment/**/*.ts?(x)',
    '!**/__tests__/**/*.ts?(x)',
    '!**/__mocks__/**/*.ts?(x)',
    '!**/?(*.)+(spec|test).ts?(x)',
  ],
  ignoreStatic: true,
  concurrency: 3,
};
export default config;

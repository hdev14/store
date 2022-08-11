const rootConfig = require("./jest.config.js");

module.exports = {
  ...rootConfig,
  ...{
    displayName: "Integration Tests",
    globalSetup: "<rootDir>/__tests__/setup.ts",
    globalTeardown: "<rootDir>/__tests__/teardown.ts",
    testMatch: [
      "**/__tests__/**/*.int.(spec|test).[jt]s?(x)"
    ]
  }
}

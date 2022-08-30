const rootConfig = require("./jest.config.js");

module.exports = {
  ...rootConfig,
  ...{
    displayName: "Integration Tests",
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "src/store/",
      "__tests__",
    ],
    setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
    testMatch: [
      "**/__tests__/**/*.int.(spec|test).[jt]s?(x)"
    ]
  }
}

const rootConfig = require("./jest.config.js");

module.exports = {
  ...rootConfig,
  ...{
    displayName: "Integration Tests",
    testMatch: [
      "**/__tests__/**/*.int.(spec|test).[jt]s?(x)"
    ]
  }
}

const rootConfig = require("./jest.config.js");

module.exports = {
  ...rootConfig,
  ...{
    displayName: "Unit Tests",
    testMatch: [
      "**/__tests__/**/*.unit.(spec|test).[jt]s?(x)"
    ]
  }
}

module.exports = {
  preset: "jest-puppeteer",
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", { diagnostics: false }] },
  testRegex: String.raw`./*npg-sri-hash-check.test\.ts$`,
  reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'wallet-integration-TEST.xml',
      } ]
    ]
  };


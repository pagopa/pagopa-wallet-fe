module.exports = {
  preset: "jest-puppeteer",
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", { diagnostics: false }] },
  testRegex: String.raw`./no-outcome-redirect.test\.ts$`,
  reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'wallet-no-outcome-redirect-TEST.xml',
      } ]
    ]
  };


module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./no-outcome-redirect.test\\.ts$",
  reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'wallet-no-outcome-redirect-TEST.xml',
      } ]
    ]
  };


module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: './test_reports',
      outputName: 'wallet-unit-TEST.xml',
    } ],
    [ 'jest-junit', {
      outputDirectory: './test_reports',
      outputName: 'sonar-report.xml',
    } ]
  ],
  testResultsProcessor: "jest-sonar-reporter",
  setupFiles: ['<rootDir>/src/env-config.js'],
};

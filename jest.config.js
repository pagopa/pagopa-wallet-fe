module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testRegex: "./*unit.test\\.ts$",
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
  testPathIgnorePatterns: [
    "/<rootDir>/src/__integration_tests__"
  ],
};

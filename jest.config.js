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
  modulePathIgnorePatterns: ["__integration_tests__"],
  testResultsProcessor: "jest-sonar-reporter",
  setupFiles: ['<rootDir>/src/env-config.js'],
};

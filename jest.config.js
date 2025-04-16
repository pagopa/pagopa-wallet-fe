module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testMatch: [
    "**/__tests__/**/*.(tsx|ts)"
  ],
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
  collectCoverage: true,
  collectCoverageFrom: [
      "src/**/*.ts",
      "src/**/*.tsx",
      "!<rootDir>/src/index.ts",
      "!<rootDir>/src/instrumentation.ts",
      "!<rootDir>/src/__tests__/**/*",
      "!<rootDir>/src/__integration_tests__/**/*",
      "!<rootDir>/src/__mocks__/**/*"
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    ".module.ts",
    "<rootDir>/src/translations",
    "<rootDir>/src/generated/",
    "<rootDir>/src/__mocks__/*.ts",
    "<rootDir>/src/utils/api/pm",
    "<rootDir>/src/routes/pm",
    "index.ts",
    "image.d.ts",
],
  testResultsProcessor: "jest-sonar-reporter",
  setupFiles: ['<rootDir>/src/env-config.js'],
  modulePathIgnorePatterns: ["__integration_tests__"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};

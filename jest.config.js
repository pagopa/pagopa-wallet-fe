module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["dist", "/node_modules"],
    testRegex: "./*test\\.ts$",
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
    coverageReporters: ["cobertura",'lcov', 'text-summary', 'html'],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!<rootDir>/src/index.ts",
        "!<rootDir>/src/**/__tests__/**/*",
        "!<rootDir>/src/__mocks__/**/*"
    ],
    coveragePathIgnorePatterns: ["index.ts"],
    testResultsProcessor: "jest-sonar-reporter",
    coveragePathIgnorePatterns: [
        "node_modules",
        "test-config",
        ".module.ts",
        "<rootDir>/src/generated/",
        "<rootDir>/src/__mocks__/*.ts"
    ],
    coverageDirectory: "<rootDir>/coverage/",
  };

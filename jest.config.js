module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["dist", "/node_modules"],
    testRegex: "./*test\\.ts$",
    reporters: [
      'default',
      [ 'jest-junit', {
        outputDirectory: './test_reports',
        outputName: 'wallet-fe-unit-TEST.xml',
      } ]
    ],
    coverageReporters: ["cobertura",'lcov'],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!<rootDir>/src/index.ts",
        "!<rootDir>/src/__tests__/**/*",
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

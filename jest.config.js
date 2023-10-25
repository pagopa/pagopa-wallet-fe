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
      } ]
    ],
    coverageReporters: ["cobertura",'lcov'],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        "generated",
      ],
    modulePathIgnorePatterns: ["__integration_tests__"]
  };

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" });

module.exports = {
  // jest-preset-angular setup
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  globalSetup: "jest-preset-angular/global-setup",
  // Cache and covarage
  cacheDirectory: "./cache",
  collectCoverage: true,
  collectCoverageFrom: ["src/app/**/*.ts"],
  coverageDirectory: "./coverage",
  // Paths mapper
  moduleNameMapper,
  // Test match and ignore
  testMatch: ["**/?(*.)+(spec|test).ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/src/test.ts",
    "<rootDir>/src/setup-jest.ts",
    "<rootDir>/src/jest-utils.ts",
    "<rootDir>/src/tests/templates/",
    // "<rootDir>/src/tests/examples/",
  ],
  testTimeout: 60000,
};

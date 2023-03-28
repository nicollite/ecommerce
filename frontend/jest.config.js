const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" });

module.exports = {
  cacheDirectory: "./cache",
  collectCoverage: true,
  collectCoverageFrom: ["src/app/**/*.ts"],
  coverageDirectory: "./coverage",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      isolatedModules: true,
    },
  },
  transform: {
    "\\.(ts|tsx)$": "<rootDir>/fix-istanbul-decorators.js",
  },
  moduleNameMapper,
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
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

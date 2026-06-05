module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"], // ← corrige ici
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|js|html|svg)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.(html|svg)$",
      },
    ],
  },
  moduleNameMapper: {
    "^@environments/(.*)$": "<rootDir>/src/environments/$1",
  },
  testMatch: ["**/src/**/*.spec.ts"],
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.module.ts",
    "!src/app/**/*.routes.ts",
    "!src/main.ts",
  ],
};

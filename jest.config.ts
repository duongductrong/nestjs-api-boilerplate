export default {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
}

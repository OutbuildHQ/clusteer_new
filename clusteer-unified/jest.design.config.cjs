const nextJest = require("next/jest");
module.exports = nextJest({ dir: "./apps/customer" })({
	modulePathIgnorePatterns: ["<rootDir>/apps/customer/.next/", "<rootDir>/apps/admin/.next/"],
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	moduleNameMapper: {
		"^@/(.*)$": ["<rootDir>/packages/ui/src/$1", "<rootDir>/apps/customer/src/$1"],
	},
	testMatch: ["<rootDir>/tests/design/*.test.tsx"],
});

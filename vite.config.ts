import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["repos/**"],
  },
  lint: {
    ignorePatterns: ["repos/**"],
  },
  test: {
    passWithNoTests: true,
    exclude: [
      "**/node_modules/**",
      "repos/**",
      "tests/e2e/**",
      "**/tests/e2e/**",
    ],
  },
});

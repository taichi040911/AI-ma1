/// <reference types="vitest/config" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "apps/**/*.test.{ts,tsx,js,jsx}",
      "apps/**/*.spec.{ts,tsx,js,jsx}",
      "packages/**/*.test.{ts,tsx,js,jsx}",
      "packages/**/*.spec.{ts,tsx,js,jsx}"
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.expo/**",
      "**/e2e/**"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/.next/**",
        "**/.expo/**",
        "**/e2e/**"
      ]
    }
  }
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: ".sisyphus/evidence/coverage-unit"
    }
  }
});

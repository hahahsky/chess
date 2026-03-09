import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/component/**/*.test.ts", "tests/component/**/*.test.tsx"],
    setupFiles: ["./tests/component/setup.ts"],
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: ".sisyphus/evidence/coverage-component"
    }
  }
});

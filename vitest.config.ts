import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const DOM_TEST_DIRS = [
  "src/app/recruiting/_lib/hooks/**/*.test.{ts,tsx}",
  "src/app/recruiting/_components/**/*.test.{ts,tsx}",
];

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "logic",
          environment: "node",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["node_modules/**", ...DOM_TEST_DIRS],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: DOM_TEST_DIRS,
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["./tsc-cache"],
    globals: true,
    env: {},
  },
  plugins: [tsconfigPaths()],
});

import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

const config = defineConfig({
  test: {
    globals: true,
    environment: "node",
    restoreMocks: true,
    passWithNoTests: true,
  },
  plugins: [
    swc.vite({
      module: { type: "nodenext" },
    }),
  ],
});

export default config;

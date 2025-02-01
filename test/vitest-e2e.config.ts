import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const config = defineConfig({
  test: {
    include: ["**/*.e2e-test.ts"],
    globals: true,
  },
  plugins: [swc.vite()],
});

export default config;

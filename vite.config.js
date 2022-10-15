/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
// eslint-disable-next-line import/no-extraneous-dependencies
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    preferBuiltins: false,
    browser: true,
    alias: { './runtimeConfig': './runtimeConfig.browser' }
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // environment: 'jsdom'
  },
  build: {
    rollupOptions: {
      external: [/^node:.*/],
    },
  },
  plugins: [
    tsconfigPaths(),
    react({
      fastRefresh: process.env.NODE_ENV !== "test",
    }),
    {
      ...resolve({
        preferBuiltins: false,
        browser: true,
        alias: { './runtimeConfig': './runtimeConfig.browser' }
      }),
      enforce: "pre",
      apply: "build",
    },
    visualizer(),
  ],
  server: {
    hmr: { clientPort: process.env.CODESPACES ? 443 : undefined },
  },
});

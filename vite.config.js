/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa'

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
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    })

  ],
  server: {
    hmr: { clientPort: process.env.CODESPACES ? 443 : undefined },
  },
});

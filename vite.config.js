import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
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

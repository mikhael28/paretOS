import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
      react(),
      {
        ...resolve({
          preferBuiltins: false,
          browser: true,
        }),
        enforce: 'pre',
        apply: 'build',
      },
      visualizer()
  ],
});
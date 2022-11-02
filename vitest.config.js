/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        include: ['__tests__/**/?(*.)test.{ts,tsx}'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./__tests__/setup.ts'],
    }
})
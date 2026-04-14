import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/*.{ts,tsx}'],
      exclude: ['src/bin.ts', '**/node_modules/**'],
      reporter: ['json', 'lcov', 'text', 'clover', 'html'],
      reportsDirectory: './coverage',
    },
  },
})

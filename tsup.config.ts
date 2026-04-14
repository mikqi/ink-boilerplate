import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bin.ts', 'src/ui.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
})

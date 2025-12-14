import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'lucide-react',
    'sonner'
  ],
  noExternal: [
    '@radix-ui/*',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'cmdk'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    }
  }
})

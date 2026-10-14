import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }
import { entries } from './src/entries.ts'

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

const externals = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { comments: false } } })],
  build: {
    target: 'esnext',
    emptyOutDir: true,
    lib: {
      formats: ['es'],
      entry: {
        index: src('index.ts'),
        resolver: src('resolver.ts'),
        ...Object.fromEntries(Object.keys(entries).map((name) => [name, src(`${name}/index.ts`)])),
      },
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: (id) => externals.some((name) => id === name || id.startsWith(`${name}/`)),
      output: { chunkFileNames: 'chunks/[name]-[hash].js' },
    },
  },
})

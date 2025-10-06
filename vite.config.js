const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'src/assets',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})
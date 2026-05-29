import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /festival-react/api/... wordt doorgestuurd naar Apache (XAMPP) op poort 80
      '/festival-react/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Bypass function: skip proxy for browser page navigations (text/html),
// so React Router can serve the SPA. API calls (application/json) go to Express.
function bypassForHtml(req) {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return req.url            // return the original URL → Vite serves index.html
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/register': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/update-profile': 'http://localhost:3000',
      '/change-password': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/recipes/filter': 'http://localhost:3000',
      '/recipes/mine': 'http://localhost:3000',
      '/recipes': {
        target: 'http://localhost:3000',
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html'
          }
        }
      },
    }
  }
})


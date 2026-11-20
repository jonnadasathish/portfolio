import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { projects } from './src/content/projects.js'

/**
 * Emits robots.txt (always) and sitemap.xml (when SITE_URL is set),
 * and adds canonical / og:url tags to index.html when SITE_URL is set.
 */
function seoFiles(siteUrl) {
  const routes = ['/', ...projects.map((p) => `/projects/${p.slug}`)]
  return {
    name: 'portfolio-seo-files',
    transformIndexHtml(html) {
      if (!siteUrl) return html
      // Social scrapers need absolute image URLs.
      html = html.replaceAll('content="/og-image.png"', `content="${siteUrl}/og-image.png"`)
      return html.replace(
        '</head>',
        `    <link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />\n  </head>`,
      )
    },
    generateBundle() {
      const robots = siteUrl
        ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (!siteUrl) {
        this.warn('SITE_URL is not set: sitemap.xml was not generated (see .env.example).')
        return
      }
      const urls = routes
        .map((r) => `  <url><loc>${siteUrl}${r}</loc></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.SITE_URL || '').replace(/\/+$/, '')
  return {
    plugins: [vue(), seoFiles(siteUrl)],
    build: { target: 'es2020', cssCodeSplit: true },
  }
})

# Jonnada Satish — Engineering Portfolio

A personal portfolio built with **Vue 3 + Vite**: a home page that opens on About (photo, intro, links), then featured work, impact, expertise,
experience, engineering approach, learning and contact, plus a detailed case-study page for each project, with
architecture diagrams drawn in HTML/CSS/SVG.

No backend: the site is static and can be hosted on any static host.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve dist/ locally
npm run lint         # ESLint (Vue + JS)
npm run test:smoke   # browser smoke tests against the build (needs Chrome)
```

`test:smoke` uses `playwright-core` with a locally installed Chrome (`CHROME_PATH`, default
`/usr/bin/google-chrome`). It covers navigation, mobile menu, theme persistence, copy-email, case-study routing,
404s, horizontal overflow on mobile, reduced motion and keyboard access, and saves screenshots to
`scripts/screenshots/`.

## Editing content

All copy lives in `src/content/` — components only render it.

| File | What it holds |
|---|---|
| `profile.js` | Name, links, hero copy, SEO text, nav items, **resume URL** |
| `projects.js` | Project cards and full case studies (one object per project) |
| `impact.js` | Impact metrics (only verified numbers) |
| `skills.js` | Skills, each tagged `work` or `personal` |
| `experience.js` | Role, timeline milestones |
| `principles.js` | Engineering approach and learning areas |

**Add a project:** append an object to `projects` in `projects.js` (copy an existing one). Set `diagram` to an
existing key in `src/components/diagrams/index.js`, or add a new diagram component there. The case-study route
`/projects/<slug>` and the sitemap entry are created automatically.

## Resume download

No PDF is included yet: the resume is a LaTeX file and could not be compiled on the build machine. Until a PDF
exists, the resume buttons open a pre-filled email ("Request Resume").

To enable the download:
1. Compile the resume in Overleaf and download the PDF.
2. Save it as `public/Jonnada_Satish_Resume.pdf`.
3. In `src/content/profile.js` set `resumeUrl: '/Jonnada_Satish_Resume.pdf'`.
4. `npm run build`. The buttons switch to "Download Resume" automatically.

Do not put the `.tex` file or private notes in `public/` — everything there is published.

## SEO

- Per-page `<title>` and description (set by the router), Open Graph/Twitter tags, `og-image.png` (1200×630),
  favicons (`.svg`, `.ico`, Apple touch icon).
- `robots.txt` is always generated. Set `SITE_URL` (see `.env.example`) to also generate `sitemap.xml`, canonical
  and `og:url` tags, and absolute social-image URLs:
  ```bash
  SITE_URL=https://your-domain.example npm run build
  ```
- Regenerate icons and the social image after changing branding: `node scripts/generate-images.mjs`.

## Deployment

The site uses clean URLs (`/projects/<slug>`), so the host must serve `index.html` for unknown paths.

- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` handles SPA routing.
- **Vercel:** framework "Vite", output `dist`. `vercel.json` handles SPA routing.
- **Cloudflare Pages:** build `npm run build`, output `dist`. SPA fallback works by default when no `404.html` exists.
- **GitHub Pages:** copy `dist/index.html` to `dist/404.html` after building so deep links work, and set
  Vite `base` if the site is served from a sub-path.

Remember to set `SITE_URL` in the host's environment variables.

## Structure

```
src/
  content/        site copy (single source of truth)
  components/     sections, header/footer, project feature block
    diagrams/     architecture diagrams (container-query responsive)
  views/          HomeView, CaseStudyView, NotFoundView
  composables/    theme, section navigation, copy-to-clipboard
  directives/     v-reveal (scroll reveal, respects reduced motion)
  styles/         design tokens (dark + light), base styles, diagram primitives
scripts/          smoke tests, icon/OG image generator
```

## Accessibility & performance notes

- Skip link, visible focus states, labelled navigation landmarks, `aria-expanded` mobile menu (Escape closes it),
  live-region feedback for copy-email, text alternatives for diagrams.
- `prefers-reduced-motion` disables animations and scroll reveals.
- Self-hosted variable fonts (only the needed unicode ranges are downloaded); case-study and 404 pages are
  lazy-loaded. Main JS bundle ≈ 62 KB gzipped.

## Known limitations

- Content is rendered client-side. Search engines that run JavaScript (Google) index it; social previews of
  individual case-study URLs show the site-wide title and image, not per-project ones. Pre-rendering
  (e.g. `vite-ssg`) would fix this.
- No contact form — there is no submission backend, so contact is by email.
- The resume download needs a real PDF (see above).

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import { getProject } from './content/projects.js'
import { profile } from './content/profile.js'
import { scrollToSection } from './composables/scrollToSection.js'

// We restore/position scroll ourselves; stop the browser from overriding it after reloads.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/projects/:slug',
      name: 'project',
      component: () => import('./views/CaseStudyView.vue'),
      props: true,
      beforeEnter(to) {
        if (!getProject(to.params.slug)) {
          return { name: 'not-found', params: { pathMatch: to.path.slice(1).split('/') } }
        }
      },
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue') },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) {
      // Initial load, reload, address-bar edits and cross-page links: jump (no animation) once layout is ready.
      // Same-page hash changes (e.g. browser back between sections) scroll smoothly.
      const samePage = from.name && from.name === to.name
      scrollToSection(decodeURIComponent(to.hash.slice(1)), { smooth: Boolean(samePage) })
      return false
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  let title = profile.seo.title
  let description = profile.seo.description
  if (to.name === 'project') {
    const p = getProject(to.params.slug)
    title = `${p.title} — Case study · ${profile.name}`
    description = p.summary
  } else if (to.name === 'not-found') {
    title = `Page not found · ${profile.name}`
  }
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
})

import { useRoute, useRouter } from 'vue-router'
import { scrollToSection } from './scrollToSection.js'

/** Navigate to a section on the home page, from any route. */
export function useSectionNav() {
  const route = useRoute()
  const router = useRouter()

  function goTo(id) {
    if (route.name !== 'home') {
      router.push({ path: '/', hash: id === 'top' ? '' : `#${id}` })
      return
    }
    history.replaceState(history.state, '', id === 'top' ? '/' : `#${id}`)
    scrollToSection(id)
    // Move keyboard focus to the section without causing another scroll.
    const el = document.getElementById(id)
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
  }

  return { goTo }
}

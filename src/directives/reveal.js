// v-reveal: fade/slide content in when it scrolls into view.
// Content is shown immediately when IntersectionObserver is missing or motion is reduced.
let observer

function getObserver() {
  if (!observer && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
  }
  return observer
}

export const reveal = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const obs = getObserver()
    if (!obs || reduce) {
      el.classList.add('is-visible')
      return
    }
    obs.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

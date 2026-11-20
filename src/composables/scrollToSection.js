// Reliable in-page navigation to a section.
// Waits for fonts/layout, scrolls to the exact position under the sticky header, then keeps the target aligned
// for a short time in case layout shifts (late fonts, images, slow devices) — unless the user scrolls themselves.

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))

export function headerOffset() {
  const bar = document.querySelector('.site-header .bar')
  return (bar ? bar.getBoundingClientRect().bottom : 64) + 16
}

async function layoutReady() {
  if (document.fonts?.ready) {
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
  }
  await nextFrame()
  await nextFrame()
}

let activeRun = 0

export async function scrollToSection(id, { smooth = true } = {}) {
  const run = ++activeRun
  await layoutReady()
  if (run !== activeRun) return

  const el = id === 'top' ? null : document.getElementById(id)
  if (id !== 'top' && !el) return
  const targetY = () =>
    el ? Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - headerOffset())) : 0

  // Stop correcting as soon as the user takes over.
  let userTookOver = false
  const takeOver = () => { userTookOver = true }
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown']
  events.forEach((e) => window.addEventListener(e, takeOver, { passive: true, capture: true }))
  const cleanup = () => events.forEach((e) => window.removeEventListener(e, takeOver, { capture: true }))

  // Skip the initiating event (click/keypress that called us is already dispatched).
  await nextFrame()
  window.scrollTo({ top: targetY(), behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' })

  // Wait for the (smooth) scroll to finish: position unchanged for ~12 frames, max 3 s.
  const started = performance.now()
  let last = -1
  let still = 0
  while (still < 12 && performance.now() - started < 3000) {
    await nextFrame()
    if (run !== activeRun || userTookOver) return cleanup()
    if (window.scrollY === last) still += 1
    else { still = 0; last = window.scrollY }
  }

  // Keep the section aligned for a little longer (late layout shifts).
  const until = performance.now() + 1200
  while (performance.now() < until) {
    if (run !== activeRun || userTookOver) return cleanup()
    const maxY = document.documentElement.scrollHeight - window.innerHeight
    const want = Math.min(targetY(), maxY)
    if (Math.abs(window.scrollY - want) > 2) window.scrollTo({ top: want, behavior: 'auto' })
    await nextFrame()
  }
  cleanup()
}

// End-to-end smoke test of the production build, driven with playwright-core + a local Chrome.
//   npm run build && npm run test:smoke
// Env: CHROME_PATH (default /usr/bin/google-chrome), PORT (default 4179).
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const PORT = Number(process.env.PORT || 4179)
const BASE = `http://localhost:${PORT}`
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const SHOTS = new URL('./screenshots/', import.meta.url).pathname
mkdirSync(SHOTS, { recursive: true })

const results = []
// Section heading sits exactly under the sticky header (header height + 12 px), within 4 px.
async function aligned(page, id) {
  return page.evaluate((i) => {
    const el = document.getElementById(i)
    const want = document.querySelector('.site-header .bar').getBoundingClientRect().bottom + 16
    const top = el.getBoundingClientRect().top
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    // The first section (About) can't scroll above the page top: "landed" means the page is at the very top.
    const firstAtTop = el === document.querySelector('main > section') && window.scrollY === 0
    return { ok: firstAtTop || Math.abs(top - want) <= 4 || (atBottom && top > 0 && top < want + 4 + window.innerHeight / 2), top: Math.round(top), want }
  }, id)
}
// Wait until smooth scrolling has finished (scroll position stable for 200 ms).
async function settle(page) {
  await page.waitForFunction(() => new Promise((resolve) => {
    let last = window.scrollY, still = 0
    const tick = () => {
      if (window.scrollY === last) { still += 1 } else { still = 0; last = window.scrollY }
      if (still >= 12) resolve(true); else requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }), null, { timeout: 8000 })
}
const check = (name, ok, info = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`)
}

// Run vite directly (not through npx) so killing `server` really stops the preview process.
const viteBin = new URL('../node_modules/vite/bin/vite.js', import.meta.url).pathname
const server = spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' })
await new Promise((resolve, reject) => {
  let log = ''
  const t = setTimeout(() => reject(new Error(`preview server did not start on port ${PORT}:\n${log}`)), 20000)
  const onData = (d) => {
    log += d
    if (String(d).includes(String(PORT))) { clearTimeout(t); resolve() }
  }
  server.stdout.on('data', onData)
  server.stderr.on('data', onData)
  server.on('exit', (code) => { clearTimeout(t); reject(new Error(`preview server exited (${code}):\n${log}`)) })
})

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
try {
  // ---------- Desktop ----------
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${m.text()} @ ${m.location().url}`) })
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('does-not-exist')) errors.push(`${r.status()} ${r.url()}`) })

  await page.goto(BASE, { waitUntil: 'networkidle' })
  check('home opens on About (h1)', (await page.locator('h1').innerText()).includes('Satish') && (await page.locator('#about h1').count()) === 1)
  check('About is the first section', await page.evaluate(() => document.querySelector('main > section')?.id === 'about'))
  check('document title set', (await page.title()).includes('Jonnada Satish'))
  check('one h1 on home', (await page.locator('h1').count()) === 1)
  await page.screenshot({ path: `${SHOTS}desktop-hero.png` })

  for (const id of ['work', 'about', 'impact', 'expertise', 'experience', 'approach', 'about']) {
    await page.locator(`.nav-desktop a[href="/#${id}"]`).click()
    await settle(page)
    await page.waitForTimeout(400)
    const a = await aligned(page, id)
    check(`nav → #${id} lands under the header`, a.ok, `top=${a.top} want=${a.want}`)
    check(`nav → #${id} updates the URL hash`, page.url().endsWith(`#${id}`))
  }

  // Load / reload / address bar / back-forward with a hash
  for (const id of ['about', 'expertise', 'contact']) {
    await page.goto(`${BASE}/#${id}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    let a = await aligned(page, id)
    check(`direct load /#${id} lands on the section`, a.ok, `top=${a.top}`)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    a = await aligned(page, id)
    check(`reload /#${id} stays on the section`, a.ok, `top=${a.top}`)
  }
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => { location.hash = 'experience' })
  await page.waitForTimeout(1500)
  let ab = await aligned(page, 'experience')
  check('editing the hash in the address bar scrolls to it', ab.ok, `top=${ab.top}`)
  await page.goto(`${BASE}/projects/mcp-server#architecture`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  ab = await aligned(page, 'architecture')
  check('direct load of a case-study section link', ab.ok, `top=${ab.top}`)
  await page.locator('.nav-desktop a[href="/#about"]').click()
  await page.waitForURL(`${BASE}/#about`)
  await page.waitForTimeout(1200)
  ab = await aligned(page, 'about')
  check('header link from a case study lands on the home section', ab.ok, `top=${ab.top}`)
  await page.goBack({ waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  check('browser Back returns to the case study', page.url().includes('/projects/mcp-server'))
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.locator('#about a', { hasText: 'Explore my work' }).click()
  await settle(page)
  await page.waitForTimeout(400)
  ab = await aligned(page, 'work')
  check('hero “Explore my work” lands on Work', ab.ok, `top=${ab.top}`)
  await page.locator('header a.brand').click()
  await settle(page)
  check('logo returns to the top', (await page.evaluate(() => window.scrollY)) < 2)

  await page.locator('header .cta').click()
  await settle(page)
  await page.waitForTimeout(400)
  const atContact = await aligned(page, 'contact')
  check('header Contact button scrolls to contact', atContact.ok, `top=${atContact.top}`)

  // copy email
  await page.locator('#contact button', { hasText: 'Copy email' }).click()
  await page.waitForTimeout(200)
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  check('copy email writes to clipboard', clip === 'jonnadasathish4444@gmail.com')
  check('copy button shows confirmation', (await page.locator('#contact button', { hasText: 'Copied' }).count()) === 1)

  // links
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))
  check('LinkedIn link present', hrefs.includes('https://www.linkedin.com/in/jonnadasathish/'))
  check('GitHub link present', hrefs.includes('https://github.com/jonnadasathish'))
  check('mailto link present', hrefs.some((h) => h.startsWith('mailto:jonnadasathish4444@gmail.com')))
  check('no empty hrefs', hrefs.every((h) => h && h !== '#'))
  const ext = await page.$$eval('a[target="_blank"]', (as) => as.every((a) => (a.rel || '').includes('noopener')))
  check('external links use rel=noopener', ext)

  // theme toggle + persistence
  const before = await page.evaluate(() => document.documentElement.dataset.theme)
  await page.locator('header button[aria-label*="theme"]').click()
  const after = await page.evaluate(() => document.documentElement.dataset.theme)
  check('theme toggle switches theme', before === 'dark' && after === 'light')
  await page.reload({ waitUntil: 'networkidle' })
  check('theme persists after reload', (await page.evaluate(() => document.documentElement.dataset.theme)) === 'light')
  await page.screenshot({ path: `${SHOTS}desktop-hero-light.png` })
  await page.locator('#work').scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOTS}desktop-work-light.png` })
  await page.locator('header button[aria-label*="theme"]').click()

  // full-page screenshot (force reveals)
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible')))
  await page.screenshot({ path: `${SHOTS}desktop-full.png`, fullPage: true })

  // project tabs
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.locator('#work').scrollIntoViewIfNeeded()
  const tabs = page.locator('[role="tab"]')
  check('four project tabs', (await tabs.count()) === 4)
  check('first tab selected by default', (await tabs.nth(0).getAttribute('aria-selected')) === 'true')
  await tabs.nth(2).click()
  check('clicking a tab selects it', (await tabs.nth(2).getAttribute('aria-selected')) === 'true')
  check('clicking a tab shows its panel', await page.locator('#panel-mcp-server').isVisible())
  check('other panels hidden', !(await page.locator('#panel-dms-modernization').isVisible()))
  await tabs.nth(2).focus()
  await page.keyboard.press('ArrowRight')
  check('ArrowRight moves to next tab', (await tabs.nth(3).getAttribute('aria-selected')) === 'true')
  check('focus follows the selected tab', await tabs.nth(3).evaluate((el) => el === document.activeElement))
  await page.keyboard.press('Home')
  check('Home key selects the first tab', (await tabs.nth(0).getAttribute('aria-selected')) === 'true')
  await tabs.nth(1).click()
  await page.locator('#panel-ai-dealer-assistant a', { hasText: 'Read the case study' }).click()
  await page.waitForURL('**/projects/ai-dealer-assistant')
  check('case-study link inside a tab panel works', (await page.locator('h1').innerText()).includes('Assistant'))
  await page.goto(BASE, { waitUntil: 'networkidle' })

  // case studies
  const slugs = await page.$$eval('a[href^="/projects/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  check('four case-study links', slugs.length === 4, slugs.join(' '))
  await page.locator(`a[href="${slugs[0]}"]`).first().click()
  await page.waitForURL(`**${slugs[0]}`)
  await page.waitForTimeout(400)
  check('case study opens via card link', (await page.locator('h1').innerText()).length > 5)
  await page.screenshot({ path: `${SHOTS}desktop-case-top.png` })
  await page.locator('.toc a', { hasText: 'Architecture' }).click()
  await settle(page)
  await page.waitForTimeout(400)
  const arch = await aligned(page, 'architecture')
  check('case study TOC jumps to section', arch.ok, `top=${arch.top}`)
  await page.screenshot({ path: `${SHOTS}desktop-case-arch.png` })
  await page.locator('a.next').click()
  await page.waitForURL(`**${slugs[1]}`)
  check('next case study link works', page.url().endsWith(slugs[1]))
  await page.locator('a.back').click()
  await page.waitForURL(`${BASE}/#work`)
  await settle(page)
  await page.waitForTimeout(600)
  const backWork = await aligned(page, 'work')
  check('back link returns to #work', backWork.ok, `top=${backWork.top}`)

  for (const s of slugs) {
    const res = await page.goto(BASE + s, { waitUntil: 'networkidle' })
    const title = await page.title()
    check(`direct load ${s}`, res.status() === 200 && title.includes('Case study'), title)
  }
  await page.goto(`${BASE}/projects/does-not-exist`, { waitUntil: 'networkidle' })
  check('unknown project shows 404 view', (await page.locator('h1').innerText()).includes('doesn’t exist'))
  await page.goto(`${BASE}/robots.txt`)
  check('robots.txt served', (await page.content()).includes('User-agent'))
  check('no console or page errors (desktop)', errors.length === 0, errors.join(' | '))

  // ---------- Mobile ----------
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const mp = await m.newPage()
  const merr = []
  mp.on('pageerror', (e) => merr.push(e.message))
  await mp.goto(BASE, { waitUntil: 'networkidle' })
  await mp.screenshot({ path: `${SHOTS}mobile-hero.png` })
  const overflow = async () => mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check('mobile: no horizontal overflow (home)', (await overflow()) <= 0, `overflow=${await overflow()}`)
  check('mobile: desktop nav hidden', !(await mp.locator('.nav-desktop').isVisible()))
  await mp.locator('.menu-btn').click()
  check('mobile: menu opens', await mp.locator('#mobile-nav').isVisible())
  check('mobile: aria-expanded true', (await mp.locator('.menu-btn').getAttribute('aria-expanded')) === 'true')
  await mp.waitForTimeout(350)
  const menuBg = await mp.locator('#mobile-nav').evaluate((el) => getComputedStyle(el).opacity)
  check('mobile: menu fully opaque after opening', menuBg === '1')
  await mp.screenshot({ path: `${SHOTS}mobile-menu.png` })
  await mp.keyboard.press('Escape')
  await mp.waitForTimeout(350)
  check('mobile: Escape closes menu', !(await mp.locator('#mobile-nav').isVisible()))
  await mp.locator('.menu-btn').click()
  await mp.locator('#mobile-nav a', { hasText: 'Experience' }).click()
  await mp.waitForTimeout(300)
  await settle(mp)
  check('mobile: menu link closes menu', !(await mp.locator('#mobile-nav').isVisible()))
  await mp.waitForTimeout(400)
  const mexp = await aligned(mp, 'experience')
  check('mobile: menu link scrolls to section', mexp.ok, `top=${mexp.top}`)
  await mp.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible')))
  await mp.screenshot({ path: `${SHOTS}mobile-full.png`, fullPage: true })
  await mp.goto(BASE + slugs[2], { waitUntil: 'networkidle' })
  check('mobile: no horizontal overflow (case study)', (await overflow()) <= 0, `overflow=${await overflow()}`)
  await mp.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible')))
  await mp.screenshot({ path: `${SHOTS}mobile-case.png`, fullPage: true })
  check('no page errors (mobile)', merr.length === 0, merr.join(' | '))

  // ---------- Slow device: 4x CPU throttle + fonts delayed 1.5 s ----------
  const slow = await browser.newContext({ viewport: { width: 1907, height: 890 } })
  const sp = await slow.newPage()
  const cdp = await slow.newCDPSession(sp)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await sp.route(/\.woff2/, async (r) => { await new Promise((x) => setTimeout(x, 1500)); await r.continue() })
  await sp.goto(`${BASE}/#about`)
  await sp.waitForTimeout(4500)
  let sa = await aligned(sp, 'about')
  check('slow device: load /#about lands on About', sa.ok, `top=${sa.top}`)
  await sp.goto(`${BASE}/`)
  await sp.waitForTimeout(400) // click before fonts arrive
  await sp.locator('.nav-desktop a[href="/#about"]').click()
  await sp.waitForTimeout(4500)
  sa = await aligned(sp, 'about')
  check('slow device: clicking About during load lands on About', sa.ok, `top=${sa.top}`)
  await sp.locator('.nav-desktop a[href="/#experience"]').click()
  await sp.waitForTimeout(4000)
  sa = await aligned(sp, 'experience')
  check('slow device: clicking Experience lands on Experience', sa.ok, `top=${sa.top}`)
  // user scrolling must win over auto-correction
  await sp.locator('.nav-desktop a[href="/#work"]').click()
  await sp.waitForTimeout(150)
  await sp.mouse.wheel(0, 900)
  await sp.waitForTimeout(3500)
  const y1 = await sp.evaluate(() => window.scrollY)
  await sp.waitForTimeout(1500)
  check('user scroll is never overridden', Math.abs((await sp.evaluate(() => window.scrollY)) - y1) < 2)
  await slow.close()

  // ---------- Reduced motion ----------
  const rm = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const rp = await rm.newPage()
  await rp.goto(BASE, { waitUntil: 'networkidle' })
  const hidden = await rp.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length)
  check('reduced motion: all content visible without scrolling', hidden === 0, `hidden=${hidden}`)

  // ---------- Keyboard ----------
  const kp = await ctx.newPage()
  await kp.goto(BASE, { waitUntil: 'networkidle' })
  await kp.keyboard.press('Tab')
  const first = await kp.evaluate(() => document.activeElement?.textContent?.trim())
  check('keyboard: first Tab reaches skip link', first === 'Skip to content')
} finally {
  await browser.close()
  server.kill()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)

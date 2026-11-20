// Renders favicon.ico, apple-touch-icon.png and og-image.png into /public using a local Chrome.
//   node scripts/generate-images.mjs        (env CHROME_PATH, default /usr/bin/google-chrome)
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const pub = (f) => new URL(`../public/${f}`, import.meta.url).pathname
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const svg = readFileSync(pub('favicon.svg'), 'utf8')

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()

async function renderIcon(size) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`)
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

// ICO container holding PNG images (supported by all current browsers).
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4)
  const dir = Buffer.alloc(16 * images.length)
  let offset = 6 + dir.length
  images.forEach(({ size, png }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o); dir.writeUInt8(size >= 256 ? 0 : size, o + 1)
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3)
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6)
    dir.writeUInt32LE(png.length, o + 8); dir.writeUInt32LE(offset, o + 12)
    offset += png.length
  })
  return Buffer.concat([header, dir, ...images.map((i) => i.png)])
}

writeFileSync(pub('favicon.ico'), ico([{ size: 32, png: await renderIcon(32) }, { size: 16, png: await renderIcon(16) }]))
writeFileSync(pub('apple-touch-icon.png'), await renderIcon(180))

await page.setViewportSize({ width: 1200, height: 630 })
await page.setContent(`<!doctype html><html><head><style>
  body{margin:0;width:1200px;height:630px;background:#07080a;color:#f5f6f8;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
    background-image:radial-gradient(45% 60% at 50% 0%,rgba(99,102,241,.35),transparent 70%),radial-gradient(30% 40% at 80% 10%,rgba(192,132,252,.2),transparent 70%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:72px 90px;box-sizing:border-box}
  .who{display:flex;align-items:center;gap:14px;padding:8px 22px 8px 8px;border:1px solid rgba(255,255,255,.12);border-radius:999px;font-size:24px;color:#a3a9b6;background:rgba(255,255,255,.03)}
  .mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:17px;background:linear-gradient(135deg,#6366f1,#8b5cf6 55%,#d946ef)}
  .who b{color:#f5f6f8;font-weight:600}
  h1{margin:40px 0 0;font-size:64px;line-height:1.05;letter-spacing:-2.5px;font-weight:650;max-width:980px}
  h1 span{background:linear-gradient(100deg,#a5b4fc,#c4b5fd 45%,#f0abfc);-webkit-background-clip:text;background-clip:text;color:transparent}
  .foot{margin-top:40px;display:flex;gap:34px;font-size:22px;color:#7b818d}
</style></head><body>
  <div class="who"><div class="mark">JS</div><span><b>Jonnada Satish</b> &nbsp;·&nbsp; Software Engineer at CarTrade Tech</span></div>
  <h1>I build reliable backends <span>and bring AI into real products.</span></h1>
  <div class="foot"><span>REST APIs</span><span>Vue 3</span><span>LLM tool calling</span><span>MCP</span><span>Redis</span></div>
</body></html>`)
writeFileSync(pub('og-image.png'), await page.screenshot({ type: 'png' }))

await browser.close()
console.log('wrote favicon.ico, apple-touch-icon.png, og-image.png')

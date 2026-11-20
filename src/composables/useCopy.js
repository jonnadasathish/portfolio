import { ref } from 'vue'

/** Copy text to the clipboard with a fallback for non-secure contexts. */
export function useCopy(timeout = 2000) {
  const copied = ref(false)
  const failed = ref(false)
  let timer

  async function copy(text) {
    failed.value = false
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        if (!ok) throw new Error('copy command failed')
      }
      copied.value = true
    } catch {
      failed.value = true
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
      failed.value = false
    }, timeout)
  }

  return { copied, failed, copy }
}

import { ref } from 'vue'

const STORAGE_KEY = 'theme'
const theme = ref(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

function apply(value) {
  theme.value = value
  document.documentElement.setAttribute('data-theme', value)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', value === 'light' ? '#ffffff' : '#07080a')
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable: theme still applies for this visit */
  }
}

export function useTheme() {
  return {
    theme,
    toggle: () => apply(theme.value === 'dark' ? 'light' : 'dark'),
  }
}

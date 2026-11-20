<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X, Sun, Moon, ChevronRight } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme.js'
import { useSectionNav } from '../composables/useSectionNav.js'
import { profile, navItems } from '../content/profile.js'

const open = ref(false)
const scrolled = ref(false)
const menuButton = ref(null)
const route = useRoute()
const { theme, toggle } = useTheme()
const { goTo } = useSectionNav()

async function navigate(id) {
  if (open.value) {
    open.value = false
    // Release the scroll lock before scrolling, otherwise the jump is ignored.
    document.body.style.overflow = ''
    await nextTick()
  }
  goTo(id)
}

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function onKeydown(event) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
    menuButton.value?.focus()
  }
}

function onResize() {
  if (window.innerWidth > 900) open.value = false
}

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
watch(() => route.fullPath, () => {
  open.value = false
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="site-header" :class="{ 'is-raised': scrolled || open }">
    <div class="container">
      <div class="bar">
        <a href="/" class="brand" aria-label="Jonnada Satish, home" @click.prevent="navigate('top')">
          <span class="brand-mark" aria-hidden="true">{{ profile.initials }}</span>
          <span class="brand-name">{{ profile.name }}</span>
        </a>

        <nav class="nav-desktop" aria-label="Primary">
          <a v-for="item in navItems" :key="item.id" :href="`/#${item.id}`" @click.prevent="navigate(item.id)">
            {{ item.label }}
          </a>
        </nav>

        <div class="actions">
          <button
            class="icon-btn"
            type="button"
            :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            :title="theme === 'dark' ? 'Light theme' : 'Dark theme'"
            @click="toggle"
          >
            <Sun v-if="theme === 'dark'" :size="17" aria-hidden="true" />
            <Moon v-else :size="17" aria-hidden="true" />
          </button>
          <a href="/#contact" class="btn btn-primary btn-sm cta" @click.prevent="navigate('contact')">Get in touch</a>
          <button
            ref="menuButton"
            class="icon-btn menu-btn"
            type="button"
            :aria-expanded="open"
            aria-controls="mobile-nav"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            @click="open = !open"
          >
            <X v-if="open" :size="20" aria-hidden="true" />
            <Menu v-else :size="20" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="drawer">
      <nav v-if="open" id="mobile-nav" class="nav-mobile" aria-label="Mobile">
        <div class="container">
          <a
            v-for="item in [...navItems, { id: 'contact', label: 'Contact' }]"
            :key="item.id"
            :href="`/#${item.id}`"
            @click.prevent="navigate(item.id)"
          >
            {{ item.label }}
            <ChevronRight :size="18" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding-top: 12px;
  /* Let page content start underneath the floating bar. */
  margin-bottom: -64px;
  pointer-events: none;
}
.site-header > * { pointer-events: auto; }
.bar {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 8px 0 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: background-color 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.is-raised .bar {
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  backdrop-filter: saturate(160%) blur(16px);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  border-color: var(--border);
  box-shadow: var(--shadow);
}
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.02em; font-size: 0.98rem; }
.brand-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--grad);
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: 0 4px 14px -4px var(--glow);
}
.nav-desktop { display: flex; gap: 2px; }
.nav-desktop a {
  padding: 7px 13px;
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 450;
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease);
}
.nav-desktop a:hover { color: var(--text); background: var(--surface-2); }
.actions { display: flex; align-items: center; gap: 6px; }
.menu-btn { display: none; }

.nav-mobile {
  position: fixed;
  inset: 72px 0 0 0;
  background: var(--bg);
  padding-top: 8px;
  overflow-y: auto;
}
.nav-mobile a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 4px;
  border-bottom: 1px solid var(--border);
  font-size: 1.35rem;
  font-weight: 550;
  letter-spacing: -0.02em;
}
.nav-mobile a svg { color: var(--text-faint); }

.drawer-enter-active, .drawer-leave-active { transition: opacity 0.22s var(--ease), transform 0.22s var(--ease); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 920px) {
  .nav-desktop, .cta { display: none; }
  .menu-btn { display: inline-grid; }
  .bar { background: color-mix(in srgb, var(--bg) 72%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-color: var(--border); }
}
@media (max-width: 420px) {
  .brand-name { display: none; }
}
</style>

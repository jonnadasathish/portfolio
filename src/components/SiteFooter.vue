<script setup>
import { profile, navItems } from '../content/profile.js'
import { useSectionNav } from '../composables/useSectionNav.js'
import BrandIcon from './BrandIcon.vue'

const { goTo } = useSectionNav()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="top">
        <div class="brand-col">
          <p class="brand"><span class="mark" aria-hidden="true">{{ profile.initials }}</span>{{ profile.name }}</p>
          <p class="muted tagline">Full-stack engineer focused on backend systems and AI integration.</p>
        </div>
        <nav aria-label="Footer">
          <p class="label">Sections</p>
          <ul>
            <li v-for="item in navItems" :key="item.id">
              <a :href="`/#${item.id}`" @click.prevent="goTo(item.id)">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
        <div>
          <p class="label">Elsewhere</p>
          <ul>
            <li><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"><BrandIcon name="linkedin" :size="14" /> LinkedIn</a></li>
            <li><a :href="profile.github" target="_blank" rel="noopener noreferrer"><BrandIcon name="github" :size="14" /> GitHub</a></li>
            <li><a :href="`mailto:${profile.email}`">Email</a></li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <p>© {{ year }} {{ profile.name }}</p>
        <p>Built with Vue 3 and Vite</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { border-top: 1px solid var(--border); padding-block: 56px 28px; }
.top { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 32px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.02em; }
.mark { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 8px; background: var(--grad); color: #fff; font-size: 0.66rem; font-weight: 700; }
.tagline { margin-top: 12px; max-width: 34ch; font-size: 0.92rem; }
.label { margin-bottom: 12px; }
ul { display: grid; gap: 8px; }
ul a { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.92rem; transition: color 0.2s var(--ease); }
ul a:hover { color: var(--text); }
.bottom { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--text-faint); font-size: 0.84rem; }
@media (max-width: 720px) { .top { grid-template-columns: 1fr 1fr; } .brand-col { grid-column: 1 / -1; } }
</style>

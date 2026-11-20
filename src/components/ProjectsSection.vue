<script setup>
import { ref } from 'vue'
import { Layers, Bot, Network, Server, Sparkles } from 'lucide-vue-next'
import { projects, ownershipNote } from '../content/projects.js'
import ProjectFeature from './ProjectFeature.vue'

const tabMeta = {
  dms: { icon: Layers, title: 'DMS modernization', sub: 'Legacy to API + SPA' },
  chat: { icon: Bot, title: 'AI assistant', sub: 'LLM tool calling' },
  mcp: { icon: Network, title: 'MCP server', sub: 'AI agents to APIs' },
  backend: { icon: Server, title: 'Backend & integrations', sub: 'Reliability and data' },
}

const active = ref(0)
const tabEls = []

function select(i, focus = false) {
  active.value = i
  if (focus) tabEls[i]?.focus()
}

function onKeydown(event, i) {
  const n = projects.length
  const keys = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }
  if (event.key in keys) {
    event.preventDefault()
    select(keys[event.key], true)
  }
}
</script>

<template>
  <section id="work" class="section" aria-labelledby="work-title">
    <div class="container">
      <div v-reveal class="section-head center">
        <p class="eyebrow"><Sparkles :size="14" aria-hidden="true" /> Featured work</p>
        <h2 id="work-title">Four systems, one platform.</h2>
        <p class="lead">
          Each project builds on the one before it. Pick one to see the problem, the architecture and what I built,
          or open the full case study.
        </p>
        <p class="ownership">{{ ownershipNote }}</p>
      </div>

      <div v-reveal class="tabs" role="tablist" aria-label="Projects">
        <button
          v-for="(p, i) in projects"
          :id="`tab-${p.slug}`"
          :key="p.slug"
          :ref="(el) => (tabEls[i] = el)"
          type="button"
          role="tab"
          class="tab"
          :class="{ active: active === i }"
          :aria-selected="active === i"
          :aria-controls="`panel-${p.slug}`"
          :tabindex="active === i ? 0 : -1"
          @click="select(i)"
          @keydown="onKeydown($event, i)"
        >
          <span class="tab-icon"><component :is="tabMeta[p.diagram].icon" :size="18" aria-hidden="true" /></span>
          <span class="tab-text">
            <span class="tab-title">{{ tabMeta[p.diagram].title }}</span>
            <span class="tab-sub">{{ tabMeta[p.diagram].sub }}</span>
          </span>
        </button>
      </div>

      <div v-reveal class="panels">
        <ProjectFeature
          v-for="(p, i) in projects"
          v-show="active === i"
          :id="`panel-${p.slug}`"
          :key="p.slug"
          :project="p"
          role="tabpanel"
          :aria-labelledby="`tab-${p.slug}`"
          tabindex="0"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--bg-raised);
  box-shadow: var(--highlight);
}
.tab {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 13px;
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.25s var(--ease), border-color 0.25s var(--ease);
}
.tab:hover { background: var(--surface); }
.tab.active { background: var(--surface); border-color: var(--border-strong); box-shadow: var(--shadow); }
.tab-icon {
  width: 36px;
  height: 36px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
  transition: color 0.25s var(--ease), background-color 0.25s var(--ease), border-color 0.25s var(--ease);
}
.tab.active .tab-icon { color: var(--accent); background: var(--accent-soft); border-color: var(--accent-line); }
.tab-text { display: grid; min-width: 0; }
.tab-title { font-weight: 550; font-size: 0.94rem; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tab-sub { font-size: 0.8rem; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tab:not(.active) .tab-title { color: var(--text-muted); }
.panels { margin-top: 16px; }
.ownership { font-size: 0.84rem; color: var(--text-faint); max-width: 60ch; }

@media (max-width: 960px) {
  .tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 520px) {
  .tabs { grid-template-columns: 1fr 1fr; }
  .tab { padding: 10px; gap: 10px; }
  .tab-icon { width: 32px; height: 32px; }
  .tab-sub { display: none; }
  .tab-title { white-space: normal; font-size: 0.86rem; line-height: 1.25; }
}
</style>

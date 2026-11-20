<script setup>
import { Code, Server, Sparkles, Layers, Database, Wrench } from 'lucide-vue-next'
import { skillGroups } from '../content/skills.js'

const icons = [Server, Code, Sparkles, Layers, Database, Wrench]
</script>

<template>
  <section id="expertise" class="section" aria-labelledby="expertise-title">
    <div class="container">
      <div v-reveal class="section-head center">
        <p class="eyebrow"><Code :size="14" aria-hidden="true" /> Expertise</p>
        <h2 id="expertise-title">The stack I work with.</h2>
        <p class="lead">Grouped by area, and marked by where I’ve used each one.</p>
        <ul class="legend" aria-label="Legend">
          <li><span class="sw work" aria-hidden="true"></span>Used at work</li>
          <li><span class="sw personal" aria-hidden="true"></span>Personal projects</li>
        </ul>
      </div>
      <div class="grid">
        <div v-for="(g, i) in skillGroups" :key="g.title" v-reveal="(i % 3) * 60" class="card group">
          <div class="group-head">
            <span class="g-icon"><component :is="icons[i % icons.length]" :size="17" aria-hidden="true" /></span>
            <h3>{{ g.title }}</h3>
          </div>
          <ul class="skills">
            <li v-for="s in g.skills" :key="s.name" :class="['skill', s.level]">
              <span class="sw" :class="s.level" aria-hidden="true"></span>
              {{ s.name }}
              <span class="sr-only">({{ s.level === 'work' ? 'used at work' : 'personal projects' }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; font-size: 0.86rem; color: var(--text-muted); }
.legend li { display: inline-flex; align-items: center; gap: 8px; }
.sw { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.sw.work { background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.sw.personal { background: var(--info); box-shadow: 0 0 0 3px var(--info-soft); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.group { padding: 24px; }
.group-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.g-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
}
h3 { font-size: 1.02rem; font-weight: 600; letter-spacing: -0.02em; }
.skills { display: flex; flex-wrap: wrap; gap: 8px; }
.skill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 11px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  font-size: 0.86rem;
}
.skill.personal { color: var(--text-muted); }
@media (max-width: 960px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .grid { grid-template-columns: 1fr; } }
</style>

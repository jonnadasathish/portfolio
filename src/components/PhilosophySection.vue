<script setup>
import { Search, ShieldCheck, Gauge, Sparkles, Workflow, TriangleAlert, Compass, BookOpen } from 'lucide-vue-next'
import { principles, learning } from '../content/principles.js'

const icons = [Search, ShieldCheck, Gauge, Sparkles, Workflow, TriangleAlert]
</script>

<template>
  <section id="approach" class="section" aria-labelledby="approach-title">
    <div class="container">
      <div v-reveal class="section-head center">
        <p class="eyebrow"><Compass :size="14" aria-hidden="true" /> Approach</p>
        <h2 id="approach-title">How I build software.</h2>
      </div>
      <ul class="principles">
        <li v-for="(p, i) in principles" :key="p.title" v-reveal="(i % 3) * 60" class="card principle">
          <span class="p-icon"><component :is="icons[i]" :size="18" aria-hidden="true" /></span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </li>
      </ul>

      <div class="learning card">
        <div class="learn-head">
          <span class="p-icon"><BookOpen :size="18" aria-hidden="true" /></span>
          <div>
            <h3 class="learn-title">Currently learning</h3>
            <p class="muted">Areas of active study, not claims of production experience.</p>
          </div>
        </div>
        <ul class="learn-grid">
          <li v-for="l in learning" :key="l.title" class="learn">
            <h4>{{ l.title }}</h4>
            <p>{{ l.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.principles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.principle { padding: 26px; display: grid; gap: 10px; align-content: start; transition: border-color 0.3s var(--ease), transform 0.3s var(--ease); }
.principle:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.p-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 6px;
}
.principle h3 { font-size: 1.08rem; letter-spacing: -0.02em; }
.principle p { color: var(--text-muted); font-size: 0.94rem; }

.learning { margin-top: 16px; padding: clamp(24px, 3.4vw, 36px); }
.learn-head { display: flex; gap: 16px; align-items: flex-start; }
.learn-head .p-icon { margin-bottom: 0; flex: none; }
.learn-title { font-size: 1.15rem; letter-spacing: -0.02em; }
.learn-head .muted { font-size: 0.92rem; margin-top: 2px; }
.learn-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 32px; margin-top: 28px; }
.learn { padding-top: 16px; border-top: 1px solid var(--border); }
.learn h4 { font-size: 0.98rem; font-weight: 600; letter-spacing: -0.01em; }
.learn p { margin-top: 6px; color: var(--text-muted); font-size: 0.9rem; }
@media (max-width: 960px) {
  .principles, .learn-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .principles, .learn-grid { grid-template-columns: 1fr; }
}
</style>

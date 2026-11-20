<script setup>
import { Gauge } from 'lucide-vue-next'
import { impact, impactNote } from '../content/impact.js'
</script>

<template>
  <section id="impact" class="section" aria-labelledby="impact-title">
    <div class="container">
      <div v-reveal class="section-head center">
        <p class="eyebrow"><Gauge :size="14" aria-hidden="true" /> Impact</p>
        <h2 id="impact-title">Results you can check.</h2>
        <p class="lead">Every number below comes from the code, the test suites or recorded evaluation runs.</p>
      </div>
      <ul v-reveal class="band card">
        <li v-for="item in impact" :key="item.label" class="metric">
          <p class="value">{{ item.value }}</p>
          <p class="name">{{ item.label }}</p>
          <p class="detail">{{ item.detail }}</p>
        </li>
      </ul>
      <p class="note">{{ impactNote }}</p>
    </div>
  </section>
</template>

<style scoped>
.band {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  overflow: hidden;
}
.metric {
  padding: clamp(22px, 2.6vw, 32px);
  display: grid;
  gap: 6px;
  align-content: start;
  border-left: 1px solid var(--border);
}
.metric:first-child { border-left: 0; }
.value {
  font-size: clamp(2.1rem, 3.4vw, 2.8rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  justify-self: start;
}
.name { font-weight: 550; letter-spacing: -0.01em; }
.detail { margin-top: 4px; color: var(--text-muted); font-size: 0.88rem; line-height: 1.55; }
.note { margin-top: 18px; text-align: center; color: var(--text-faint); font-size: 0.82rem; }
@media (max-width: 1000px) {
  .band { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .metric { border-left: 0; border-top: 1px solid var(--border); }
  .metric:nth-child(-n + 2) { border-top: 0; }
  .metric:nth-child(even) { border-left: 1px solid var(--border); }
  .metric:last-child { grid-column: 1 / -1; border-left: 0; }
}
@media (max-width: 560px) {
  .band { grid-template-columns: 1fr; }
  .metric, .metric:nth-child(even) { border-left: 0; }
  .metric:nth-child(2) { border-top: 1px solid var(--border); }
}
</style>

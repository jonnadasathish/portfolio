<script setup>
import { computed } from 'vue'
import { ArrowRight, Briefcase } from 'lucide-vue-next'
import { diagrams } from './diagrams/index.js'

const props = defineProps({
  project: { type: Object, required: true },
})
const diagram = computed(() => diagrams[props.project.diagram])
const headingId = computed(() => `project-${props.project.slug}`)
</script>

<template>
  <article class="project card" :aria-labelledby="headingId">
    <div class="body">
      <div class="text">
        <header class="head">
          <span class="context"><Briefcase :size="14" aria-hidden="true" />{{ project.context }}</span>
          <h3 :id="headingId">{{ project.title }}</h3>
          <p class="summary">{{ project.summary }}</p>
          <p class="role"><span class="role-label">My role</span>{{ project.role }}</p>
        </header>

        <dl class="pq">
          <div>
            <dt class="label">The problem</dt>
            <dd>{{ project.problem }}</dd>
          </div>
          <div>
            <dt class="label">The approach</dt>
            <dd>{{ project.approach }}</dd>
          </div>
        </dl>

        <div>
          <h4 class="label mini">What I built</h4>
          <ul class="checks">
            <li v-for="c in project.contributions.slice(0, 3)" :key="c">{{ c }}</li>
          </ul>
        </div>

        <ul class="chips" aria-label="Technology stack">
          <li v-for="t in project.stack" :key="t" class="chip">{{ t }}</li>
        </ul>

        <RouterLink :to="{ name: 'project', params: { slug: project.slug } }" class="btn btn-primary case-link">
          Read the case study <ArrowRight :size="17" aria-hidden="true" />
          <span class="sr-only">: {{ project.title }}</span>
        </RouterLink>
      </div>

      <div class="visual">
        <component :is="diagram" compact />
        <ul class="metrics" aria-label="Impact">
          <li v-for="m in project.impact" :key="m.label">
            <span class="m-value">{{ m.value }}</span>
            <span class="m-label">{{ m.label }}</span>
          </li>
        </ul>
        <div class="challenge">
          <p class="label">Key challenge</p>
          <p><strong>{{ project.challenges[0].title }}.</strong> {{ project.challenges[0].body }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project { padding: clamp(22px, 3.4vw, 44px); }
.project:focus-visible { outline-offset: 4px; }
.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: clamp(28px, 4vw, 56px);
}
.text { display: grid; gap: 26px; align-content: start; }
.head { display: grid; gap: 12px; }
.context { display: inline-flex; align-items: center; gap: 7px; font-size: 0.8rem; color: var(--text-faint); }
h3 { font-size: clamp(1.7rem, 3vw, 2.3rem); letter-spacing: -0.04em; }
.summary { color: var(--text-muted); font-size: 1.04rem; }
.role { display: grid; gap: 4px; padding: 12px 14px; border-radius: var(--radius); border: 1px solid var(--accent-line); background: var(--accent-soft); font-size: 0.92rem; color: var(--text); }
.role-label { font-size: 0.74rem; font-weight: 600; color: var(--accent); }
.pq { display: grid; gap: 18px; }
.pq dt, .mini { margin-bottom: 6px; }
.pq dd { color: var(--text-muted); }
.case-link { justify-self: start; }
.visual { display: grid; gap: 14px; align-content: start; }
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
.metrics li {
  display: grid;
  gap: 4px;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-2);
  box-shadow: var(--highlight);
}
.m-value {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  justify-self: start;
}
.m-label { font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; }
.challenge {
  padding: 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-raised);
  display: grid;
  gap: 6px;
}
.challenge p:not(.label) { color: var(--text-muted); font-size: 0.94rem; }
.challenge strong { color: var(--text); font-weight: 600; }
@media (max-width: 1000px) {
  .body { grid-template-columns: 1fr; }
}
</style>

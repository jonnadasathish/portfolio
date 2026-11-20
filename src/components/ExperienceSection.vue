<script setup>
import { MapPin, Briefcase, GraduationCap } from 'lucide-vue-next'
import { experience, education } from '../content/experience.js'
</script>

<template>
  <section id="experience" class="section" aria-labelledby="experience-title">
    <div class="container">
      <div v-reveal class="section-head center">
        <p class="eyebrow"><Briefcase :size="14" aria-hidden="true" /> Experience</p>
        <h2 id="experience-title">From production fixes to platform architecture.</h2>
      </div>

      <div class="layout">
        <article v-reveal class="card role">
          <header class="role-head">
            <span class="logo" aria-hidden="true">CT</span>
            <div class="role-id">
              <h3>{{ experience.company }}</h3>
              <p class="role-title">{{ experience.role }}</p>
            </div>
            <div class="role-meta">
              <span>{{ experience.period }}</span>
              <span class="loc"><MapPin :size="13" aria-hidden="true" />{{ experience.location }}</span>
            </div>
          </header>
          <p class="role-summary">{{ experience.summary }}</p>

          <ol class="timeline">
            <li v-for="m in experience.milestones" :key="m.title">
              <span class="dot" aria-hidden="true"></span>
              <div class="entry">
                <p class="period">{{ m.period }}</p>
                <h4>{{ m.title }}</h4>
                <p class="body">{{ m.body }}</p>
              </div>
            </li>
          </ol>
        </article>

        <aside class="side">
          <article v-reveal="80" class="card edu" aria-label="Education">
            <span class="side-icon"><GraduationCap :size="18" aria-hidden="true" /></span>
            <p class="label">Education</p>
            <h3 class="edu-degree">{{ education.degree }}</h3>
            <p class="muted small">{{ education.college }}</p>
            <p class="muted small">{{ education.university }}</p>
            <div class="edu-meta">
              <span class="chip">{{ education.period }}</span>
              <span class="chip">{{ education.grade }}</span>
            </div>
          </article>
          <article v-reveal="140" class="card focus-card">
            <p class="label">Focus areas</p>
            <ul class="chips">
              <li v-for="f in experience.focus" :key="f" class="chip">{{ f }}</li>
            </ul>
          </article>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 16px; align-items: start; }
.role { padding: clamp(24px, 3.4vw, 40px); }
.role-head { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.logo {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--surface-3);
  border: 1px solid var(--border-strong);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text);
}
.role-id { flex: 1; min-width: 180px; }
h3 { font-size: 1.3rem; letter-spacing: -0.03em; }
.role-title { color: var(--text-muted); margin-top: 2px; }
.role-meta { display: grid; gap: 4px; justify-items: end; color: var(--text-faint); font-size: 0.85rem; }
.loc { display: inline-flex; align-items: center; gap: 5px; }
.role-summary { margin-top: 20px; color: var(--text-muted); }
.timeline { margin-top: 28px; position: relative; display: grid; gap: 4px; }
.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(var(--border-strong), var(--accent-line));
}
.timeline li { position: relative; display: grid; grid-template-columns: 14px 1fr; gap: 20px; padding: 10px 0; }
.dot { width: 14px; height: 14px; margin-top: 4px; border-radius: 50%; background: var(--surface); border: 2px solid var(--border-strong); position: relative; z-index: 1; }
.timeline li:last-child .dot { border-color: var(--accent); background: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.period { font-size: 0.8rem; color: var(--text-faint); }
h4 { font-size: 1.02rem; font-weight: 600; letter-spacing: -0.02em; margin-top: 2px; }
.body { margin-top: 6px; color: var(--text-muted); font-size: 0.95rem; }
.side { display: grid; gap: 16px; }
.edu, .focus-card { padding: 24px; display: grid; gap: 8px; justify-items: start; }
.side-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; background: var(--accent-soft); color: var(--accent); margin-bottom: 6px; }
.edu-degree { font-size: 1.08rem; line-height: 1.3; }
.small { font-size: 0.9rem; }
.edu-meta { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
@media (max-width: 960px) { .layout { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .role-meta { justify-items: start; } }
</style>

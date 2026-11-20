<script setup>
import { computed } from 'vue'
import { ArrowLeft, ArrowRight, Briefcase } from 'lucide-vue-next'
import { projects, getProject, ownershipNote } from '../content/projects.js'
import { diagrams } from '../components/diagrams/index.js'
import { scrollToSection } from '../composables/scrollToSection.js'

const props = defineProps({ slug: { type: String, required: true } })

const project = computed(() => getProject(props.slug))
const cs = computed(() => project.value.caseStudy)
const diagram = computed(() => diagrams[project.value.diagram])
const next = computed(() => {
  const i = projects.findIndex((p) => p.slug === props.slug)
  return projects[(i + 1) % projects.length]
})

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'situation', label: 'Starting point' },
  { id: 'solution', label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Technology decisions' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'challenges', label: 'Challenges & trade-offs' },
  { id: 'contributions', label: 'My contributions' },
  { id: 'results', label: 'Results' },
  { id: 'learned', label: 'What I learned' },
]

function jump(id) {
  history.replaceState(history.state, '', `#${id}`)
  scrollToSection(id)
}
</script>

<template>
  <article v-if="project" :key="project.slug" class="case">
    <header class="case-hero">
      <div class="container">
        <RouterLink :to="{ path: '/', hash: '#work' }" class="back text-link">
          <ArrowLeft :size="16" aria-hidden="true" /> All projects
        </RouterLink>
        <p class="eyebrow">Case study · {{ project.eyebrow }}</p>
        <h1>{{ project.title }}</h1>
        <p class="lead">{{ project.summary }}</p>
        <div class="meta">
          <span class="context"><Briefcase :size="14" aria-hidden="true" />{{ project.context }}</span>
          <ul class="chips" aria-label="Technology stack">
            <li v-for="t in project.stack" :key="t" class="chip">{{ t }}</li>
          </ul>
        </div>
        <p class="role"><span class="role-label">My role</span>{{ project.role }}</p>
        <p class="ownership">{{ ownershipNote }}</p>
        <ul class="impact" aria-label="Impact">
          <li v-for="m in project.impact" :key="m.label">
            <span class="v">{{ m.value }}</span><span class="l">{{ m.label }}</span>
          </li>
        </ul>
      </div>
    </header>

    <div class="container layout">
      <nav class="toc" aria-label="On this page">
        <p class="dg-label">On this page</p>
        <ol>
          <li v-for="t in toc" :key="t.id">
            <a :href="`#${t.id}`" @click.prevent="jump(t.id)">{{ t.label }}</a>
          </li>
        </ol>
      </nav>

      <div class="content">
        <section id="overview" class="block">
          <h2>Overview</h2>
          <p>{{ cs.overview }}</p>
        </section>

        <section id="problem" class="block">
          <h2>Problem</h2>
          <p>{{ project.problem }}</p>
        </section>

        <section id="situation" class="block">
          <h2>Starting point</h2>
          <ul class="checks">
            <li v-for="s in cs.situation" :key="s">{{ s }}</li>
          </ul>
        </section>

        <section id="solution" class="block">
          <h2>Solution</h2>
          <p class="approach">{{ project.approach }}</p>
          <ol class="numbered">
            <li v-for="s in cs.solution" :key="s">{{ s }}</li>
          </ol>
        </section>

        <section id="architecture" class="block">
          <h2>Architecture</h2>
          <component :is="diagram" />
        </section>

        <section id="decisions" class="block">
          <h2>Technology decisions</h2>
          <div class="decisions">
            <div v-for="d in cs.decisions" :key="d.decision" class="decision">
              <h3>{{ d.decision }}</h3>
              <p>{{ d.why }}</p>
            </div>
          </div>
        </section>

        <section id="implementation" class="block">
          <h2>Implementation details</h2>
          <ul class="checks">
            <li v-for="s in cs.implementation" :key="s">{{ s }}</li>
          </ul>
        </section>

        <section id="challenges" class="block">
          <h2>Challenges &amp; trade-offs</h2>
          <div class="challenges">
            <div v-for="c in project.challenges" :key="c.title" class="challenge card">
              <h3>{{ c.title }}</h3>
              <p>{{ c.body }}</p>
            </div>
          </div>
          <h3 class="sub">Trade-offs and open items</h3>
          <ul class="checks tradeoffs">
            <li v-for="t in cs.tradeoffs" :key="t">{{ t }}</li>
          </ul>
        </section>

        <section id="contributions" class="block">
          <h2>My contributions</h2>
          <ul class="checks">
            <li v-for="c in project.contributions" :key="c">{{ c }}</li>
          </ul>
        </section>

        <section id="results" class="block">
          <h2>Results &amp; impact</h2>
          <ul class="checks">
            <li v-for="r in cs.results" :key="r">{{ r }}</li>
          </ul>
        </section>

        <section id="learned" class="block">
          <h2>What I learned</h2>
          <ul class="learned">
            <li v-for="l in cs.learned" :key="l">{{ l }}</li>
          </ul>
        </section>

        <RouterLink :to="{ name: 'project', params: { slug: next.slug } }" class="next card">
          <span class="dg-label">Next case study</span>
          <span class="next-title">{{ next.title }} <ArrowRight :size="20" aria-hidden="true" /></span>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.case-hero {
  padding-block: calc(64px + clamp(28px, 5vw, 56px)) clamp(36px, 5vw, 56px);
  border-bottom: 1px solid var(--border);
  background: radial-gradient(50% 70% at 85% 0%, var(--glow), transparent 70%);
}
.case-hero .container { display: grid; gap: 16px; }
.back { justify-self: start; margin-bottom: 12px; }
.case-hero .eyebrow, .role, .ownership { justify-self: start; }
h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); letter-spacing: -0.035em; max-width: 20ch; }
.context { display: inline-flex; align-items: center; gap: 7px; font-size: 0.84rem; color: var(--text-muted); }
.role { display: grid; gap: 4px; max-width: 70ch; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--accent-line); background: var(--accent-soft); font-size: 0.95rem; }
.role-label { font-size: 0.76rem; font-weight: 600; color: var(--accent); }
.ownership { font-size: 0.86rem; color: var(--text-faint); max-width: 70ch; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; margin-top: 4px; }
.impact { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-top: 16px; }
.impact li { display: grid; gap: 4px; padding: 16px 18px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.impact .v { font-size: 1.6rem; font-weight: 680; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.impact .l { color: var(--text-muted); font-size: 0.84rem; }

.layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  padding-block: clamp(40px, 6vw, 72px);
}
.toc { position: sticky; top: calc(var(--header-h) + 24px); align-self: start; }
.toc ol { display: grid; gap: 2px; border-left: 1px solid var(--border); }
.toc a {
  display: block;
  padding: 6px 0 6px 14px;
  margin-left: -1px;
  border-left: 1px solid transparent;
  color: var(--text-muted);
  font-size: 0.88rem;
  transition: color 0.2s var(--ease), border-color 0.2s var(--ease);
}
.toc a:hover { color: var(--text); border-left-color: var(--accent); }

.content { display: grid; gap: clamp(40px, 5vw, 56px); max-width: 820px; }
.block { display: grid; gap: 16px; }
.block h2 { font-size: clamp(1.35rem, 2.2vw, 1.7rem); }
.block > p { color: var(--text-muted); font-size: 1.05rem; }
.approach { color: var(--text); font-size: 1.05rem; }
.numbered { counter-reset: n; display: grid; gap: 14px; }
.numbered li { counter-increment: n; position: relative; padding-left: 40px; color: var(--text-muted); }
.numbered li::before {
  content: counter(n, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 2px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--accent);
}
.decisions { display: grid; border-top: 1px solid var(--border); }
.decision { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--border); }
.decision h3 { font-size: 1rem; font-weight: 620; }
.decision p { color: var(--text-muted); font-size: 0.95rem; }
.challenges { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.challenge { padding: 20px; box-shadow: none; }
.challenge h3 { font-size: 1rem; margin-bottom: 8px; }
.challenge p { color: var(--text-muted); font-size: 0.92rem; }
.sub { font-size: 1rem; margin-top: 12px; }
.learned { display: grid; gap: 12px; }
.learned li {
  padding: 16px 20px;
  border-left: 2px solid var(--accent);
  background: var(--surface);
  border-radius: 0 var(--radius) var(--radius) 0;
  font-size: 1.02rem;
}
.next {
  display: grid;
  gap: 6px;
  padding: 24px 28px;
  margin-top: 16px;
  transition: border-color 0.2s var(--ease);
}
.next:hover { border-color: var(--accent-line); }
.next-title { display: inline-flex; align-items: center; gap: 10px; font-size: 1.4rem; font-weight: 640; letter-spacing: -0.02em; }

@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .toc { display: none; }
}
@media (max-width: 640px) {
  .decision { grid-template-columns: 1fr; gap: 6px; }
}
</style>

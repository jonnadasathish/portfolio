<script setup>
import { ArrowRight, Download, FileText, Mail, MapPin, GraduationCap, Briefcase, Code, BookOpen } from 'lucide-vue-next'
import { profile, resumeLink } from '../content/profile.js'
import { useSectionNav } from '../composables/useSectionNav.js'
import BrandIcon from './BrandIcon.vue'
import HeroArchitecture from './HeroArchitecture.vue'

const { goTo } = useSectionNav()
const resume = resumeLink()

const facts = [
  { icon: Briefcase, k: 'Role', v: `${profile.role} at ${profile.company}` },
  { icon: GraduationCap, k: 'Education', v: 'B.Tech, Electronics & Communication, 2024' },
  { icon: Code, k: 'Focus', v: 'Backend, APIs and AI engineering' },
  { icon: BookOpen, k: 'Learning', v: 'Python, FastAPI and system design' },
]
const builtWith = ['Vue 3', 'REST APIs', 'JWT', 'Redis', 'MySQL', 'MongoDB', 'Gemini & OpenAI', 'MCP']
</script>

<template>
  <section id="about" class="intro" aria-labelledby="about-title">
    <div class="backdrop" aria-hidden="true"></div>

    <div class="container hero">
      <p class="who">
        <span class="avatar">
          <img v-if="profile.photo" :src="profile.photo" :alt="`Portrait of ${profile.name}`" width="64" height="64" />
          <span v-else aria-hidden="true">{{ profile.initials }}</span>
        </span>
        <span><strong>{{ profile.name }}</strong><span class="sep" aria-hidden="true"></span><span class="role-long">{{ profile.role }} at {{ profile.company }}</span><span class="role-short">Engineer, {{ profile.company }}</span></span>
      </p>

      <h1 id="about-title">
        Hi, I’m Satish.
        <span class="grad-text">I build reliable backends and bring AI into real products.</span>
      </h1>

      <p class="lead sub">
        At CarTrade Tech I re-architected a legacy dealer platform into a 350+ endpoint API and a Vue 3 app,
        then independently built the AI assistant and MCP server that run on top of it.
      </p>

      <div class="cta-row">
        <a href="/#work" class="btn btn-primary" @click.prevent="goTo('work')">
          Explore my work <ArrowRight :size="17" aria-hidden="true" />
        </a>
        <a class="btn" :href="resume.href" :download="resume.download ? '' : undefined">
          <Download v-if="resume.download" :size="17" aria-hidden="true" />
          <FileText v-else :size="17" aria-hidden="true" />
          {{ resume.label }}
        </a>
      </div>

      <ul class="socials" aria-label="Profiles">
        <li>
          <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">
            <BrandIcon name="linkedin" :size="15" /> LinkedIn<span class="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a :href="profile.github" target="_blank" rel="noopener noreferrer">
            <BrandIcon name="github" :size="15" /> GitHub<span class="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a :href="`mailto:${profile.email}`"><Mail :size="15" aria-hidden="true" /> Email</a>
        </li>
      </ul>
    </div>

    <div class="container window-wrap">
      <div class="window grad-border">
        <HeroArchitecture />
      </div>
      <ul class="built" aria-label="Technologies in this system">
        <li v-for="t in builtWith" :key="t">{{ t }}</li>
      </ul>
    </div>

    <div class="container story">
      <div class="story-head">
        <p class="eyebrow">A bit about me</p>
        <h2>From electronics to backend systems.</h2>
        <p class="place"><MapPin :size="15" aria-hidden="true" /> {{ profile.location }}, IST (UTC+5:30)</p>
      </div>
      <div class="story-body">
        <p>
          I studied Electronics and Communication Engineering and found my place in software, specifically in the
          backend, where a business’s rules, data and integrations live.
        </p>
        <p>
          Since 2025 I’ve worked at CarTrade Tech on the platform dealerships use to run their inventory, leads and
          marketplace listings. I started by fixing and extending it, then re-architected it into a versioned API
          and a Vue 3 app, and then designed and built, on my own, the LLM assistant and MCP server that connect it to AI.
        </p>
        <p>
          I like to understand how a system really behaves before I change it. Right now I’m going deeper into
          Python, FastAPI, system design and AI agents. I use AI coding tools every day and review everything they
          produce.
        </p>
        <dl class="facts">
          <div v-for="f in facts" :key="f.k" class="fact">
            <component :is="f.icon" :size="17" class="fact-icon" aria-hidden="true" />
            <div>
              <dt>{{ f.k }}</dt>
              <dd>{{ f.v }}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro { position: relative; overflow: hidden; padding-bottom: clamp(80px, 10vw, 128px); }
.backdrop {
  position: absolute;
  inset: -80px 0 auto 0;
  height: 900px;
  background:
    radial-gradient(40% 50% at 50% 30%, var(--glow), transparent 70%),
    radial-gradient(25% 35% at 72% 18%, var(--glow-2), transparent 70%),
    radial-gradient(25% 35% at 28% 22%, var(--glow-2), transparent 70%);
  pointer-events: none;
}
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(60% 55% at 50% 30%, #000, transparent 75%);
  -webkit-mask-image: radial-gradient(60% 55% at 50% 30%, #000, transparent 75%);
}

.hero {
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
  padding-top: calc(64px + clamp(56px, 8vw, 104px));
}
.who {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  box-shadow: var(--highlight);
  font-size: 0.86rem;
  color: var(--text-muted);
  text-align: left;
}
.who strong { color: var(--text); font-weight: 550; }
.role-short { display: none; }
.sep { display: inline-block; width: 1px; height: 12px; margin: 0 10px; background: var(--border-strong); vertical-align: -1px; }
.avatar {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--grad);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }

h1 {
  margin-top: 28px;
  max-width: 21ch;
  font-size: clamp(2.5rem, 6.2vw, 4.6rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 1.02;
}
h1 .grad-text { display: block; }
.sub { margin-top: 24px; max-width: 56ch; }
.cta-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 34px; }
.socials { display: flex; flex-wrap: wrap; justify-content: center; gap: 22px; margin-top: 26px; }
.socials a { display: inline-flex; align-items: center; gap: 7px; color: var(--text-faint); font-size: 0.9rem; transition: color 0.2s var(--ease); }
.socials a:hover { color: var(--text); }

.window-wrap { position: relative; margin-top: clamp(56px, 8vw, 88px); }
.window {
  position: relative;
  max-width: 920px;
  margin-inline: auto;
  border-radius: 22px;
  padding: 8px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  box-shadow: var(--shadow-lg);
}
.built {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 34px;
  margin-top: 40px;
  color: var(--text-faint);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.story {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(32px, 6vw, 88px);
  margin-top: clamp(88px, 11vw, 136px);
}
.story-head { display: grid; gap: 16px; align-content: start; justify-items: start; }
.story-head h2 { font-size: clamp(1.9rem, 3.6vw, 2.7rem); letter-spacing: -0.04em; }
.place { display: inline-flex; align-items: center; gap: 8px; color: var(--text-faint); font-size: 0.9rem; }
.story-body { display: grid; gap: 18px; }
.story-body > p { color: var(--text-muted); font-size: 1.06rem; }
.story-body > p:first-child { color: var(--text); font-size: 1.16rem; }
.facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
.fact {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--highlight);
}
.fact-icon { color: var(--accent); flex: none; margin-top: 2px; }
dt { font-size: 0.78rem; color: var(--text-faint); }
dd { font-size: 0.94rem; font-weight: 500; letter-spacing: -0.01em; }

.hero > *, .window-wrap { animation: rise 0.9s var(--ease) both; }
.hero > :nth-child(2) { animation-delay: 0.05s; }
.hero > :nth-child(3) { animation-delay: 0.1s; }
.hero > :nth-child(4) { animation-delay: 0.15s; }
.hero > :nth-child(5) { animation-delay: 0.2s; }
.window-wrap { animation-delay: 0.28s; }
@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

@media (max-width: 900px) {
  .story { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .who { font-size: 0.78rem; }
  .role-long { display: none; }
  .role-short { display: inline !important; }
  .facts { grid-template-columns: 1fr; }
  .built { gap: 8px 20px; font-size: 0.85rem; }
}
</style>

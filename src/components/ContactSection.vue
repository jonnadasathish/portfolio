<script setup>
import { Copy, Check, Mail, Download, FileText, ArrowUpRight } from 'lucide-vue-next'
import { profile, resumeLink } from '../content/profile.js'
import { useCopy } from '../composables/useCopy.js'
import BrandIcon from './BrandIcon.vue'

const { copied, failed, copy } = useCopy()
const resume = resumeLink()
</script>

<template>
  <section id="contact" class="section contact" aria-labelledby="contact-title">
    <div class="container">
      <div v-reveal class="panel grad-border">
        <div class="glow" aria-hidden="true"></div>
        <h2 id="contact-title">Let’s build something reliable.</h2>
        <p class="lead">
          I enjoy problems where architecture, APIs and AI integration matter, whether the system is new or has
          been running for years. Email is the fastest way to reach me.
        </p>

        <div class="actions">
          <a class="btn btn-primary" :href="`mailto:${profile.email}`">
            <Mail :size="17" aria-hidden="true" /> {{ profile.email }}
          </a>
          <button type="button" class="btn" @click="copy(profile.email)">
            <Check v-if="copied" :size="17" aria-hidden="true" />
            <Copy v-else :size="17" aria-hidden="true" />
            {{ copied ? 'Copied' : 'Copy email' }}
          </button>
          <span class="sr-only" role="status" aria-live="polite">
            {{ copied ? 'Email address copied to clipboard' : failed ? 'Copy failed, please select the address manually' : '' }}
          </span>
        </div>
        <p v-if="failed" class="fail">Couldn’t copy automatically. Please select the address above.</p>

        <ul class="links">
          <li>
            <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">
              <BrandIcon name="linkedin" :size="16" /> LinkedIn <ArrowUpRight :size="15" aria-hidden="true" />
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a :href="profile.github" target="_blank" rel="noopener noreferrer">
              <BrandIcon name="github" :size="16" /> GitHub <ArrowUpRight :size="15" aria-hidden="true" />
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a :href="resume.href" :download="resume.download ? '' : undefined">
              <Download v-if="resume.download" :size="16" aria-hidden="true" />
              <FileText v-else :size="16" aria-hidden="true" />
              {{ resume.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  overflow: hidden;
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 18px;
  padding: clamp(40px, 7vw, 88px) clamp(20px, 5vw, 64px);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}
.glow {
  position: absolute;
  inset: auto 10% -60% 10%;
  height: 120%;
  background: radial-gradient(50% 50% at 50% 50%, var(--glow), transparent 70%);
  pointer-events: none;
}
h2 { position: relative; font-size: clamp(2.1rem, 4.6vw, 3.4rem); letter-spacing: -0.05em; max-width: 16ch; }
.lead { position: relative; margin-inline: auto; }
.actions { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 12px; }
.actions .btn-primary { word-break: break-all; white-space: normal; text-align: left; }
.fail { color: var(--text-muted); font-size: 0.85rem; }
.links { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 26px; margin-top: 10px; }
.links a { display: inline-flex; align-items: center; gap: 7px; color: var(--text-muted); font-size: 0.92rem; transition: color 0.2s var(--ease); }
.links a:hover { color: var(--text); }
</style>

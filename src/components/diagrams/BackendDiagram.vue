<script setup>
import { useId } from 'vue'

defineProps({ compact: Boolean })
const captionId = `${useId()}-cap`

const gateway = ['Validate path', 'Route lookup', 'Fail-fast connections', 'Verify token', 'Check rights', 'Handler', 'JSON envelope']
const publishing = ['Dealer edits listing', 'Diff tracked fields', 'Queue action', 'Partner API', 'Audit log']
</script>

<template>
  <figure class="dg-frame backend" :aria-labelledby="captionId">
    <div class="lane">
      <p class="dg-label">API request lifecycle</p>
      <ol class="flow">
        <li v-for="(s, i) in gateway" :key="s" :class="{ core: i === 3 || i === 4 }">{{ s }}</li>
      </ol>
    </div>
    <div class="lane">
      <p class="dg-label">Marketplace publishing</p>
      <ol class="flow">
        <li v-for="(s, i) in publishing" :key="s" :class="{ core: i === 1 }">{{ s }}</li>
      </ol>
      <p v-if="!compact" class="skip">Unchanged listings are skipped at the diff step, no third-party call is made.</p>
    </div>
    <figcaption :id="captionId" class="dg-caption">
      Two recurring patterns: every API request passes the same checks in the same order, and marketplace updates are
      published only when a tracked field actually changed.
    </figcaption>
  </figure>
</template>

<style scoped>
.lane + .lane { margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--border); }
.flow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 26px; }
.flow li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 9px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  font-size: 0.8rem;
}
.flow li.core { border-color: var(--accent-line); color: var(--accent); background: linear-gradient(var(--accent-soft), var(--accent-soft)), var(--surface); }
.flow li { position: relative; }
.flow li:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -19px;
  color: var(--accent);
  font-size: 0.85rem;
}
.skip { margin-top: 12px; font-size: 0.78rem; color: var(--text-muted); }
</style>

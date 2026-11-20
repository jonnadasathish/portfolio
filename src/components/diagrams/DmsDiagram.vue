<script setup>
import { useId } from 'vue'
import DgArrow from './DgArrow.vue'

defineProps({ compact: Boolean })
const captionId = `${useId()}-cap`
const legacyConcerns = ['HTML template', 'SQL queries', 'Permission checks', 'Business rules', 'Session state']
</script>

<template>
  <figure class="dg-frame dms" :class="{ compact }" :aria-labelledby="captionId">
    <div class="cols">
      <div class="col">
        <p class="dg-label">Before: server-rendered</p>
        <div class="page">
          <div class="page-head"><strong>One page script</strong><span class="mono">× hundreds</span></div>
          <ul>
            <li v-for="c in legacyConcerns" :key="c"><span class="tick" aria-hidden="true"></span>{{ c }}</li>
          </ul>
        </div>
        <p class="note">Every page owns its markup, queries, permissions and rules.</p>
      </div>

      <div class="shift"><DgArrow /></div>

      <div class="col">
        <p class="dg-label">After: decoupled</p>
        <div class="row clients">
          <div class="dg-node"><strong>Vue 3 SPA</strong><span>web client</span></div>
          <div class="dg-node"><strong>AI assistant</strong><span>via MCP</span></div>
          <div v-if="!compact" class="dg-node is-muted"><strong>Legacy UI</strong><span>toggle</span></div>
        </div>
        <DgArrow label="JSON · bearer token" />
        <div class="dg-node is-core"><strong>API gateway</strong><span>versioned · route registry</span></div>
        <DgArrow />
        <div class="dg-node"><strong>Auth &amp; rights</strong><span>JWT · rotating refresh · module checks</span></div>
        <template v-if="!compact">
          <DgArrow />
          <div class="dg-node"><strong>Relocated business rules</strong><span>behaviour unchanged</span></div>
        </template>
        <DgArrow />
        <div class="row">
          <div class="dg-node"><strong>MySQL</strong><span>data</span></div>
          <div class="dg-node"><strong>Redis</strong><span>tokens · cache</span></div>
        </div>
      </div>
    </div>
    <figcaption :id="captionId" class="dg-caption">
      Before and after: page scripts that mixed every concern became a layered system, clients, one API gateway,
      a shared auth and rights layer, and the original business rules relocated unchanged.
    </figcaption>
  </figure>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: 1fr auto 1.25fr; gap: 18px; align-items: center; }
.col { display: grid; align-content: start; }
.shift { display: grid; place-items: center; }
.shift :deep(svg) { transform: rotate(-90deg); }
.page { border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 0.86rem;
}
.page-head .mono { font-size: 0.72rem; color: var(--text-faint); }
.page ul { display: grid; gap: 1px; padding: 6px; }
.page li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.8rem;
}
.tick { width: 6px; height: 6px; border-radius: 2px; background: var(--text-faint); }
.note { margin-top: 10px; color: var(--text-faint); font-size: 0.78rem; }
.row { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 8px; }
.compact .note { display: none; }

@container (max-width: 440px) {
  .cols { grid-template-columns: 1fr; }
  .shift :deep(svg) { transform: none; }
}
@container (max-width: 360px) {
  .clients { grid-auto-flow: row; }
}
</style>

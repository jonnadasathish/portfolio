<script setup>
import { useId } from 'vue'
import DgArrow from './DgArrow.vue'

defineProps({ compact: Boolean })
const captionId = `${useId()}-cap`

const pipeline = [
  { title: 'AI clients', sub: 'In-app assistant · Claude Code · Cursor' },
  { title: 'MCP client', sub: 'JSON-RPC 2.0 over HTTP' },
  { title: 'MCP server', sub: 'tools · auth · limits', core: true },
  { title: 'Business API', sub: 'permissions enforced' },
  { title: 'Enterprise data', sub: 'behind the API' },
]
const protocol = ['initialize', 'tools/list', 'tools/call → preview', 'tools/call + confirm → result']
const guards = ['Origin check', 'Token verification', 'Live tool catalog', 'Rate limits', 'Masked audit log']
</script>

<template>
  <figure class="dg-frame mcp" :aria-labelledby="captionId">
    <div class="pipeline">
      <template v-for="(n, i) in pipeline" :key="n.title">
        <div class="dg-node" :class="{ 'is-core': n.core }"><strong>{{ n.title }}</strong><span>{{ n.sub }}</span></div>
        <DgArrow v-if="i < pipeline.length - 1" dir="auto" />
      </template>
    </div>

    <div class="lower">
      <div>
        <p class="dg-label">Protocol sequence</p>
        <ol class="seq">
          <li v-for="(p, i) in protocol" :key="p"><span class="mono">{{ i + 1 }}</span><code>{{ p }}</code></li>
        </ol>
      </div>
      <div v-if="!compact">
        <p class="dg-label">Inside the server</p>
        <ul class="chips">
          <li v-for="g in guards" :key="g" class="chip">{{ g }}</li>
        </ul>
      </div>
    </div>
    <figcaption :id="captionId" class="dg-caption">
      AI clients discover tools with tools/list and call them with tools/call. The server verifies the caller, checks
      the live catalog and rate limits, then calls the business API with a short-lived token, it never touches the
      database directly.
    </figcaption>
  </figure>
</template>

<style scoped>
.pipeline {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1.1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: 6px;
}
.pipeline :deep(.dg-arrow) { align-self: center; }
.lower {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}
.seq { display: grid; gap: 8px; }
.seq li { display: flex; align-items: center; gap: 10px; }
.seq .mono {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: 1px solid var(--border-strong);
  font-size: 0.68rem;
  color: var(--accent);
}
.seq code { font-size: 0.78rem; color: var(--text); }
@container (max-width: 700px) {
  .pipeline { grid-template-columns: 1fr; }
}
@container (max-width: 560px) {
  .lower { grid-template-columns: 1fr; }
}
</style>

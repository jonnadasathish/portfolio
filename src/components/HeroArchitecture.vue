<script setup>
import { useId } from 'vue'

const uid = useId()
const titleId = `${uid}-title`
const descId = `${uid}-desc`
const markerId = `${uid}-arrow`

// Layout in SVG units (viewBox 520 × 420). Mirrors the real system: clients, integration, API, data.
const nodes = [
  { x: 20, y: 20, w: 150, title: 'Dealer SPA', sub: 'Vue 3 · SPA' },
  { x: 185, y: 20, w: 150, title: 'Chat assistant', sub: 'agent loop · router' },
  { x: 350, y: 20, w: 150, title: 'External agents', sub: 'Claude Code · Cursor' },
  { x: 185, y: 130, w: 150, title: 'LLM providers', sub: 'Gemini · OpenAI', kind: 'muted' },
  { x: 350, y: 130, w: 150, title: 'MCP server', sub: 'JSON-RPC · tools', kind: 'core' },
  { x: 20, y: 240, w: 315, title: 'REST API gateway', sub: 'versioned · JWT · module rights', kind: 'core' },
  { x: 20, y: 350, w: 150, title: 'MySQL', sub: 'relational data' },
  { x: 185, y: 350, w: 150, title: 'Redis', sub: 'cache · counters' },
  { x: 350, y: 350, w: 150, title: 'MongoDB', sub: 'documents · logs' },
]

const edges = [
  'M95 76 V240', // SPA → API
  'M260 76 V130', // chat → LLM
  'M310 76 V100 H390 V130', // chat → MCP
  'M440 76 V130', // agents → MCP
  'M400 186 V268 H335', // MCP → API
  'M465 186 V350', // MCP → MongoDB
  'M95 296 V350', // API → MySQL
  'M260 296 V350', // API → Redis
]
</script>

<template>
  <figure class="hero-arch">
    <div class="arch-head">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="title">Simplified architecture (illustrative)</span>
      <span class="legend"><span class="legend-line" aria-hidden="true"></span>request flow</span>
    </div>
    <svg viewBox="0 0 520 420" role="img" :aria-labelledby="`${titleId} ${descId}`">
      <title :id="titleId">Simplified architecture of the platform I worked on</title>
      <desc :id="descId">
        The dealer SPA calls the REST API gateway. The chat assistant uses LLM providers and calls the MCP server,
        as do external AI agents. The MCP server calls the same REST API gateway. The API uses MySQL and Redis;
        the MCP server logs to MongoDB.
      </desc>
      <defs>
        <marker :id="markerId" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" class="arrow-head" />
        </marker>
      </defs>

      <g class="edges">
        <path v-for="(d, i) in edges" :key="`base-${i}`" :d="d" class="edge-base" />
        <path
          v-for="(d, i) in edges"
          :key="`flow-${i}`"
          :d="d"
          class="edge-flow dg-flow"
          :marker-end="`url(#${markerId})`"
          :style="{ animationDelay: `${i * -0.35}s` }"
        />
      </g>

      <g v-for="n in nodes" :key="n.title" :class="['node', n.kind && `is-${n.kind}`]">
        <rect :x="n.x" :y="n.y" :width="n.w" height="56" rx="10" />
        <text :x="n.x + 14" :y="n.y + 25" class="t-title">{{ n.title }}</text>
        <text :x="n.x + 14" :y="n.y + 43" class="t-sub">{{ n.sub }}</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.hero-arch {
  border: 1px solid var(--border);
  border-radius: 16px;
  background:
    radial-gradient(70% 60% at 50% 0%, var(--accent-soft), transparent 70%),
    var(--bg-raised);
  overflow: hidden;
}
.arch-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.78rem;
  color: var(--text-faint);
}
.title { font-weight: 500; color: var(--text-muted); }
.dots { display: inline-flex; gap: 6px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-3); }
.legend { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 0.72rem; }
.legend-line { width: 20px; height: 2px; border-radius: 2px; background: var(--grad); }
svg { width: 100%; height: auto; padding: 18px; }

.edge-base { fill: none; stroke: var(--border-strong); stroke-width: 1.5; }
.edge-flow { fill: none; stroke: var(--accent); stroke-width: 1.6; opacity: 0.9; }
.arrow-head { stroke: var(--accent); stroke-width: 1.6; }

.node rect { fill: var(--surface); stroke: var(--border-strong); stroke-width: 1; }
.node.is-core rect { stroke: var(--accent-line); stroke-width: 1.3; }
.node.is-muted rect { fill: transparent; stroke-dasharray: 3 4; }
.t-title { font-family: var(--font-sans); font-size: 14.5px; font-weight: 600; fill: var(--text); letter-spacing: -0.2px; }
.node.is-core .t-title { fill: var(--accent); }
.t-sub { font-family: var(--font-mono); font-size: 10.5px; fill: var(--text-muted); }

@media (max-width: 520px) {
  svg { padding: 8px; }
  .t-title { font-size: 17px; }
  .t-sub { display: none; }
  .legend { display: none; }
}
</style>

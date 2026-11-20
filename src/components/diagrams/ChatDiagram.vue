<script setup>
import { computed, useId } from 'vue'

const props = defineProps({ compact: Boolean })
const captionId = `${useId()}-cap`

const allSteps = [
  { title: 'User message', sub: 'English · Hindi · Hinglish', key: true },
  { title: 'Request gates', sub: 'auth · rate limit · token budget' },
  { title: 'Intent router', sub: 'rules → small model → clarify', key: true },
  { title: 'Agent loop', sub: 'LLM ⇄ tools · bounded steps', core: true, key: true },
  { title: 'MCP server', sub: 'tools/call · signed per call', key: true },
  { title: 'Business API', sub: 'same permissions as the app' },
  { title: 'Reply', sub: 'answer · confirm card · download', key: true },
]
const steps = computed(() => (props.compact ? allSteps.filter((s) => s.key) : allSteps))
const writePath = ['Model requests a change', 'Server returns a preview card', 'User clicks Confirm', 'Change applied exactly once']
</script>

<template>
  <figure class="dg-frame chat" :aria-labelledby="captionId">
    <div class="grid">
      <div>
        <p class="dg-label">Read path</p>
        <ol class="steps">
          <li v-for="(s, i) in steps" :key="s.title" class="dg-node" :class="{ 'is-core': s.core }">
            <span class="num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <strong>{{ s.title }}</strong>
            <span>{{ s.sub }}</span>
          </li>
        </ol>
      </div>
      <div class="side">
        <div class="write">
          <p class="dg-label">Write path</p>
          <ol>
            <li v-for="(w, i) in writePath" :key="w"><span class="wnum">{{ i + 1 }}</span>{{ w }}</li>
          </ol>
          <p class="hint">The confirmation token never reaches the model.</p>
        </div>
        <div v-if="!compact" class="guards">
          <p class="dg-label">Guards</p>
          <ul class="chips">
            <li class="chip">identity from token</li>
            <li class="chip">PII masking</li>
            <li class="chip">grounding check</li>
            <li class="chip">1 change per message</li>
            <li class="chip">provider failover</li>
          </ul>
        </div>
      </div>
    </div>
    <figcaption :id="captionId" class="dg-caption">
      Each message is gated, routed to one business domain, and handled by a tool-calling loop whose tools come from the
      MCP server. Changes always stop at a preview until the user confirms.
    </figcaption>
  </figure>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 22px; }
.steps { display: grid; gap: 10px; position: relative; }
.steps::before {
  content: '';
  position: absolute;
  left: 21px;
  top: 12px;
  bottom: 12px;
  border-left: 2px solid var(--accent-soft);
}
.steps .dg-node { padding-left: 44px; }
.num {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 27px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  color: var(--text-muted) !important;
  font-size: 0.66rem !important;
}
.side { display: grid; gap: 16px; align-content: start; }
.write {
  border: 1px solid var(--accent-line);
  border-radius: 12px;
  background: linear-gradient(var(--accent-soft), var(--accent-soft)), var(--surface);
  padding: 14px;
}
.write ol { display: grid; gap: 8px; }
.write li { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; color: var(--text); }
.wnum {
  flex: none;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--accent-line);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}
.hint { margin-top: 12px; font-size: 0.76rem; color: var(--text-muted); }
@container (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
}
</style>

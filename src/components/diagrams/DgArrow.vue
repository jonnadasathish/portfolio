<script setup>
// Connector between diagram nodes. dir="auto" points right on wide screens and down on narrow ones.
defineProps({
  dir: { type: String, default: 'down', validator: (v) => ['down', 'auto'].includes(v) },
  label: { type: String, default: '' },
})
</script>

<template>
  <div class="dg-arrow" :class="`is-${dir}`" aria-hidden="true">
    <svg viewBox="0 0 12 28" width="12" height="28">
      <path d="M6 0 V24" class="dg-flow" />
      <path d="M2 20 L6 25 L10 20" class="head" />
    </svg>
    <span v-if="label" class="dg-arrow-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.dg-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 28px;
}
svg path { fill: none; stroke: var(--accent); stroke-width: 1.5; }
svg .head { stroke-linecap: round; stroke-linejoin: round; }
.dg-arrow-label { font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-faint); }
.is-auto svg { transform: rotate(-90deg); }
/* Point down when the diagram itself is narrow (container query on .dg-frame). */
@container (max-width: 700px) {
  .is-auto svg { transform: none; }
}
</style>

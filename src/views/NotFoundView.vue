<script setup>
import { ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <section class="nf container">
    <p class="eyebrow">404</p>
    <h1>This page doesn’t exist.</h1>
    <p class="lead">The link may be outdated. The projects and case studies are all on the home page.</p>
    <RouterLink to="/" class="btn btn-primary"><ArrowLeft :size="18" aria-hidden="true" /> Back to home</RouterLink>
  </section>
</template>

<style scoped>
.nf { min-height: 60vh; display: grid; align-content: center; justify-items: start; gap: 18px; padding-block: 160px 96px; }
h1 { font-size: clamp(2rem, 5vw, 3.2rem); }
</style>

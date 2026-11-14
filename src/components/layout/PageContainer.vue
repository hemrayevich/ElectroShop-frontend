<script setup>
const props = defineProps({
  maxWidth: {
    type: String,
    default: 'max-w-7xl',
  },
})
</script>

<template>
  <main class="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8" :class="props.maxWidth">
    <slot />
  </main>
</template>

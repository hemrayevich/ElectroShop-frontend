<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'rect', // rect, circle, text
  },
  width: {
    type: String,
    default: 'w-full',
  },
  height: {
    type: String,
    default: 'h-4',
  },
  count: {
    type: Number,
    default: 1,
  },
  rounded: {
    type: String,
    default: 'rounded-lg',
  },
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="i in props.count"
      :key="i"
      aria-hidden="true"
      class="animate-pulse bg-gray-200 dark:bg-gray-800"
      :class="[
        props.width,
        props.height,
        props.variant === 'circle' ? 'rounded-full' : props.rounded,
      ]"
    />
  </div>
</template>

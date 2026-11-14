<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  colorClass: {
    type: String,
    default: 'text-current',
  },
})

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-3',
}
</script>

<template>
  <div
    role="status"
    aria-label="Загрузка"
    class="inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    :class="[sizeClasses[props.size] || sizeClasses.md, props.colorClass]"
  >
    <span class="sr-only">Загрузка...</span>
  </div>
</template>

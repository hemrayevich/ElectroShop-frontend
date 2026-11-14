<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'neutral', // primary, success, warning, danger, info, neutral
  },
  size: {
    type: String,
    default: 'md', // sm, md
  },
})

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs font-semibold',
  md: 'px-2.5 py-1 text-xs font-semibold',
}

const variantClasses = {
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full uppercase tracking-wider transition-colors"
    :class="[sizeClasses[props.size] || sizeClasses.md, variantClasses[props.variant] || variantClasses.neutral]"
  >
    <slot />
  </span>
</template>

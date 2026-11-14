<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'error', // error, success, warning, info
  },
  title: {
    type: String,
    default: '',
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['dismiss'])

const variantStyles = {
  error: {
    container: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
    icon: 'text-red-500',
  },
  success: {
    container: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
    icon: 'text-green-500',
  },
  warning: {
    container: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    icon: 'text-amber-500',
  },
  info: {
    container: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    icon: 'text-blue-500',
  },
}
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-3 rounded-xl border p-4 text-sm"
    :class="variantStyles[props.variant]?.container || variantStyles.error.container"
  >
    <!-- Icon -->
    <div class="shrink-0 mt-0.5">
      <svg
        v-if="props.variant === 'error'"
        class="size-5 text-red-500 dark:text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg
        v-else-if="props.variant === 'success'"
        class="size-5 text-green-500 dark:text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg
        v-else-if="props.variant === 'warning'"
        class="size-5 text-amber-500 dark:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg
        v-else
        class="size-5 text-blue-500 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <h4 v-if="props.title" class="font-semibold mb-1">
        {{ props.title }}
      </h4>
      <div class="leading-relaxed">
        <slot />
      </div>
    </div>

    <!-- Dismiss Button -->
    <button
      v-if="props.dismissible"
      type="button"
      aria-label="Скрыть"
      class="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      @click="emit('dismiss')"
    >
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

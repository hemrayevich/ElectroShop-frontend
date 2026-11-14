<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 15,
  },
})

const emit = defineEmits(['page-change'])

const pages = computed(() => {
  const current = props.currentPage
  const total = props.lastPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items = []
  items.push(1)

  if (current > 3) {
    items.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (current < total - 2) {
    items.push('...')
  }

  items.push(total)
  return items
})

function onPageClick(page) {
  if (page === '...' || page === props.currentPage) return
  emit('page-change', page)
}
</script>

<template>
  <nav
    v-if="props.lastPage > 1"
    aria-label="Навигация по страницам"
    class="flex flex-wrap items-center justify-between gap-4 py-4"
  >
    <div v-if="props.total > 0" class="text-sm text-gray-500 dark:text-gray-400">
      Страница {{ props.currentPage }} из {{ props.lastPage }} (всего {{ props.total }} товаров)
    </div>

    <div class="flex items-center gap-1">
      <!-- Previous button -->
      <button
        type="button"
        aria-label="Предыдущая страница"
        :disabled="props.currentPage <= 1"
        class="inline-flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="emit('page-change', props.currentPage - 1)"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Pages list -->
      <button
        v-for="(page, idx) in pages"
        :key="idx"
        type="button"
        :disabled="page === '...'"
        class="inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors"
        :class="[
          page === props.currentPage
            ? 'bg-blue-600 text-white font-bold'
            : page === '...'
            ? 'cursor-default text-gray-400'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer',
        ]"
        @click="onPageClick(page)"
      >
        {{ page }}
      </button>

      <!-- Next button -->
      <button
        type="button"
        aria-label="Следующая страница"
        :disabled="props.currentPage >= props.lastPage"
        class="inline-flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="emit('page-change', props.currentPage + 1)"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </nav>
</template>

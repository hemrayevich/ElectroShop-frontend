<script setup>
import BaseButton from './BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Ничего не найдено',
  },
  description: {
    type: String,
    default: 'По вашему запросу ничего не удалось найти. Попробуйте изменить параметры поиска.',
  },
  actionText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-10 text-center dark:border-gray-800 dark:bg-gray-900/40">
    <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
      <slot name="icon">
        <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </slot>
    </div>

    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
      {{ props.title }}
    </h3>

    <p class="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
      {{ props.description }}
    </p>

    <div v-if="props.actionText || $slots.action" class="mt-6">
      <slot name="action">
        <BaseButton variant="primary" @click="emit('action')">
          {{ props.actionText }}
        </BaseButton>
      </slot>
    </div>
  </div>
</template>

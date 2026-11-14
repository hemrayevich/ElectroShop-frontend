<script setup>
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Подтвердите действие',
  },
  message: {
    type: String,
    default: 'Вы уверены, что хотите выполнить это действие?',
  },
  confirmText: {
    type: String,
    default: 'Подтвердить',
  },
  cancelText: {
    type: String,
    default: 'Отмена',
  },
  confirmVariant: {
    type: String,
    default: 'danger', // danger, primary
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <BaseModal
    :is-open="props.isOpen"
    :title="props.title"
    max-width="max-w-md"
    @close="emit('cancel')"
  >
    <p class="text-sm text-gray-600 dark:text-gray-300">
      {{ props.message }}
    </p>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="props.loading"
        @click="emit('cancel')"
      >
        {{ props.cancelText }}
      </BaseButton>
      <BaseButton
        :variant="props.confirmVariant"
        :loading="props.loading"
        @click="emit('confirm')"
      >
        {{ props.confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

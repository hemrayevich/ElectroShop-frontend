<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: () => `check-${Math.random().toString(36).slice(2, 9)}`,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  emit('update:modelValue', e.target.checked)
}
</script>

<template>
  <div class="flex items-start gap-2.5">
    <div class="flex h-5 items-center">
      <input
        :id="props.id"
        type="checkbox"
        :checked="props.modelValue"
        :disabled="props.disabled"
        class="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800"
        @change="onChange"
      />
    </div>
    <div class="text-sm leading-5">
      <label
        :for="props.id"
        class="font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        <slot>{{ props.label }}</slot>
      </label>
      <p v-if="props.error" class="text-xs text-red-600 dark:text-red-400 mt-0.5">
        {{ props.error }}
      </p>
    </div>
  </div>
</template>

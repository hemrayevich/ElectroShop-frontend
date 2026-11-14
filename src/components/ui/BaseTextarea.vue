<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).slice(2, 9)}`,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: [Number, String],
    default: 3,
  },
  error: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="props.label"
      :for="props.id"
      class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500 font-bold">*</span>
    </label>

    <textarea
      :id="props.id"
      :rows="props.rows"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :aria-invalid="!!props.error"
      class="block w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
      :class="[
        props.error
          ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-red-200 dark:border-red-500 dark:bg-red-950/20 dark:text-red-200'
          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
      ]"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <p
      v-if="props.error"
      class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium"
    >
      {{ props.error }}
    </p>
  </div>
</template>

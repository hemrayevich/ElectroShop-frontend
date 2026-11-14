<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 9999,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

function decrement() {
  if (props.disabled || props.loading) return
  if (props.modelValue > props.min) {
    const newVal = props.modelValue - 1
    emit('update:modelValue', newVal)
    emit('change', newVal)
  }
}

function increment() {
  if (props.disabled || props.loading) return
  if (props.modelValue < props.max) {
    const newVal = props.modelValue + 1
    emit('update:modelValue', newVal)
    emit('change', newVal)
  }
}

function onInputChange(e) {
  let val = parseInt(e.target.value, 10)
  if (isNaN(val) || val < props.min) {
    val = props.min
  } else if (val > props.max) {
    val = props.max
  }
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div class="inline-flex items-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <button
      type="button"
      aria-label="Уменьшить количество"
      :disabled="props.disabled || props.loading || props.modelValue <= props.min"
      class="flex size-8 sm:size-9 items-center justify-center rounded-l-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer transition-colors"
      @click="decrement"
    >
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>

    <input
      type="number"
      aria-label="Количество"
      :value="props.modelValue"
      :min="props.min"
      :max="props.max"
      :disabled="props.disabled || props.loading"
      class="w-12 text-center text-sm font-semibold text-gray-900 focus:outline-none dark:text-white dark:bg-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      @change="onInputChange"
    />

    <button
      type="button"
      aria-label="Увеличить количество"
      :disabled="props.disabled || props.loading || props.modelValue >= props.max"
      class="flex size-8 sm:size-9 items-center justify-center rounded-r-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer transition-colors"
      @click="increment"
    >
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).slice(2, 9)}`,
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
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
  autocomplete: {
    type: String,
    default: 'off',
  },
  showPasswordToggle: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const isPasswordVisible = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && props.showPasswordToggle) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
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

    <div class="relative">
      <input
        :id="props.id"
        :type="computedType"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :required="props.required"
        :disabled="props.disabled"
        :autocomplete="props.autocomplete"
        :aria-invalid="!!props.error"
        :aria-describedby="props.error ? `${props.id}-error` : undefined"
        class="block w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
        :class="[
          props.error
            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-red-200 dark:border-red-500 dark:bg-red-950/20 dark:text-red-200 dark:focus:ring-red-900/50'
            : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900/40',
          props.showPasswordToggle ? 'pr-11' : '',
        ]"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <button
        v-if="props.type === 'password' && props.showPasswordToggle"
        type="button"
        tabindex="-1"
        :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
        class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
        @click="togglePasswordVisibility"
      >
        <!-- Eye icon -->
        <svg
          v-if="!isPasswordVisible"
          class="size-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <!-- Eye off icon -->
        <svg
          v-else
          class="size-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
          />
        </svg>
      </button>
    </div>

    <p
      v-if="props.error"
      :id="`${props.id}-error`"
      class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium"
    >
      {{ props.error }}
    </p>
  </div>
</template>

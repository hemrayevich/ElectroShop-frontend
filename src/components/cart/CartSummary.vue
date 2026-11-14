<script setup>
import { formatPrice } from '@/utils/format'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  itemsCount: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: [Number, String],
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showCheckoutButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['checkout'])
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
      Сумма заказа
    </h3>

    <div class="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
      <div class="flex justify-between">
        <span>Количество товаров</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ props.itemsCount }} шт.</span>
      </div>

      <div class="flex justify-between">
        <span>Доставка</span>
        <span class="font-medium text-green-600 dark:text-green-400">Бесплатно</span>
      </div>
    </div>

    <hr class="border-gray-100 dark:border-gray-800" />

    <div class="flex items-baseline justify-between pt-1">
      <span class="text-base font-semibold text-gray-900 dark:text-white">Итого к оплате</span>
      <span class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
        {{ formatPrice(props.totalPrice) }}
      </span>
    </div>

    <div v-if="props.showCheckoutButton" class="pt-2">
      <BaseButton
        variant="primary"
        block
        size="lg"
        :disabled="props.itemsCount === 0 || props.loading"
        @click="emit('checkout')"
      >
        <span>Оформить заказ</span>
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

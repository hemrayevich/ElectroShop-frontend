<script setup>
import { RouterLink } from 'vue-router'
import { formatPrice, formatDateTime } from '@/utils/format'
import OrderStatusBadge from './OrderStatusBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['cancel'])
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <div>
        <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Заказ
        </div>
        <div class="text-base font-bold text-gray-900 dark:text-white">
          {{ props.order.order_number }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDateTime(props.order.created_at) }}
        </span>
        <OrderStatusBadge :status="props.order.status" />
      </div>
    </div>

    <!-- Items summary -->
    <div class="py-4">
      <div v-if="props.order.items && props.order.items.length > 0" class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Состав заказа ({{ props.order.items.length }} поз.):
        </p>
        <div
          v-for="item in props.order.items.slice(0, 3)"
          :key="item.id"
          class="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
        >
          <span class="truncate pr-4">{{ item.product_name }} &times; {{ item.quantity }}</span>
          <span class="shrink-0 font-medium">{{ formatPrice(item.subtotal) }}</span>
        </div>
        <div v-if="props.order.items.length > 3" class="text-xs text-gray-400 pt-1">
          и ещё {{ props.order.items.length - 3 }} товара...
        </div>
      </div>
    </div>

    <!-- Footer: Total & Actions -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
      <div>
        <span class="text-xs text-gray-400">Итого:</span>
        <span class="ml-2 text-xl font-extrabold text-blue-600 dark:text-blue-400">
          {{ formatPrice(props.order.total_price) }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <BaseButton
          v-if="props.order.status === 'pending'"
          variant="outline"
          size="sm"
          class="text-red-600 hover:text-red-700 border-red-200 dark:border-red-900"
          @click="emit('cancel', props.order.id)"
        >
          Отменить заказ
        </BaseButton>

        <RouterLink :to="`/orders/${props.order.id}`">
          <BaseButton variant="primary" size="sm">
            Подробнее
          </BaseButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

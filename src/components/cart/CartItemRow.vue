<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/utils/format'
import { imageUrl } from '@/utils/imageUrl'
import QuantityInput from './QuantityInput.vue'
import PriceBlock from '@/components/product/PriceBlock.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update-quantity', 'remove'])

const mainImage = computed(() => {
  const images = props.item.product?.images || []
  if (images.length === 0) return null
  const main = images.find((i) => i.is_main)
  return main || images[0]
})

function onQuantityChange(newQty) {
  emit('update-quantity', newQty)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-gray-100 dark:border-gray-800">
    <!-- Product Info (Image + Title) -->
    <div class="flex items-center gap-4 min-w-0 flex-1">
      <RouterLink
        :to="`/products/${props.item.product_id}`"
        class="size-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 flex items-center justify-center"
      >
        <img
          v-if="mainImage"
          :src="imageUrl(mainImage.path)"
          :alt="props.item.product?.name"
          class="max-h-full max-w-full object-contain"
        />
        <div v-else class="text-gray-400">
          <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </RouterLink>

      <div class="min-w-0 flex-1">
        <h4 class="font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors line-clamp-2 text-sm sm:text-base">
          <RouterLink :to="`/products/${props.item.product_id}`">
            {{ props.item.product?.name || 'Товар' }}
          </RouterLink>
        </h4>
        <div class="mt-1 text-xs text-gray-400">
          Арт: {{ props.item.product?.sku || props.item.product_id }}
        </div>
        <div class="mt-1 sm:hidden">
          <PriceBlock
            :price="props.item.product?.price || props.item.price"
            :final-price="props.item.price"
            :is-discount="props.item.product?.is_discount"
            :discount-percent="props.item.product?.discount_percent"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Right Controls: Price, Quantity, Subtotal, Delete -->
    <div class="flex items-center justify-between w-full sm:w-auto sm:gap-6">
      <!-- Unit Price (Desktop) -->
      <div class="hidden sm:block text-right min-w-[90px]">
        <PriceBlock
          :price="props.item.product?.price || props.item.price"
          :final-price="props.item.price"
          :is-discount="props.item.product?.is_discount"
          :discount-percent="props.item.product?.discount_percent"
          size="sm"
        />
      </div>

      <!-- Quantity -->
      <div>
        <QuantityInput
          :model-value="props.item.quantity"
          :disabled="props.loading"
          @change="onQuantityChange"
        />
      </div>

      <!-- Line Subtotal -->
      <div class="text-right font-bold text-gray-900 dark:text-white min-w-[80px]">
        {{ formatPrice(props.item.subtotal) }}
      </div>

      <!-- Remove button -->
      <button
        type="button"
        aria-label="Удалить из корзины"
        title="Удалить"
        class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 cursor-pointer transition-colors"
        @click="emit('remove')"
      >
        <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

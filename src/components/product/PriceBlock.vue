<script setup>
import { formatPrice, formatDiscount } from '@/utils/format'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  price: {
    type: [Number, String],
    required: true,
  },
  finalPrice: {
    type: [Number, String],
    default: null,
  },
  isDiscount: {
    type: Boolean,
    default: false,
  },
  discountPercent: {
    type: [Number, String],
    default: null,
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
})

const sizeClasses = {
  sm: {
    current: 'text-sm font-bold',
    old: 'text-xs',
  },
  md: {
    current: 'text-lg font-bold',
    old: 'text-sm',
  },
  lg: {
    current: 'text-2xl sm:text-3xl font-extrabold',
    old: 'text-base sm:text-lg',
  },
}
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-2">
    <!-- Current / Final Price -->
    <span
      class="text-gray-900 dark:text-white transition-colors"
      :class="[
        sizeClasses[props.size]?.current || sizeClasses.md.current,
        props.isDiscount ? 'text-red-600 dark:text-red-400' : '',
      ]"
    >
      {{ formatPrice(props.finalPrice ?? props.price) }}
    </span>

    <!-- Original Price (strikethrough) -->
    <span
      v-if="props.isDiscount && props.price"
      class="text-gray-400 line-through dark:text-gray-500"
      :class="sizeClasses[props.size]?.old || sizeClasses.md.old"
    >
      {{ formatPrice(props.price) }}
    </span>

    <!-- Discount badge -->
    <BaseBadge
      v-if="props.isDiscount && props.discountPercent"
      variant="danger"
      size="sm"
    >
      {{ formatDiscount(props.discountPercent) }}
    </BaseBadge>
  </div>
</template>

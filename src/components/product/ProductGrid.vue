<script setup>
import ProductCard from './ProductCard.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 8,
  },
  emptyTitle: {
    type: String,
    default: 'Товары не найдены',
  },
  emptyDescription: {
    type: String,
    default: 'Попробуйте изменить параметры фильтрации или строку поиска.',
  },
})

const emit = defineEmits(['reset-filters'])
</script>

<template>
  <div>
    <!-- Skeletons when loading -->
    <div
      v-if="props.loading"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="i in props.skeletonCount"
        :key="i"
        class="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-xs"
      >
        <BaseSkeleton height="h-48" rounded="rounded-xl" />
        <div class="mt-4 space-y-2">
          <BaseSkeleton height="h-3" width="w-24" />
          <BaseSkeleton height="h-5" width="w-4/5" />
          <BaseSkeleton height="h-3" width="w-16" />
        </div>
        <div class="mt-6 flex items-center justify-between">
          <BaseSkeleton height="h-6" width="w-24" />
          <BaseSkeleton height="h-10" width="w-10" rounded="rounded-xl" />
        </div>
      </div>
    </div>

    <!-- Product list -->
    <div
      v-else-if="props.products.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ProductCard
        v-for="product in props.products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else
      :title="props.emptyTitle"
      :description="props.emptyDescription"
      action-text="Сбросить фильтры"
      @action="emit('reset-filters')"
    />
  </div>
</template>

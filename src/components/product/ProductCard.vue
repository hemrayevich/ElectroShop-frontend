<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { imageUrl } from '@/utils/imageUrl'
import PriceBlock from './PriceBlock.vue'
import StockBadge from './StockBadge.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const mainImage = computed(() => {
  if (!props.product.images || props.product.images.length === 0) return null
  const main = props.product.images.find((img) => img.is_main)
  return main || props.product.images[0]
})

async function onAddToCart() {
  if (!authStore.isAuthenticated.value) {
    router.push({
      name: 'login',
      query: { redirect: `/products/${props.product.id}` },
    })
    return
  }

  try {
    await cartStore.addToCart(props.product.id, 1)
    toast.success(`«${props.product.name}» добавлен в корзину`)
  } catch (err) {
    toast.error(err?.message || 'Не удалось добавить товар в корзину')
  }
}
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <!-- Image & badges -->
    <RouterLink
      :to="`/products/${props.product.id}`"
      class="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50 p-6 flex items-center justify-center"
    >
      <img
        v-if="mainImage"
        :src="imageUrl(mainImage.path)"
        :alt="props.product.name"
        class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex flex-col items-center justify-center text-gray-400">
        <svg class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- In Stock badge top-left -->
      <div class="absolute top-3 left-3">
        <StockBadge :in-stock="props.product.in_stock" />
      </div>
    </RouterLink>

    <!-- Info content -->
    <div class="flex flex-1 flex-col p-5">
      <!-- Category & Brand -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span v-if="props.product.brand?.name" class="font-medium">
          {{ props.product.brand.name }}
        </span>
        <span v-if="props.product.category?.name" class="truncate max-w-[120px]">
          {{ props.product.category.name }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors">
        <RouterLink :to="`/products/${props.product.id}`">
          {{ props.product.name }}
        </RouterLink>
      </h3>

      <div class="mt-1 text-xs text-gray-400">
        Арт: {{ props.product.sku }}
      </div>

      <!-- Spacer -->
      <div class="mt-auto pt-4 flex items-center justify-between gap-3">
        <!-- Price Block -->
        <PriceBlock
          :price="props.product.price"
          :final-price="props.product.final_price"
          :is-discount="props.product.is_discount"
          :discount-percent="props.product.discount_percent"
          size="md"
        />

        <!-- Add to cart button -->
        <button
          type="button"
          :disabled="!props.product.in_stock"
          :aria-label="props.product.in_stock ? `Добавить ${props.product.name} в корзину` : 'Нет в наличии'"
          title="В корзину"
          class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 cursor-pointer shadow-xs"
          @click="onAddToCart"
        >
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import productsService from '@/services/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import PageContainer from '@/components/layout/PageContainer.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import PriceBlock from '@/components/product/PriceBlock.vue'
import StockBadge from '@/components/product/StockBadge.vue'
import QuantityInput from '@/components/cart/QuantityInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const product = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const quantity = ref(1)
const isAdding = ref(false)
const cartError = ref('')

async function fetchProduct() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await productsService.getProduct(route.params.id)
    product.value = res.data
    document.title = `${res.data.name} | ElectroShop`
  } catch (err) {
    errorMessage.value = err?.message || 'Не удалось загрузить информацию о товаре'
  } finally {
    isLoading.value = false
  }
}

async function onAddToCart() {
  if (!authStore.isAuthenticated.value) {
    router.push({
      name: 'login',
      query: { redirect: route.fullPath },
    })
    return
  }

  isAdding.value = true
  cartError.value = ''
  try {
    await cartStore.addToCart(product.value.id, quantity.value)
    toast.success(`«${product.value.name}» (${quantity.value} шт.) добавлен в корзину`)
  } catch (err) {
    cartError.value = err?.message || 'Ошибка при добавлении в корзину'
    toast.error(cartError.value)
  } finally {
    isAdding.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <PageContainer>
    <!-- Breadcrumb -->
    <nav class="mb-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <RouterLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">Главная</RouterLink>
      <span>/</span>
      <RouterLink to="/products" class="hover:text-blue-600 dark:hover:text-blue-400">Каталог</RouterLink>
      <template v-if="product?.category">
        <span>/</span>
        <RouterLink :to="`/products?category_id=${product.category.id}`" class="hover:text-blue-600 dark:hover:text-blue-400">
          {{ product.category.name }}
        </RouterLink>
      </template>
    </nav>

    <!-- Error alert -->
    <BaseAlert v-if="errorMessage" variant="error" class="mb-6">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <BaseButton variant="outline" size="sm" @click="fetchProduct">Повторить</BaseButton>
      </div>
    </BaseAlert>

    <!-- Loading skeleton -->
    <div v-else-if="isLoading" class="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <BaseSkeleton height="h-96" rounded="rounded-3xl" />
      <div class="space-y-4">
        <BaseSkeleton height="h-6" width="w-32" />
        <BaseSkeleton height="h-10" width="w-4/5" />
        <BaseSkeleton height="h-8" width="w-48" />
        <BaseSkeleton height="h-32" />
      </div>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <!-- Gallery Column -->
      <div>
        <ProductGallery
          :images="product.images || []"
          :product-name="product.name"
        />
      </div>

      <!-- Info Column -->
      <div class="flex flex-col space-y-6">
        <div>
          <!-- Brand & Stock status -->
          <div class="flex items-center justify-between mb-2">
            <span v-if="product.brand?.name" class="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {{ product.brand.name }}
            </span>
            <StockBadge :in-stock="product.in_stock" />
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
            {{ product.name }}
          </h1>

          <div class="mt-2 text-xs text-gray-400">
            Артикул: <span class="font-mono">{{ product.sku }}</span>
          </div>
        </div>

        <!-- Price block -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Стоимость
          </div>
          <PriceBlock
            :price="product.price"
            :final-price="product.final_price"
            :is-discount="product.is_discount"
            :discount-percent="product.discount_percent"
            size="lg"
          />
        </div>

        <!-- Add to cart error alert -->
        <BaseAlert v-if="cartError" variant="error">
          {{ cartError }}
        </BaseAlert>

        <!-- Quantity & Add to Cart Controls -->
        <div class="flex flex-wrap items-center gap-4">
          <QuantityInput
            v-model="quantity"
            :disabled="!product.in_stock || isAdding"
          />

          <BaseButton
            variant="primary"
            size="lg"
            class="flex-1 min-w-[200px]"
            :disabled="!product.in_stock"
            :loading="isAdding"
            @click="onAddToCart"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>{{ product.in_stock ? 'В корзину' : 'Нет в наличии' }}</span>
          </BaseButton>
        </div>

        <!-- Description -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6">
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-2">
            Описание
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {{ product.description || 'Описание товара скоро появится.' }}
          </p>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'
import PageContainer from '@/components/layout/PageContainer.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const categories = ref([])
const discountedProducts = ref([])
const newestProducts = ref([])

const loadingCategories = ref(true)
const loadingDiscounted = ref(true)
const loadingNewest = ref(true)
const loadError = ref(null)

async function loadData() {
  loadError.value = null
  loadingCategories.value = true
  loadingDiscounted.value = true
  loadingNewest.value = true

  try {
    const [catRes, discRes, newRes] = await Promise.all([
      categoriesService.getCategories(),
      productsService.getProducts({ discounted: 1 }),
      productsService.getProducts({ sort: 'newest' }),
    ])
    categories.value = catRes.data || []
    discountedProducts.value = (discRes.data || []).slice(0, 4)
    newestProducts.value = (newRes.data || []).slice(0, 4)
  } catch (err) {
    loadError.value = err?.message || 'Не удалось загрузить данные'
  } finally {
    loadingCategories.value = false
    loadingDiscounted.value = false
    loadingNewest.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <PageContainer>
    <!-- Hero Banner -->
    <section class="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 px-6 py-14 sm:px-12 sm:py-20 text-white shadow-xl mb-12">
      <div class="relative z-10 max-w-2xl">
        <span class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md uppercase tracking-wider mb-4">
          ✨ Новые поступления техники
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Лучшая электроника по честным ценам
        </h1>
        <p class="mt-4 text-base sm:text-lg text-blue-100 leading-relaxed">
          Смартфоны, ноутбуки, умные часы и аксессуары от ведущих мировых брендов с гарантией и быстрой доставкой.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <RouterLink to="/products">
            <BaseButton variant="secondary" size="lg" class="shadow-lg font-bold">
              Перейти в каталог
            </BaseButton>
          </RouterLink>
          <RouterLink to="/products?discounted=1">
            <BaseButton variant="outline" size="lg" class="border-white text-white hover:bg-white/10">
              Скидки до -50%
            </BaseButton>
          </RouterLink>
        </div>
      </div>
      <!-- Background decoration -->
      <div class="absolute -right-10 -bottom-10 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
    </section>

    <!-- Error state with retry -->
    <div v-if="loadError" class="mb-8">
      <BaseAlert variant="error">
        <div class="flex items-center justify-between">
          <span>{{ loadError }}</span>
          <BaseButton variant="outline" size="sm" @click="loadData">
            Повторить
          </BaseButton>
        </div>
      </BaseAlert>
    </div>

    <!-- Categories Grid -->
    <section class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Популярные категории</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Выберите интересующую группу товаров</p>
        </div>
        <RouterLink to="/products" class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Все категории &rarr;
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/products?category_id=${cat.id}`"
          class="flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-white text-center shadow-xs transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="size-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center mb-3">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{{ cat.name }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Discounted Products Section -->
    <section class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Товары со скидкой</h2>
            <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">АКЦИЯ</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Выгодные предложения по сниженным ценам</p>
        </div>
        <RouterLink to="/products?discounted=1" class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Смотреть все &rarr;
        </RouterLink>
      </div>

      <ProductGrid
        :products="discountedProducts"
        :loading="loadingDiscounted"
        :skeleton-count="4"
      />
    </section>

    <!-- Newest Products Section -->
    <section class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Новинки каталога</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Самые свежие поступления электроники</p>
        </div>
        <RouterLink to="/products?sort=newest" class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Смотреть все &rarr;
        </RouterLink>
      </div>

      <ProductGrid
        :products="newestProducts"
        :loading="loadingNewest"
        :skeleton-count="4"
      />
    </section>
  </PageContainer>
</template>

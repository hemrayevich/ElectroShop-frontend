<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'
import brandsService from '@/services/brands'
import PageContainer from '@/components/layout/PageContainer.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { usePagination } from '@/composables/usePagination'

const route = useRoute()
const router = useRouter()

const products = ref([])
const categories = ref([])
const brands = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isMobileFiltersOpen = ref(false)

const pagination = usePagination()

const filters = reactive({
  search: route.query.search || '',
  category_id: route.query.category_id || '',
  category: route.query.category || '',
  brand_id: route.query.brand_id || '',
  min_price: route.query.min_price || '',
  max_price: route.query.max_price || '',
  in_stock: route.query.in_stock || '',
  discounted: route.query.discounted || '',
  sort: route.query.sort || 'newest',
})

async function fetchProducts() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const params = {
      ...filters,
      page: pagination.currentPage.value,
    }
    const res = await productsService.getProducts(params)
    products.value = res.data || []
    if (res.meta) {
      pagination.setMeta(res.meta)
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Не удалось загрузить товары'
  } finally {
    isLoading.value = false
  }
}

function syncFiltersToQuery() {
  const query = {}
  for (const [k, v] of Object.entries(filters)) {
    if (v !== '' && v !== null && v !== undefined && !(k === 'sort' && v === 'newest')) {
      query[k] = String(v)
    }
  }
  if (pagination.currentPage.value > 1) {
    query.page = String(pagination.currentPage.value)
  }
  router.push({ query })
}

function onUpdateFilters(partial) {
  Object.assign(filters, partial)
  pagination.currentPage.value = 1
  syncFiltersToQuery()
}

function onResetFilters() {
  filters.search = ''
  filters.category_id = ''
  filters.category = ''
  filters.brand_id = ''
  filters.min_price = ''
  filters.max_price = ''
  filters.in_stock = ''
  filters.discounted = ''
  filters.sort = 'newest'
  pagination.currentPage.value = 1
  syncFiltersToQuery()
}

function onPageChange(page) {
  pagination.setPage(page)
  syncFiltersToQuery()
}

watch(
  () => route.query,
  () => {
    filters.search = route.query.search || ''
    filters.category_id = route.query.category_id || ''
    filters.category = route.query.category || ''
    filters.brand_id = route.query.brand_id || ''
    filters.min_price = route.query.min_price || ''
    filters.max_price = route.query.max_price || ''
    filters.in_stock = route.query.in_stock || ''
    filters.discounted = route.query.discounted || ''
    filters.sort = route.query.sort || 'newest'
    pagination.currentPage.value = route.query.page ? Number(route.query.page) : 1
    fetchProducts()
  }
)

onMounted(async () => {
  try {
    const [catRes, brandRes] = await Promise.all([
      categoriesService.getCategories(),
      brandsService.getBrands(),
    ])
    categories.value = catRes.data || []
    brands.value = brandRes.data || []
  } catch {
    // Non-blocking
  }
  fetchProducts()
})
</script>

<template>
  <PageContainer>
    <!-- Header bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white">Каталог товаров</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Всего найдено: {{ pagination.total.value }} товаров</p>
      </div>

      <!-- Mobile filter trigger -->
      <div class="lg:hidden">
        <BaseButton variant="outline" size="sm" @click="isMobileFiltersOpen = !isMobileFiltersOpen">
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ isMobileFiltersOpen ? 'Скрыть фильтры' : 'Фильтры' }}
        </BaseButton>
      </div>
    </div>

    <!-- Error alert -->
    <BaseAlert v-if="errorMessage" variant="error" class="mb-6">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <BaseButton variant="outline" size="sm" @click="fetchProducts">Повторить</BaseButton>
      </div>
    </BaseAlert>

    <!-- Content layout -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <!-- Filters Sidebar (Desktop) and Mobile collapsible -->
      <div :class="['lg:block', isMobileFiltersOpen ? 'block' : 'hidden lg:block']">
        <ProductFilters
          :categories="categories"
          :brands="brands"
          :filters="filters"
          @update:filters="onUpdateFilters"
          @reset="onResetFilters"
        />
      </div>

      <!-- Products Grid & Pagination -->
      <div class="lg:col-span-3 space-y-6">
        <ProductGrid
          :products="products"
          :loading="isLoading"
          @reset-filters="onResetFilters"
        />

        <BasePagination
          :current-page="pagination.currentPage.value"
          :last-page="pagination.lastPage.value"
          :total="pagination.total.value"
          :per-page="pagination.perPage.value"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import PageContainer from '@/components/layout/PageContainer.vue'
import CartItemRow from '@/components/cart/CartItemRow.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

onMounted(async () => {
  try {
    await cartStore.fetchCart()
  } catch {
    // Handled in store
  }
})

async function onUpdateQuantity(itemId, newQty) {
  try {
    await cartStore.updateQuantity(itemId, newQty)
  } catch (err) {
    toast.error(err?.message || 'Не удалось обновить количество')
  }
}

async function onRemoveItem(itemId) {
  try {
    await cartStore.removeItem(itemId)
    toast.info('Товар удален из корзины')
  } catch (err) {
    toast.error(err?.message || 'Не удалось удалить товар')
  }
}

function onCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <PageContainer>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white">Корзина покупок</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Всего товаров: {{ cartStore.count.value }}
      </p>
    </div>

    <!-- Error alert if any -->
    <BaseAlert v-if="cartStore.error.value" variant="error" class="mb-6">
      <div class="flex items-center justify-between">
        <span>{{ cartStore.error.value }}</span>
        <BaseButton variant="outline" size="sm" @click="cartStore.fetchCart()">Повторить</BaseButton>
      </div>
    </BaseAlert>

    <!-- Empty state -->
    <div v-if="cartStore.isEmpty.value && !cartStore.isLoading.value">
      <EmptyState
        title="Ваша корзина пуста"
        description="Вы пока не добавили ни одного товара. Загляните в наш каталог, чтобы найти отличные новинки и скидки!"
        action-text="Перейти в каталог"
        @action="router.push('/products')"
      />
    </div>

    <!-- Cart items & Summary -->
    <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Items column -->
      <div class="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span>Товары в заказе</span>
          <RouterLink to="/products" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 normal-case font-medium">
            Продолжить покупки
          </RouterLink>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <CartItemRow
            v-for="item in cartStore.items.value"
            :key="item.id"
            :item="item"
            :loading="cartStore.isLoading.value"
            @update-quantity="(qty) => onUpdateQuantity(item.id, qty)"
            @remove="onRemoveItem(item.id)"
          />
        </div>
      </div>

      <!-- Summary column -->
      <div>
        <CartSummary
          :items-count="cartStore.count.value"
          :total-price="cartStore.total.value"
          :loading="cartStore.isLoading.value"
          @checkout="onCheckout"
        />
      </div>
    </div>
  </PageContainer>
</template>

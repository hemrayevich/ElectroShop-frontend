<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import ordersService from '@/services/orders'
import { formatPrice, formatDateTime } from '@/utils/format'
import { useToast } from '@/composables/useToast'
import PageContainer from '@/components/layout/PageContainer.vue'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import OrderItemsTable from '@/components/order/OrderItemsTable.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const route = useRoute()
const toast = useToast()

const order = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const isConfirmOpen = ref(false)
const isCancelling = ref(false)

async function fetchOrder() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await ordersService.getOrder(route.params.id)
    order.value = res.data
  } catch (err) {
    errorMessage.value = err?.message || 'Не удалось загрузить данные заказа'
  } finally {
    isLoading.value = false
  }
}

async function cancelOrder() {
  isCancelling.value = true
  try {
    await ordersService.cancelOrder(order.value.id)
    toast.success('Заказ успешно отменён')
    isConfirmOpen.value = false
    fetchOrder()
  } catch (err) {
    toast.error(err?.message || 'Не удалось отменить заказ')
  } finally {
    isCancelling.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<template>
  <PageContainer>
    <!-- Breadcrumb -->
    <nav class="mb-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <RouterLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">Главная</RouterLink>
      <span>/</span>
      <RouterLink to="/orders" class="hover:text-blue-600 dark:hover:text-blue-400">Мои заказы</RouterLink>
      <span>/</span>
      <span class="text-gray-900 dark:text-white font-medium">{{ order?.order_number || 'Заказ' }}</span>
    </nav>

    <!-- Error state -->
    <BaseAlert v-if="errorMessage" variant="error" class="mb-6">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <BaseButton variant="outline" size="sm" @click="fetchOrder">Повторить</BaseButton>
      </div>
    </BaseAlert>

    <!-- Skeleton -->
    <div v-else-if="isLoading" class="space-y-6">
      <BaseSkeleton height="h-24" rounded="rounded-2xl" />
      <BaseSkeleton height="h-64" rounded="rounded-2xl" />
    </div>

    <!-- Details View -->
    <div v-else-if="order" class="space-y-8">
      <!-- Order Header Card -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Заказ
          </div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">
            {{ order.order_number }}
          </h1>
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Оформлен: {{ formatDateTime(order.created_at) }}
          </div>
        </div>

        <div class="flex items-center gap-4">
          <OrderStatusBadge :status="order.status" />

          <BaseButton
            v-if="order.status === 'pending'"
            variant="outline"
            class="text-red-600 hover:text-red-700 border-red-200 dark:border-red-900"
            @click="isConfirmOpen = true"
          >
            Отменить заказ
          </BaseButton>
        </div>
      </div>

      <!-- Grid: Delivery info & Items -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Order Items -->
        <div class="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            Состав заказа
          </h2>

          <OrderItemsTable :items="order.items || []" />

          <div class="mt-6 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
            <div class="text-right">
              <span class="text-sm text-gray-500 dark:text-gray-400">Итого к оплате:</span>
              <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {{ formatPrice(order.total_price) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Information Card -->
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Информация о доставке
          </h2>

          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">Адрес доставки</div>
            <p class="mt-1 text-sm text-gray-800 dark:text-gray-200">{{ order.shipping_address }}</p>
          </div>

          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">Контактный телефон</div>
            <p class="mt-1 text-sm text-gray-800 dark:text-gray-200">{{ order.phone }}</p>
          </div>

          <div v-if="order.note">
            <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">Комментарий</div>
            <p class="mt-1 text-sm text-gray-800 dark:text-gray-200">{{ order.note }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Cancel Modal -->
    <ConfirmDialog
      :is-open="isConfirmOpen"
      title="Отмена заказа"
      message="Вы действительно хотите отменить этот заказ? Товары будут возвращены в наличие."
      confirm-text="Да, отменить"
      cancel-text="Назад"
      confirm-variant="danger"
      :loading="isCancelling"
      @confirm="cancelOrder"
      @cancel="isConfirmOpen = false"
    />
  </PageContainer>
</template>

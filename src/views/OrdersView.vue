<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ordersService from '@/services/orders'
import { usePagination } from '@/composables/usePagination'
import { useToast } from '@/composables/useToast'
import PageContainer from '@/components/layout/PageContainer.vue'
import OrderCard from '@/components/order/OrderCard.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const router = useRouter()
const toast = useToast()
const pagination = usePagination()

const orders = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const isConfirmOpen = ref(false)
const orderToCancel = ref(null)
const isCancelling = ref(false)

async function fetchOrders() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await ordersService.getOrders(pagination.currentPage.value)
    orders.value = res.data || []
    if (res.meta) {
      pagination.setMeta(res.meta)
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Не удалось загрузить список заказов'
  } finally {
    isLoading.value = false
  }
}

function onPageChange(page) {
  pagination.setPage(page)
  fetchOrders()
}

function promptCancel(orderId) {
  orderToCancel.value = orderId
  isConfirmOpen.value = true
}

async function confirmCancel() {
  if (!orderToCancel.value) return
  isCancelling.value = true
  try {
    await ordersService.cancelOrder(orderToCancel.value)
    toast.success('Заказ успешно отменён')
    isConfirmOpen.value = false
    orderToCancel.value = null
    fetchOrders()
  } catch (err) {
    toast.error(err?.message || 'Не удалось отменить заказ')
  } finally {
    isCancelling.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <PageContainer>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white">Мои заказы</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        История всех ваших заказов и их текущие статусы
      </p>
    </div>

    <!-- Error Alert -->
    <BaseAlert v-if="errorMessage" variant="error" class="mb-6">
      {{ errorMessage }}
    </BaseAlert>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <BaseSkeleton v-for="i in 3" :key="i" height="h-36" rounded="rounded-2xl" />
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0">
      <EmptyState
        title="Заказов пока нет"
        description="Вы ещё не сделали ни одного заказа. Выберите товары в каталоге и оформите первый заказ!"
        action-text="Перейти в каталог"
        @action="router.push('/products')"
      />
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div class="space-y-4">
        <OrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @cancel="promptCancel"
        />
      </div>

      <BasePagination
        :current-page="pagination.currentPage.value"
        :last-page="pagination.lastPage.value"
        :total="pagination.total.value"
        :per-page="pagination.perPage.value"
        @page-change="onPageChange"
      />
    </div>

    <!-- Cancel Confirmation Modal -->
    <ConfirmDialog
      :is-open="isConfirmOpen"
      title="Отмена заказа"
      message="Вы действительно хотите отменить этот заказ? Товары будут возвращены на склад."
      confirm-text="Да, отменить"
      cancel-text="Назад"
      confirm-variant="danger"
      :loading="isCancelling"
      @confirm="confirmCancel"
      @cancel="isConfirmOpen = false"
    />
  </PageContainer>
</template>

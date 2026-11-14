<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useForm } from '@/composables/useForm'
import { required, maxLength } from '@/utils/validators'
import ordersService from '@/services/orders'
import PageContainer from '@/components/layout/PageContainer.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import CartSummary from '@/components/cart/CartSummary.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const completedOrder = ref(null)

const {
  values,
  errors,
  submitting,
  generalError,
  handleSubmit,
  handleBlur,
} = useForm(
  {
    shipping_address: authStore.user.value?.address || '',
    phone: authStore.user.value?.phone || '',
    note: '',
  },
  {
    shipping_address: [required('Укажите адрес доставки'), maxLength(500, 'Максимум 500 символов')],
    phone: [required('Укажите контактный номер телефона'), maxLength(30, 'Максимум 30 символов')],
    note: [maxLength(1000, 'Максимум 1000 символов')],
  }
)

onMounted(async () => {
  if (cartStore.isEmpty.value) {
    try {
      await cartStore.fetchCart()
      if (cartStore.isEmpty.value) {
        router.push('/cart')
      }
    } catch {
      router.push('/cart')
    }
  }
})

const onSubmit = () =>
  handleSubmit(async (formData) => {
    const res = await ordersService.createOrder(formData)
    completedOrder.value = res.data
    cartStore.clearCart()
  })
</script>

<template>
  <PageContainer>
    <!-- Success Screen after order checkout -->
    <div v-if="completedOrder" class="mx-auto max-w-xl text-center py-12">
      <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400 mb-6">
        <svg class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-3xl font-black text-gray-900 dark:text-white">
        Заказ оформлен!
      </h1>
      <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
        Номер вашего заказа:
        <span class="font-bold text-blue-600 dark:text-blue-400">{{ completedOrder.order_number }}</span>
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Мы свяжемся с вами по телефону <span class="font-medium">{{ completedOrder.phone }}</span> для подтверждения.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <RouterLink :to="`/orders/${completedOrder.id}`">
          <BaseButton variant="primary" size="lg">
            Перейти к деталям заказа
          </BaseButton>
        </RouterLink>
        <RouterLink to="/products">
          <BaseButton variant="outline" size="lg">
            В каталог
          </BaseButton>
        </RouterLink>
      </div>
    </div>

    <!-- Checkout Form -->
    <div v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white">Оформление заказа</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Заполните адрес и контактные данные для доставки</p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Form Column -->
        <div class="lg:col-span-2">
          <form class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5" @submit.prevent="onSubmit">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Данные для доставки
            </h2>

            <BaseAlert v-if="generalError" variant="error">
              {{ generalError }}
            </BaseAlert>

            <BaseInput
              v-model="values.phone"
              label="Контактный телефон"
              placeholder="+7 (999) 000-00-00"
              required
              autocomplete="tel"
              :error="errors.phone"
              @blur="handleBlur('phone')"
            />

            <BaseTextarea
              v-model="values.shipping_address"
              label="Адрес доставки"
              placeholder="Город, улица, дом, квартира / офис"
              required
              :rows="3"
              :error="errors.shipping_address"
              @blur="handleBlur('shipping_address')"
            />

            <BaseTextarea
              v-model="values.note"
              label="Комментарий к заказу (необязательно)"
              placeholder="Например, удобное время доставки или код домофона"
              :rows="2"
              :error="errors.note"
              @blur="handleBlur('note')"
            />

            <div class="pt-4">
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                block
                :loading="submitting"
              >
                Подтвердить и заказать
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Summary Column -->
        <div>
          <CartSummary
            :items-count="cartStore.count.value"
            :total-price="cartStore.total.value"
            :show-checkout-button="false"
          />
        </div>
      </div>
    </div>
  </PageContainer>
</template>

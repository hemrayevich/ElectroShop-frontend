<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { required, email } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const {
  values,
  errors,
  submitting,
  generalError,
  handleSubmit,
  handleBlur,
} = useForm(
  {
    email: '',
    password: '',
  },
  {
    email: [required('Введите ваш email'), email('Неверный формат email')],
    password: [required('Введите пароль')],
  }
)

const onSubmit = () =>
  handleSubmit(async (credentials) => {
    await authStore.login(credentials)
    toast.success('Добро пожаловать!')
    try {
      await cartStore.fetchCart()
    } catch {
      // Ignored
    }
    const redirect = route.query.redirect ? String(route.query.redirect) : '/'
    router.push(redirect)
  })
</script>

<template>
  <div class="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <div class="text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 class="mt-4 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Вход в аккаунт
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Или
          <RouterLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            зарегистрируйтесь бесплатно
          </RouterLink>
        </p>
      </div>

      <BaseAlert v-if="generalError" variant="error">
        {{ generalError }}
      </BaseAlert>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <BaseInput
          v-model="values.email"
          type="email"
          label="Email адрес"
          placeholder="user@example.com"
          required
          autocomplete="username"
          :error="errors.email"
          @blur="handleBlur('email')"
        />

        <BaseInput
          v-model="values.password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          required
          show-password-toggle
          autocomplete="current-password"
          :error="errors.password"
          @blur="handleBlur('password')"
        />

        <BaseButton
          type="submit"
          variant="primary"
          block
          size="lg"
          :loading="submitting"
        >
          Войти
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { required, email, maxLength, passwordStrength, sameAs } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
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
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
  },
  {
    name: [required('Введите ваше имя'), maxLength(255, 'Максимум 255 символов')],
    email: [required('Введите email'), email('Некорректный email'), maxLength(255, 'Максимум 255 символов')],
    password: [
      required('Введите пароль'),
      passwordStrength('Минимум 8 символов, буквы и цифры'),
    ],
    password_confirmation: [
      required('Подтвердите пароль'),
      sameAs('password', 'Пароли не совпадают'),
    ],
    phone: [maxLength(30, 'Максимум 30 символов')],
    address: [maxLength(500, 'Максимум 500 символов')],
  }
)

const onSubmit = () =>
  handleSubmit(async (formData) => {
    await authStore.register(formData)
    toast.success('Регистрация прошла успешно!')
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
    <div class="w-full max-w-lg space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <div class="text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="mt-4 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Создать аккаунт
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Уже есть аккаунт?
          <RouterLink to="/login" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Войдите в систему
          </RouterLink>
        </p>
      </div>

      <BaseAlert v-if="generalError" variant="error">
        {{ generalError }}
      </BaseAlert>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <BaseInput
          v-model="values.name"
          label="Имя и фамилия"
          placeholder="Иван Иванов"
          required
          autocomplete="name"
          :error="errors.name"
          @blur="handleBlur('name')"
        />

        <BaseInput
          v-model="values.email"
          type="email"
          label="Email адрес"
          placeholder="user@example.com"
          required
          autocomplete="email"
          :error="errors.email"
          @blur="handleBlur('email')"
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="values.password"
            type="password"
            label="Пароль"
            placeholder="••••••••"
            required
            show-password-toggle
            autocomplete="new-password"
            :error="errors.password"
            @blur="handleBlur('password')"
          />

          <BaseInput
            v-model="values.password_confirmation"
            type="password"
            label="Подтверждение"
            placeholder="••••••••"
            required
            show-password-toggle
            autocomplete="new-password"
            :error="errors.password_confirmation"
            @blur="handleBlur('password_confirmation')"
          />
        </div>

        <BaseInput
          v-model="values.phone"
          label="Номер телефона"
          placeholder="+7 (999) 000-00-00"
          autocomplete="tel"
          :error="errors.phone"
          @blur="handleBlur('phone')"
        />

        <BaseTextarea
          v-model="values.address"
          label="Адрес доставки"
          placeholder="г. Москва, ул. Ленина, д. 10"
          :rows="2"
          :error="errors.address"
          @blur="handleBlur('address')"
        />

        <div class="pt-2">
          <BaseButton
            type="submit"
            variant="primary"
            block
            size="lg"
            :loading="submitting"
          >
            Зарегистрироваться
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

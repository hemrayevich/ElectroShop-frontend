<script setup>
import { useForm } from '@/composables/useForm'
import { required, passwordStrength, sameAs } from '@/utils/validators'
import { useToast } from '@/composables/useToast'
import profileService from '@/services/profile'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const toast = useToast()

const {
  values,
  errors,
  submitting,
  generalError,
  handleSubmit,
  handleBlur,
  reset,
} = useForm(
  {
    current_password: '',
    password: '',
    password_confirmation: '',
  },
  {
    current_password: [required('Введите текущий пароль')],
    password: [
      required('Введите новый пароль'),
      passwordStrength('Пароль должен быть не менее 8 символов и содержать буквы и цифры'),
    ],
    password_confirmation: [
      required('Подтвердите новый пароль'),
      sameAs('password', 'Пароли не совпадают'),
    ],
  }
)

const onSubmit = () =>
  handleSubmit(async (formData) => {
    await profileService.updatePassword(formData)
    toast.success('Пароль успешно изменён')
    reset()
  })
</script>

<template>
  <form class="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900" @submit.prevent="onSubmit">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
      Смена пароля
    </h3>

    <BaseAlert v-if="generalError" variant="error">
      {{ generalError }}
    </BaseAlert>

    <div class="space-y-4">
      <BaseInput
        v-model="values.current_password"
        type="password"
        label="Текущий пароль"
        required
        show-password-toggle
        autocomplete="current-password"
        :error="errors.current_password"
        @blur="handleBlur('current_password')"
      />

      <BaseInput
        v-model="values.password"
        type="password"
        label="Новый пароль"
        required
        show-password-toggle
        autocomplete="new-password"
        :error="errors.password"
        @blur="handleBlur('password')"
      />

      <BaseInput
        v-model="values.password_confirmation"
        type="password"
        label="Подтверждение нового пароля"
        required
        show-password-toggle
        autocomplete="new-password"
        :error="errors.password_confirmation"
        @blur="handleBlur('password_confirmation')"
      />
    </div>

    <div class="pt-2">
      <BaseButton
        type="submit"
        variant="primary"
        :loading="submitting"
      >
        Обновить пароль
      </BaseButton>
    </div>
  </form>
</template>

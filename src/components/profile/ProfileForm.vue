<script setup>
import { useForm } from '@/composables/useForm'
import { required, maxLength } from '@/utils/validators'
import { useToast } from '@/composables/useToast'
import profileService from '@/services/profile'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated'])

const toast = useToast()
const authStore = useAuthStore()

const {
  values,
  errors,
  submitting,
  generalError,
  handleSubmit,
  handleBlur,
} = useForm(
  {
    name: props.user?.name || '',
    phone: props.user?.phone || '',
    address: props.user?.address || '',
  },
  {
    name: [required('Имя обязательно'), maxLength(255, 'Максимум 255 символов')],
    phone: [maxLength(30, 'Максимум 30 символов')],
    address: [maxLength(500, 'Максимум 500 символов')],
  }
)

const onSubmit = () =>
  handleSubmit(async (formData) => {
    const res = await profileService.updateProfile(formData)
    authStore.updateUser(res.data)
    toast.success('Профиль успешно обновлён')
    emit('updated', res.data)
  })
</script>

<template>
  <form class="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900" @submit.prevent="onSubmit">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
      Личные данные
    </h3>

    <BaseAlert v-if="generalError" variant="error">
      {{ generalError }}
    </BaseAlert>

    <div class="space-y-4">
      <!-- Email (Read-only) -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
          Email (логин)
        </label>
        <input
          type="text"
          :value="props.user?.email"
          disabled
          class="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400 cursor-not-allowed"
        />
        <p class="mt-1 text-xs text-gray-400">Email нельзя изменить</p>
      </div>

      <!-- Name -->
      <BaseInput
        v-model="values.name"
        label="ФИО / Имя"
        required
        placeholder="Иван Иванов"
        :error="errors.name"
        @blur="handleBlur('name')"
      />

      <!-- Phone -->
      <BaseInput
        v-model="values.phone"
        label="Номер телефона"
        placeholder="+7 (999) 000-00-00"
        :error="errors.phone"
        @blur="handleBlur('phone')"
      />

      <!-- Address -->
      <BaseTextarea
        v-model="values.address"
        label="Адрес доставки по умолчанию"
        placeholder="г. Москва, ул. Ленина, д. 10, кв. 5"
        :rows="2"
        :error="errors.address"
        @blur="handleBlur('address')"
      />
    </div>

    <div class="pt-2">
      <BaseButton
        type="submit"
        variant="primary"
        :loading="submitting"
      >
        Сохранить изменения
      </BaseButton>
    </div>
  </form>
</template>

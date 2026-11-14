<script setup>
import { ref } from 'vue'
import profileService from '@/services/profile'
import { imageUrl } from '@/utils/imageUrl'
import { fileType, fileSize } from '@/utils/validators'
import { useToast } from '@/composables/useToast'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  currentAvatar: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['uploaded'])

const toast = useToast()
const fileInput = ref(null)
const previewUrl = ref(null)
const selectedFile = ref(null)
const error = ref('')
const isUploading = ref(false)

const validateType = fileType(['image/jpeg', 'image/png', 'image/webp'], 'Разрешены только JPG, PNG, WEBP')
const validateSize = fileSize(2 * 1024 * 1024, 'Размер аватара не должен превышать 2 МБ')

function onFileSelected(e) {
  error.value = ''
  const file = e.target.files?.[0]
  if (!file) return

  const typeErr = validateType(file)
  if (typeErr) {
    error.value = typeErr
    return
  }

  const sizeErr = validateSize(file)
  if (sizeErr) {
    error.value = sizeErr
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function triggerFileSelect() {
  fileInput.value?.click()
}

async function upload() {
  if (!selectedFile.value) return

  isUploading.value = true
  error.value = ''
  try {
    const res = await profileService.uploadAvatar(selectedFile.value)
    toast.success('Аватар успешно обновлён')
    emit('uploaded', res.data?.avatar)
    selectedFile.value = null
    previewUrl.value = null
  } catch (err) {
    error.value = err?.message || 'Не удалось загрузить аватар'
    toast.error(error.value)
  } finally {
    isUploading.value = false
  }
}

function cancelSelected() {
  selectedFile.value = null
  previewUrl.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <!-- Avatar display / preview -->
    <div class="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-blue-600/30 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Предпросмотр аватара"
        class="size-full object-cover"
      />
      <img
        v-else-if="props.currentAvatar"
        :src="imageUrl(props.currentAvatar)"
        alt="Аватар пользователя"
        class="size-full object-cover"
      />
      <svg
        v-else
        class="size-12 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>

    <!-- Actions & input -->
    <div class="flex-1 text-center sm:text-left space-y-2">
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="onFileSelected"
      />

      <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
        <BaseButton
          v-if="!selectedFile"
          variant="outline"
          size="sm"
          @click="triggerFileSelect"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Выбрать фото
        </BaseButton>

        <template v-else>
          <BaseButton
            variant="primary"
            size="sm"
            :loading="isUploading"
            @click="upload"
          >
            Сохранить аватар
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="isUploading"
            @click="cancelSelected"
          >
            Отмена
          </BaseButton>
        </template>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Разрешены JPG, PNG или WEBP. Максимальный размер 2 МБ.
      </p>

      <p v-if="error" class="text-xs font-medium text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PageContainer from '@/components/layout/PageContainer.vue'
import AvatarUploader from '@/components/profile/AvatarUploader.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import PasswordForm from '@/components/profile/PasswordForm.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.fetchProfile()
  } catch {
    // Handled in store
  }
})

function onAvatarUploaded(newAvatar) {
  authStore.updateUser({ avatar: newAvatar })
}

function onProfileUpdated(updatedUser) {
  authStore.updateUser(updatedUser)
}
</script>

<template>
  <PageContainer>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white">Мой профиль</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Управление личными данными, адресом и безопасностью аккаунта
      </p>
    </div>

    <div v-if="authStore.isLoadingProfile.value && !authStore.user.value" class="space-y-6">
      <BaseSkeleton height="h-32" rounded="rounded-2xl" />
      <BaseSkeleton height="h-64" rounded="rounded-2xl" />
    </div>

    <div v-else-if="authStore.user.value" class="space-y-8 max-w-4xl">
      <!-- Avatar Section -->
      <AvatarUploader
        :current-avatar="authStore.userAvatar.value"
        @uploaded="onAvatarUploaded"
      />

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Personal info form -->
        <div>
          <ProfileForm
            :user="authStore.user.value"
            @updated="onProfileUpdated"
          />
        </div>

        <!-- Password form -->
        <div>
          <PasswordForm />
        </div>
      </div>
    </div>
  </PageContainer>
</template>

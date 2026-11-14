<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import ToggleDarkMode from '@/components/common/ToggleDarkMode.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'logout'])

const authStore = useAuthStore()
const cartStore = useCartStore()

function handleLinkClick() {
  emit('close')
}

function handleLogout() {
  emit('logout')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50 flex lg:hidden"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
      />

      <!-- Drawer -->
      <div class="relative flex w-full max-w-xs flex-1 flex-col bg-white py-6 shadow-xl dark:bg-gray-900 z-10">
        <!-- Close button & Logo -->
        <div class="flex items-center justify-between px-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <RouterLink
            to="/"
            class="flex items-center gap-2 text-xl font-black tracking-tight text-blue-600 dark:text-blue-400"
            @click="handleLinkClick"
          >
            <span>⚡ ElectroShop</span>
          </RouterLink>

          <button
            type="button"
            aria-label="Закрыть меню"
            class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 cursor-pointer"
            @click="emit('close')"
          >
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Links -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <nav class="space-y-2">
            <RouterLink
              to="/"
              class="block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="handleLinkClick"
            >
              Главная
            </RouterLink>

            <RouterLink
              to="/products"
              class="block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="handleLinkClick"
            >
              Каталог
            </RouterLink>

            <RouterLink
              to="/cart"
              class="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="handleLinkClick"
            >
              <span>Корзина</span>
              <span
                v-if="cartStore.count.value > 0"
                class="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white"
              >
                {{ cartStore.count.value }}
              </span>
            </RouterLink>

            <template v-if="authStore.isAuthenticated.value">
              <RouterLink
                to="/orders"
                class="block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="handleLinkClick"
              >
                Мои заказы
              </RouterLink>

              <RouterLink
                to="/profile"
                class="block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="handleLinkClick"
              >
                Профиль ({{ authStore.userName.value || 'Пользователь' }})
              </RouterLink>
            </template>
          </nav>

          <hr class="border-gray-200 dark:border-gray-800" />

          <!-- Theme switcher -->
          <div class="flex items-center justify-between py-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Тёмная тема</span>
            <ToggleDarkMode />
          </div>

          <!-- Auth Buttons -->
          <div class="pt-4 space-y-2">
            <template v-if="authStore.isAuthenticated.value">
              <button
                type="button"
                class="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 cursor-pointer"
                @click="handleLogout"
              >
                Выйти
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="block w-full text-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                @click="handleLinkClick"
              >
                Войти
              </RouterLink>
              <RouterLink
                to="/register"
                class="block w-full text-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="handleLinkClick"
              >
                Регистрация
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { imageUrl } from '@/utils/imageUrl'
import ToggleDarkMode from '@/components/common/ToggleDarkMode.vue'
import MobileMenu from './MobileMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const isMobileMenuOpen = ref(false)

onMounted(async () => {
  if (authStore.isAuthenticated.value) {
    try {
      await cartStore.fetchCart()
    } catch {
      // Ignored if cart fails initially
    }
  }
})

async function onLogout() {
  try {
    await authStore.logout()
    cartStore.clearCart()
    toast.success('Вы успешно вышли из системы')
    router.push('/')
  } catch (err) {
    toast.error(err?.message || 'Ошибка при выходе')
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 transition-colors">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo & Main Nav -->
      <div class="flex items-center gap-8">
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
        >
          <span class="text-2xl">⚡</span>
          <span>ElectroShop</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            active-class="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Главная
          </RouterLink>
          <RouterLink
            to="/products"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            active-class="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Каталог
          </RouterLink>
          <template v-if="authStore.isAuthenticated.value">
            <RouterLink
              to="/orders"
              class="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              active-class="text-blue-600 dark:text-blue-400 font-semibold"
            >
              Мои заказы
            </RouterLink>
          </template>
        </nav>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Theme switcher -->
        <div class="hidden sm:flex items-center">
          <ToggleDarkMode />
        </div>

        <!-- Cart Icon -->
        <RouterLink
          to="/cart"
          aria-label="Корзина"
          class="relative flex items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-colors"
        >
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            v-if="cartStore.count.value > 0"
            class="absolute -top-1 -right-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white shadow-xs"
          >
            {{ cartStore.count.value }}
          </span>
        </RouterLink>

        <!-- Auth buttons / User Profile (Desktop) -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="authStore.isAuthenticated.value">
            <RouterLink
              to="/profile"
              class="flex items-center gap-2 rounded-xl p-1.5 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="size-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-blue-200 dark:border-blue-700">
                <img
                  v-if="authStore.userAvatar.value"
                  :src="imageUrl(authStore.userAvatar.value)"
                  :alt="authStore.userName.value"
                  class="size-full object-cover"
                />
                <span v-else>{{ (authStore.userName.value || 'U')[0].toUpperCase() }}</span>
              </div>
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
                {{ authStore.userName.value || 'Профиль' }}
              </span>
            </RouterLink>

            <button
              type="button"
              aria-label="Выйти из аккаунта"
              title="Выйти"
              class="rounded-xl p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:text-gray-400 dark:hover:text-red-400 transition-colors cursor-pointer"
              @click="onLogout"
            >
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="rounded-lg px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Войти
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              Регистрация
            </RouterLink>
          </template>
        </div>

        <!-- Mobile burger button -->
        <button
          type="button"
          aria-label="Открыть меню"
          class="flex md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
          @click="isMobileMenuOpen = true"
        >
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <MobileMenu
      :is-open="isMobileMenuOpen"
      @close="isMobileMenuOpen = false"
      @logout="onLogout"
    />
  </header>
</template>

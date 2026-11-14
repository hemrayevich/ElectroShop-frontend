<script setup>
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <!-- Brand Info -->
        <div class="space-y-4 md:col-span-2">
          <RouterLink
            to="/"
            class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
          >
            <span>⚡ ElectroShop</span>
          </RouterLink>
          <p class="max-w-md text-sm text-gray-600 dark:text-gray-400">
            Современный интернет-магазин электроники и гаджетов. Быстрая доставка, официальная гарантия и лучшие цены на технику.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            Покупателям
          </h4>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li>
              <RouterLink to="/products" class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Каталог товаров
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products?discounted=1" class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Товары со скидкой
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/cart" class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Корзина
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            Личный кабинет
          </h4>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li>
              <RouterLink to="/profile" class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Мой профиль
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/orders" class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                История заказов
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        &copy; {{ currentYear }} ElectroShop. Все права защищены.
      </div>
    </div>
  </footer>
</template>

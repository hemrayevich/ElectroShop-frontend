<script setup>
import { RouterLink } from 'vue-router'
import PageContainer from '@/components/layout/PageContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <PageContainer>
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="text-7xl sm:text-9xl font-black tracking-widest text-blue-600/20 dark:text-blue-500/10 select-none">
        404
      </div>
      <h1 class="mt-4 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Страница не найдена
      </h1>
      <p class="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Возможно, страница была перемещена или удалена. Проверьте правильность адреса или вернитесь на главную страницу.
      </p>

      <div class="mt-8 flex gap-4">
        <RouterLink to="/">
          <BaseButton variant="primary" size="lg">
            На главную
          </BaseButton>
        </RouterLink>
        <RouterLink to="/products">
          <BaseButton variant="outline" size="lg">
            В каталог
          </BaseButton>
        </RouterLink>
      </div>
    </div>
  </PageContainer>
</template>

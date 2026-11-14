<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100 font-sans antialiased">
    <AppHeader />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter />
    <ToastContainer />
  </div>
</template>

<style scoped></style>

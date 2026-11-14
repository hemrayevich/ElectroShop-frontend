<script setup>
import { ref, computed, watch } from 'vue'
import { imageUrl } from '@/utils/imageUrl'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  productName: {
    type: String,
    default: 'Товар',
  },
})

const selectedIndex = ref(0)

// Sort images and find initial main image
const sortedImages = computed(() => {
  if (!props.images || props.images.length === 0) return []
  return [...props.images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})

watch(
  sortedImages,
  (newImages) => {
    if (newImages.length > 0) {
      const mainIdx = newImages.findIndex((img) => img.is_main)
      selectedIndex.value = mainIdx >= 0 ? mainIdx : 0
    } else {
      selectedIndex.value = 0
    }
  },
  { immediate: true }
)

const activeImage = computed(() => {
  if (sortedImages.value.length === 0) return null
  return sortedImages.value[selectedIndex.value] || sortedImages.value[0]
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Main Large Image -->
    <div class="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center justify-center">
      <img
        v-if="activeImage"
        :src="imageUrl(activeImage.path)"
        :alt="props.productName"
        class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
      />
      <div v-else class="flex flex-col items-center justify-center text-gray-400">
        <svg class="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="mt-2 text-xs">Нет изображения</span>
      </div>
    </div>

    <!-- Thumbnails carousel / row -->
    <div v-if="sortedImages.length > 1" class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      <button
        v-for="(img, idx) in sortedImages"
        :key="img.id || idx"
        type="button"
        :aria-label="`Изображение ${idx + 1}`"
        class="relative size-18 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition-all cursor-pointer dark:bg-gray-900"
        :class="[
          selectedIndex === idx
            ? 'border-blue-600 shadow-xs'
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700 opacity-70 hover:opacity-100',
        ]"
        @click="selectedIndex = idx"
      >
        <img
          :src="imageUrl(img.path)"
          :alt="`${props.productName} thumbnail ${idx + 1}`"
          class="size-full object-contain"
        />
      </button>
    </div>
  </div>
</template>

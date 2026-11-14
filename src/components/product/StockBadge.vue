<script setup>
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  inStock: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <BaseBadge
    :variant="props.inStock ? 'success' : 'danger'"
    size="sm"
  >
    <span class="inline-block size-1.5 rounded-full" :class="props.inStock ? 'bg-green-500' : 'bg-red-500'" />
    {{ props.inStock ? 'В наличии' : 'Нет в наличии' }}
  </BaseBadge>
</template>

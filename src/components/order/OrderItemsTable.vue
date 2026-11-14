<script setup>
import { RouterLink } from 'vue-router'
import { formatPrice, formatDiscount } from '@/utils/format'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-2">Товар</th>
          <th scope="col" class="py-3 px-2 text-right">Цена</th>
          <th scope="col" class="py-3 px-2 text-center">Кол-во</th>
          <th scope="col" class="py-3 px-2 text-right">Сумма</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <tr
          v-for="item in props.items"
          :key="item.id"
          class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <td class="py-3 px-2">
            <div class="font-medium text-gray-900 dark:text-white">
              <RouterLink
                v-if="item.product_id"
                :to="`/products/${item.product_id}`"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ item.product_name }}
              </RouterLink>
              <span v-else>{{ item.product_name }}</span>
            </div>
            <div v-if="item.discount_percent" class="mt-0.5">
              <BaseBadge variant="danger" size="sm">
                скидка {{ formatDiscount(item.discount_percent) }}
              </BaseBadge>
            </div>
          </td>
          <td class="py-3 px-2 text-right text-gray-600 dark:text-gray-300">
            {{ formatPrice(item.price) }}
          </td>
          <td class="py-3 px-2 text-center text-gray-600 dark:text-gray-300">
            {{ item.quantity }}
          </td>
          <td class="py-3 px-2 text-right font-bold text-gray-900 dark:text-white">
            {{ formatPrice(item.subtotal) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

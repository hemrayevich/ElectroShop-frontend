<script setup>
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { debounce } from '@/composables/useDebounce'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  brands: {
    type: Array,
    default: () => [],
  },
  filters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:filters', 'reset'])

// Local search ref for debouncing
const localSearch = ref(props.filters.search || '')

const sortOptions = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Цена: по возрастанию', value: 'price_asc' },
  { label: 'Цена: по убыванию', value: 'price_desc' },
]

const debouncedSearchUpdate = debounce((value) => {
  emit('update:filters', { search: value })
}, 400)

watch(
  () => props.filters.search,
  (newVal) => {
    if (newVal !== localSearch.value) {
      localSearch.value = newVal || ''
    }
  }
)

function onSearchInput(val) {
  localSearch.value = val
  debouncedSearchUpdate(val)
}

function updateField(key, value) {
  emit('update:filters', { [key]: value })
}
</script>

<template>
  <aside class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <h2 class="font-bold text-gray-900 dark:text-white">Фильтры</h2>
      <button
        type="button"
        class="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
        @click="emit('reset')"
      >
        Сбросить все
      </button>
    </div>

    <!-- Search -->
    <div>
      <BaseInput
        :model-value="localSearch"
        label="Поиск по каталогу"
        placeholder="Название или артикул..."
        @update:model-value="onSearchInput"
      />
    </div>

    <!-- Sort -->
    <div>
      <BaseSelect
        :model-value="props.filters.sort || 'newest'"
        :options="sortOptions"
        label="Сортировка"
        placeholder=""
        @update:model-value="(val) => updateField('sort', val)"
      />
    </div>

    <!-- Category -->
    <div class="space-y-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Категория
      </label>
      <select
        :value="props.filters.category_id || props.filters.category || ''"
        class="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        @change="(e) => updateField('category_id', e.target.value)"
      >
        <option value="">Все категории</option>
        <template v-for="cat in props.categories" :key="cat.id">
          <option :value="cat.id">
            {{ cat.name }}
          </option>
          <!-- Nested children -->
          <option
            v-for="sub in cat.children || []"
            :key="sub.id"
            :value="sub.id"
          >
            &nbsp;&nbsp;↳ {{ sub.name }}
          </option>
        </template>
      </select>
    </div>

    <!-- Brand -->
    <div class="space-y-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Бренд
      </label>
      <select
        :value="props.filters.brand_id || ''"
        class="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        @change="(e) => updateField('brand_id', e.target.value)"
      >
        <option value="">Все бренды</option>
        <option
          v-for="brand in props.brands"
          :key="brand.id"
          :value="brand.id"
        >
          {{ brand.name }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="space-y-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Цена ($)
      </label>
      <div class="grid grid-cols-2 gap-2">
        <BaseInput
          :model-value="props.filters.min_price || ''"
          type="number"
          placeholder="От"
          @update:model-value="(val) => updateField('min_price', val)"
        />
        <BaseInput
          :model-value="props.filters.max_price || ''"
          type="number"
          placeholder="До"
          @update:model-value="(val) => updateField('max_price', val)"
        />
      </div>
    </div>

    <!-- Checkboxes -->
    <div class="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
      <BaseCheckbox
        :model-value="Boolean(props.filters.discounted)"
        label="Только со скидкой"
        @update:model-value="(val) => updateField('discounted', val ? 1 : '')"
      />
      <BaseCheckbox
        :model-value="Boolean(props.filters.in_stock)"
        label="Только в наличии"
        @update:model-value="(val) => updateField('in_stock', val ? 1 : '')"
      />
    </div>

    <!-- Reset button on bottom for mobile -->
    <div class="pt-2">
      <BaseButton
        variant="outline"
        block
        size="sm"
        @click="emit('reset')"
      >
        Сбросить фильтры
      </BaseButton>
    </div>
  </aside>
</template>

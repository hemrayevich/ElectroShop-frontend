import { ref, computed } from 'vue'
import cartService from '@/services/cart'

// Reactive state singleton
const items = ref([])
const totalPrice = ref(0)
const itemsCount = ref(0)
const isLoading = ref(false)
const error = ref(null)

export function useCartStore() {
  const count = computed(() => itemsCount.value)
  const total = computed(() => totalPrice.value)
  const isEmpty = computed(() => items.value.length === 0)

  async function fetchCart() {
    isLoading.value = true
    error.value = null
    try {
      const res = await cartService.getCart()
      items.value = res.data || []
      totalPrice.value = res.total_price || 0
      itemsCount.value = res.items_count || 0
      return res
    } catch (err) {
      error.value = err?.message || 'Не удалось загрузить корзину'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addToCart(productId, quantity = 1) {
    isLoading.value = true
    error.value = null
    try {
      const res = await cartService.addToCart(productId, quantity)
      await fetchCart()
      return res
    } catch (err) {
      error.value = err?.message || 'Не удалось добавить товар в корзину'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    isLoading.value = true
    error.value = null
    try {
      const res = await cartService.updateCartItem(cartItemId, quantity)
      await fetchCart()
      return res
    } catch (err) {
      error.value = err?.message || 'Не удалось обновить количество'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function removeItem(cartItemId) {
    isLoading.value = true
    error.value = null
    try {
      const res = await cartService.removeCartItem(cartItemId)
      await fetchCart()
      return res
    } catch (err) {
      error.value = err?.message || 'Не удалось удалить товар из корзины'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearCart() {
    items.value = []
    totalPrice.value = 0
    itemsCount.value = 0
    error.value = null
  }

  return {
    items,
    totalPrice,
    itemsCount,
    isLoading,
    error,
    count,
    total,
    isEmpty,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }
}

export default useCartStore

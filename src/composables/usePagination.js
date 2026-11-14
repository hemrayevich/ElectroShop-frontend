import { ref, computed } from 'vue'

export function usePagination(initialPage = 1) {
  const currentPage = ref(initialPage)
  const lastPage = ref(1)
  const total = ref(0)
  const perPage = ref(15)

  const hasNextPage = computed(() => currentPage.value < lastPage.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  function setMeta(meta = {}) {
    if (meta.current_page !== undefined) currentPage.value = Number(meta.current_page)
    if (meta.last_page !== undefined) lastPage.value = Number(meta.last_page)
    if (meta.total !== undefined) total.value = Number(meta.total)
    if (meta.per_page !== undefined) perPage.value = Number(meta.per_page)
  }

  function setPage(page) {
    const p = Math.max(1, Math.min(Number(page), lastPage.value || 1))
    currentPage.value = p
    return p
  }

  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
      return true
    }
    return false
  }

  function prevPage() {
    if (hasPrevPage.value) {
      currentPage.value--
      return true
    }
    return false
  }

  function reset() {
    currentPage.value = 1
    lastPage.value = 1
    total.value = 0
  }

  return {
    currentPage,
    lastPage,
    total,
    perPage,
    hasNextPage,
    hasPrevPage,
    setMeta,
    setPage,
    nextPage,
    prevPage,
    reset,
  }
}

export default usePagination

import { ref, watch } from 'vue'

/**
 * Creates a debounced ref that updates after a specified delay.
 * @param {import('vue').Ref} sourceRef Source ref to watch
 * @param {number} delay Delay in milliseconds (default 400ms)
 * @returns {import('vue').Ref} Debounced ref
 */
export function useDebounce(sourceRef, delay = 400) {
  const debounced = ref(sourceRef.value)
  let timeoutId = null

  watch(sourceRef, (newVal) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  return debounced
}

/**
 * Standard debounce wrapper for functions
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay = 400) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export default useDebounce

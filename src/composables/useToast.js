import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function addToast({ message, type = 'info', duration = 3500 }) {
    const id = nextId++
    const item = { id, message, type }
    toasts.value.push(item)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message, duration = 3500) {
    return addToast({ message, type: 'success', duration })
  }

  function error(message, duration = 4500) {
    return addToast({ message, type: 'error', duration })
  }

  function info(message, duration = 3500) {
    return addToast({ message, type: 'info', duration })
  }

  function warning(message, duration = 4000) {
    return addToast({ message, type: 'warning', duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}

export default useToast

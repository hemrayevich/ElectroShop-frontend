import { ref, computed } from 'vue'
import authService from '@/services/auth'
import profileService from '@/services/profile'
import { registerAuthErrorHandler } from '@/services/http'

// Persistent reactive state singleton
const token = ref(localStorage.getItem('auth_token') || null)
let savedUser = null
try {
  savedUser = JSON.parse(localStorage.getItem('auth_user') || 'null')
} catch {
  savedUser = null
}
const user = ref(savedUser)
const isLoadingProfile = ref(false)
const isInitialized = ref(false)

function saveToStorage(newToken, newUser) {
  if (newToken) {
    localStorage.setItem('auth_token', newToken)
  } else {
    localStorage.removeItem('auth_token')
  }

  if (newUser) {
    localStorage.setItem('auth_user', JSON.stringify(newUser))
  } else {
    localStorage.removeItem('auth_user')
  }
}

function clearAuth() {
  token.value = null
  user.value = null
  saveToStorage(null, null)
}

// Hook into HTTP 401 handler
registerAuthErrorHandler(() => {
  clearAuth()
})

export function useAuthStore() {
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')
  const userAvatar = computed(() => user.value?.avatar || null)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    saveToStorage(newToken, newUser)
  }

  function updateUser(updatedUser) {
    user.value = { ...user.value, ...updatedUser }
    saveToStorage(token.value, user.value)
  }

  async function login(credentials) {
    const res = await authService.login(credentials)
    setAuth(res.token, res.user)
    return res
  }

  async function register(data) {
    const res = await authService.register(data)
    setAuth(res.token, res.user)
    return res
  }

  async function logout() {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch (e) {
      // Ignore network/server errors during logout
      console.warn('Logout error:', e)
    } finally {
      clearAuth()
    }
  }

  async function fetchProfile() {
    if (!token.value) return null
    isLoadingProfile.value = true
    try {
      const res = await profileService.getProfile()
      user.value = res.data
      saveToStorage(token.value, res.data)
      return res.data
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        clearAuth()
      }
      throw err
    } finally {
      isLoadingProfile.value = false
    }
  }

  async function initialize() {
    if (isInitialized.value) return
    isInitialized.value = true
    if (token.value) {
      try {
        await fetchProfile()
      } catch {
        // Handled in fetchProfile
      }
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    userName,
    userAvatar,
    isLoadingProfile,
    isInitialized,
    setAuth,
    updateUser,
    login,
    register,
    logout,
    fetchProfile,
    clearAuth,
    initialize,
  }
}

export default useAuthStore

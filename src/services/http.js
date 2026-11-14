/**
 * HTTP client wrapper over native fetch with automatic headers,
 * token handling, timeout, error normalization, and 401 logout redirect.
 */

export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.message = message
    this.errors = errors
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TIMEOUT_MS = 15000

// Optional callback for auth state cleanup (injected by auth store)
let onUnauthorizedCallback = null
export function registerAuthErrorHandler(fn) {
  onUnauthorizedCallback = fn
}

function buildUrl(path, params) {
  const cleanBase = BASE_URL.replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `${cleanBase}${cleanPath}`

  if (!params || typeof params !== 'object') {
    return url
  }

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  }

  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

function getErrorMessageForStatus(status, serverMessage) {
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim() !== '') {
    // Clean up common English messages for friendly Russian display
    if (serverMessage === 'Unauthenticated.') return 'Требуется авторизация'
    if (serverMessage === 'Invalid email or password.') return 'Неверный email или пароль'
    if (serverMessage === 'Your account has been deactivated.') return 'Доступ запрещен: ваш аккаунт деактивирован'
    return serverMessage
  }

  switch (status) {
    case 400:
      return 'Неверный запрос'
    case 401:
      return 'Требуется авторизация'
    case 403:
      return 'Доступ запрещен. Ваш аккаунт может быть заблокирован'
    case 404:
      return 'Запрашиваемый ресурс не найден'
    case 422:
      return 'Ошибка валидации данных'
    case 429:
      return 'Слишком много запросов. Пожалуйста, подождите минуту'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Внутренняя ошибка сервера. Попробуйте позже'
    default:
      return `Ошибка сервера (${status})`
  }
}

async function request(path, options = {}) {
  const { params, body, isFormData = false, headers = {}, ...restOptions } = options

  const fullUrl = buildUrl(path, params)

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (!isFormData && body && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const token = localStorage.getItem('auth_token')
  if (token && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(fullUrl, {
      ...restOptions,
      headers: requestHeaders,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new ApiError(0, 'Время ожидания ответа от сервера истекло (15 секунд)')
    }
    throw new ApiError(0, 'Нет соединения с сервером. Проверьте подключение к сети')
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (typeof onUnauthorizedCallback === 'function') {
        onUnauthorizedCallback()
      }
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `/login?redirect=${redirect}`
      }
    }

    const message = getErrorMessageForStatus(response.status, data?.message)
    const errors = data?.errors || {}
    throw new ApiError(response.status, message, errors)
  }

  return data
}

export const http = {
  get: (path, params, options = {}) => request(path, { ...options, method: 'GET', params }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  postForm: (path, formData, options = {}) =>
    request(path, { ...options, method: 'POST', body: formData, isFormData: true }),
}

export default http

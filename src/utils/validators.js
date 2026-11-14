/**
 * Form field validator functions.
 * Return null when valid, or an error message string when invalid.
 */

export const required = (message = 'Поле обязательно для заполнения') => (value) => {
  if (value === undefined || value === null) return message
  if (typeof value === 'string' && value.trim() === '') return message
  if (Array.isArray(value) && value.length === 0) return message
  return null
}

export const email = (message = 'Введите корректный email адрес') => (value) => {
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(String(value).trim()) ? null : message
}

export const minLength = (min, message) => (value) => {
  if (!value) return null
  const length = typeof value === 'string' ? value.trim().length : String(value).length
  return length >= min ? null : (message || `Минимум ${min} символов`)
}

export const maxLength = (max, message) => (value) => {
  if (!value) return null
  const length = typeof value === 'string' ? value.trim().length : String(value).length
  return length <= max ? null : (message || `Максимум ${max} символов`)
}

export const pattern = (regex, message = 'Неверный формат') => (value) => {
  if (!value) return null
  return regex.test(String(value)) ? null : message
}

/**
 * Backend rule: Password::min(8)->letters()->numbers()
 */
export const passwordStrength = (message = 'Пароль должен быть не менее 8 символов и содержать буквы и цифры') => (value) => {
  if (!value) return null
  const str = String(value)
  if (str.length < 8) return message
  const hasLetters = /[a-zA-Zа-яА-Я]/.test(str)
  const hasNumbers = /\d/.test(str)
  return hasLetters && hasNumbers ? null : message
}

export const sameAs = (targetFieldName, message = 'Значения не совпадают') => (value, formValues = {}) => {
  if (!value) return null
  return value === formValues[targetFieldName] ? null : message
}

export const numeric = (message = 'Поле должно быть числом') => (value) => {
  if (value === undefined || value === null || value === '') return null
  return !isNaN(Number(value)) ? null : message
}

export const min = (minValue, message) => (value) => {
  if (value === undefined || value === null || value === '') return null
  const num = Number(value)
  return !isNaN(num) && num >= minValue ? null : (message || `Минимальное значение: ${minValue}`)
}

export const max = (maxValue, message) => (value) => {
  if (value === undefined || value === null || value === '') return null
  const num = Number(value)
  return !isNaN(num) && num <= maxValue ? null : (message || `Максимальное значение: ${maxValue}`)
}

export const fileType = (allowedMimes = ['image/jpeg', 'image/png', 'image/webp'], message = 'Разрешены только форматы JPG, PNG, WEBP') => (file) => {
  if (!file) return null
  return allowedMimes.includes(file.type) ? null : message
}

export const fileSize = (maxBytes = 2 * 1024 * 1024, message = 'Размер файла не должен превышать 2 МБ') => (file) => {
  if (!file) return null
  return file.size <= maxBytes ? null : message
}

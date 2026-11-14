/**
 * Currency & date formatting utilities
 */

export const DEFAULT_CURRENCY = '$'

/**
 * Format a numeric price into a currency string (e.g. "$1,299.00" or "$49.90")
 * @param {number|string} amount
 * @param {string} [currency=DEFAULT_CURRENCY]
 * @returns {string}
 */
export function formatPrice(amount, currency = DEFAULT_CURRENCY) {
  const num = Number(amount)
  if (isNaN(num)) return `${currency}0.00`

  return `${currency}${num.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format an ISO date string into a localized Russian date (e.g. "14 ноября 2026")
 * @param {string|Date} dateValue
 * @returns {string}
 */
export function formatDate(dateValue) {
  if (!dateValue) return '—'
  const date = new Date(dateValue)
  if (isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Format an ISO date string into a localized Russian date and time (e.g. "14.11.2026, 15:30")
 * @param {string|Date} dateValue
 * @returns {string}
 */
export function formatDateTime(dateValue) {
  if (!dateValue) return '—'
  const date = new Date(dateValue)
  if (isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format discount percentage badge text (e.g. "-15%")
 * @param {number|string} percent
 * @returns {string}
 */
export function formatDiscount(percent) {
  if (!percent) return ''
  return `-${percent}%`
}

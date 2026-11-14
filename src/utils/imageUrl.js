/**
 * Resolves an image path from the backend to a displayable URL.
 * If the path is already absolute (http://, https://, or data:), returns it as-is.
 * Otherwise, prepends /storage/ so Vite proxy handles it.
 *
 * @param {string|null|undefined} path
 * @param {string} [fallback] Optional fallback image placeholder
 * @returns {string}
 */
export function imageUrl(path, fallback = '') {
  if (!path) return fallback

  const str = String(path).trim()
  if (!str) return fallback

  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
    return str
  }

  if (str.startsWith('/storage/')) {
    return str
  }

  if (str.startsWith('storage/')) {
    return `/${str}`
  }

  return `/storage/${str.replace(/^\/+/, '')}`
}

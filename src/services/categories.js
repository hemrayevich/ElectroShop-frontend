import http from './http'

export const categoriesService = {
  /**
   * Get active categories tree
   * @returns {Promise<{ data: Array }>}
   */
  getCategories() {
    return http.get('/categories')
  },
}

export default categoriesService

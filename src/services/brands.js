import http from './http'

export const brandsService = {
  /**
   * Get all active brands
   * @returns {Promise<{ data: Array }>}
   */
  getBrands() {
    return http.get('/brands')
  },
}

export default brandsService

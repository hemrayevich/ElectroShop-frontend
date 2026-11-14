import http from './http'

export const productsService = {
  /**
   * Get paginated products list with optional filters
   * @param {Object} [params]
   * @param {number|string} [params.category_id]
   * @param {string} [params.category]
   * @param {number|string} [params.brand_id]
   * @param {string} [params.search]
   * @param {number|string} [params.min_price]
   * @param {number|string} [params.max_price]
   * @param {boolean|number} [params.in_stock]
   * @param {boolean|number} [params.discounted]
   * @param {string} [params.sort] 'price_asc' | 'price_desc' | 'newest'
   * @param {number} [params.page]
   * @returns {Promise<{ data: Array, meta: Object, links: Object }>}
   */
  getProducts(params = {}) {
    return http.get('/products', params)
  },

  /**
   * Get single product by ID or slug
   * @param {number|string} idOrSlug
   * @returns {Promise<{ data: Object }>}
   */
  getProduct(idOrSlug) {
    return http.get(`/products/${idOrSlug}`)
  },
}

export default productsService

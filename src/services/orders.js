import http from './http'

export const ordersService = {
  /**
   * Get user's orders (paginated)
   * @param {number} [page=1]
   * @returns {Promise<{ data: Array, meta: Object, links: Object }>}
   */
  getOrders(page = 1) {
    return http.get('/orders', { page })
  },

  /**
   * Get single order details
   * @param {number} id
   * @returns {Promise<{ data: Object }>}
   */
  getOrder(id) {
    return http.get(`/orders/${id}`)
  },

  /**
   * Checkout cart into an order
   * @param {Object} data { shipping_address, phone, note }
   * @returns {Promise<{ message: string, data: Object }>}
   */
  createOrder(data) {
    return http.post('/orders', data)
  },

  /**
   * Cancel pending order
   * @param {number} id
   * @returns {Promise<{ message: string, data: Object }>}
   */
  cancelOrder(id) {
    return http.post(`/orders/${id}/cancel`)
  },
}

export default ordersService

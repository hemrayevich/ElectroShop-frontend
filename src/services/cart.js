import http from './http'

export const cartService = {
  /**
   * Get current user cart
   * @returns {Promise<{ data: Array, total_price: number, items_count: number }>}
   */
  getCart() {
    return http.get('/cart')
  },

  /**
   * Add product to cart
   * @param {number} productId
   * @param {number} [quantity=1]
   * @returns {Promise<{ message: string, data: Object }>}
   */
  addToCart(productId, quantity = 1) {
    return http.post('/cart', {
      product_id: Number(productId),
      quantity: Number(quantity),
    })
  },

  /**
   * Update quantity of a cart item
   * @param {number} cartItemId
   * @param {number} quantity
   * @returns {Promise<{ message: string, data: Object }>}
   */
  updateCartItem(cartItemId, quantity) {
    return http.put(`/cart/${cartItemId}`, {
      quantity: Number(quantity),
    })
  },

  /**
   * Remove item from cart
   * @param {number} cartItemId
   * @returns {Promise<{ message: string }>}
   */
  removeCartItem(cartItemId) {
    return http.del(`/cart/${cartItemId}`)
  },
}

export default cartService

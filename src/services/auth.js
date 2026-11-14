import http from './http'

export const authService = {
  /**
   * Register a new customer
   * @param {Object} data { name, email, password, password_confirmation, phone, address }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  register(data) {
    return http.post('/register', data)
  },

  /**
   * Log in customer
   * @param {Object} credentials { email, password }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  login(credentials) {
    return http.post('/login', credentials)
  },

  /**
   * Log out authenticated user
   * @returns {Promise<{ message: string }>}
   */
  logout() {
    return http.post('/logout')
  },
}

export default authService

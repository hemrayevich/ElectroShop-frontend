import http from './http'

export const profileService = {
  /**
   * Get current user profile
   * @returns {Promise<{ data: Object }>}
   */
  getProfile() {
    return http.get('/profile')
  },

  /**
   * Update name, phone, address
   * @param {Object} data { name, phone, address }
   * @returns {Promise<{ data: Object }>}
   */
  updateProfile(data) {
    return http.put('/profile', data)
  },

  /**
   * Upload user avatar (max 2MB, jpg/png/webp)
   * @param {File} avatarFile
   * @returns {Promise<{ data: Object }>}
   */
  uploadAvatar(avatarFile) {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    return http.postForm('/profile/avatar', formData)
  },

  /**
   * Update account password
   * @param {Object} data { current_password, password, password_confirmation }
   * @returns {Promise<{ message: string }>}
   */
  updatePassword(data) {
    return http.put('/profile/password', data)
  },
}

export default profileService

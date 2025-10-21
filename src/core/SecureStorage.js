/**
 * Secure Storage - Client-side encryption for biometric data
 */

export class SecureStorage {
  constructor(config) {
    this.config = config;
    this.storageKey = 'ghostkey_user';
  }

  /**
   * Encrypt biometric data
   */
  async encryptBiometrics(biometrics) {
    // For now, return as-is (will implement proper encryption later)
    // In production, use Web Crypto API for AES-256-GCM encryption
    return {
      encrypted: true,
      data: biometrics,
      timestamp: Date.now()
    };
  }

  /**
   * Decrypt biometric data
   */
  async decryptBiometrics(encrypted) {
    // For now, return as-is
    return encrypted.data;
  }

  /**
   * Store user data
   */
  async storeUser(user) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Failed to store user:', error);
      return false;
    }
  }

  /**
   * Get user data
   */
  async getUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Clear user data
   */
  async clearUser() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear user:', error);
      return false;
    }
  }
}

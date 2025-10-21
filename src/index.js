/**
 * Ghost Key SDK - Main Entry Point
 * Production-grade biometric authentication for web applications
 */

import GhostKey from './core/GhostKeyAuth.js';
export { BiometricCapture } from './core/BiometricCapture.js';
export { SecureStorage } from './core/SecureStorage.js';
export { UIManager } from './core/UIManager.js';
export { FormDetector } from './core/FormDetector.js';

// Default export
export default GhostKey;

// Named export for convenience
export { GhostKey };

// Version
export const VERSION = '1.0.0';

// For browser global
if (typeof window !== 'undefined') {
  window.GhostKey = GhostKey;
}

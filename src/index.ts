/**
 * Ghost Key SDK - Main Entry Point
 * Production-grade biometric authentication for web applications
 * 
 * @packageDocumentation
 */

export { default as GhostKey } from './core/GhostKeyAuth';
export { BiometricCapture } from './core/BiometricCapture';
export { SecureStorage } from './core/SecureStorage';

// Re-export biometric libraries
export { default as GhostVoice } from './biometrics/GhostVoice';
export { default as GhostEncoder } from './biometrics/GhostEncoder';
export { default as GhostSecurity } from './biometrics/GhostSecurity';

// Types
export * from './types';

// Version
export const VERSION = '1.0.0';

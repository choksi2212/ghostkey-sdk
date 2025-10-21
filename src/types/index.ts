/**
 * Ghost Key SDK - Type Definitions
 */

export interface GhostKeyConfig {
  /** API key for authentication */
  apiKey: string;
  
  /** API endpoint (default: https://api.ghostkey.io) */
  endpoint?: string;
  
  /** Biometric settings */
  biometrics?: {
    keystroke?: boolean;
    voice?: boolean;
    behavioral?: boolean;
  };
  
  /** Authentication settings */
  auth?: {
    minConfidence?: number;
    maxAttempts?: number;
    requireVoice?: boolean;
    sessionDuration?: number;
  };
  
  /** UI settings */
  ui?: {
    theme?: 'light' | 'dark' | 'auto';
    position?: 'center' | 'top' | 'bottom';
    customCSS?: string | null;
    showConfidence?: boolean;
    showProgress?: boolean;
    language?: string;
  };
  
  /** Security settings */
  security?: {
    encryption?: string;
    zeroKnowledge?: boolean;
    localStorageEncryption?: boolean;
  };
  
  /** Callbacks */
  onSuccess?: (user: User) => void;
  onFailure?: (error: AuthError) => void;
  onEnrollment?: (status: EnrollmentStatus) => void;
  onProgress?: (progress: number) => void;
}

export interface AuthOptions {
  username: string;
  password: string;
  biometrics?: {
    keystroke?: boolean;
    voice?: boolean;
  };
  options?: {
    minConfidence?: number;
    requireVoice?: boolean;
  };
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  confidence?: number;
  error?: AuthError;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profiles: BiometricProfile[];
  createdAt: string;
  lastLogin?: string;
}

export interface BiometricProfile {
  id: string;
  name: string;
  type: 'keystroke' | 'voice' | 'behavioral';
  enrolled: boolean;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface EnrollmentStatus {
  type: 'keystroke' | 'voice';
  progress: number;
  samplesCollected: number;
  samplesRequired: number;
  complete: boolean;
}

export interface VoiceAuthOptions {
  username: string;
  passphrase: string;
}

export interface EnrollKeystrokeOptions {
  username: string;
  samples?: number;
}

export interface EnrollVoiceOptions {
  username: string;
  passphrase: string;
  samples?: number;
}

export interface FormCallbacks {
  onSuccess?: (user: User) => void;
  onFailure?: (error: AuthError) => void;
}

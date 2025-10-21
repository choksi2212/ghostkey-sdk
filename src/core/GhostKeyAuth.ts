/**
 * Ghost Key Auth - Main SDK Class
 * Seamless biometric authentication with zero UI layers
 */

import { GhostKeyConfig, AuthResult, User } from '../types';
import { BiometricCapture } from './BiometricCapture';
import { SecureStorage } from './SecureStorage';
import { UIManager } from './UIManager';
import { FormDetector } from './FormDetector';

export default class GhostKey {
  private config: GhostKeyConfig;
  private biometricCapture: BiometricCapture;
  private secureStorage: SecureStorage;
  private uiManager: UIManager;
  private formDetector: FormDetector;
  private currentUser: User | null = null;

  constructor(config: GhostKeyConfig) {
    this.config = {
      endpoint: 'https://api.ghostkey.io',
      biometrics: {
        keystroke: true,
        voice: true,
        behavioral: false
      },
      auth: {
        minConfidence: 0.85,
        maxAttempts: 3,
        requireVoice: false,
        sessionDuration: 3600
      },
      ui: {
        theme: 'auto',
        position: 'bottom-right',
        customCSS: null,
        showConfidence: false,
        showProgress: true,
        language: 'en'
      },
      security: {
        encryption: 'AES-256-GCM',
        zeroKnowledge: true,
        localStorageEncryption: true
      },
      ...config
    };

    this.biometricCapture = new BiometricCapture(this.config);
    this.secureStorage = new SecureStorage(this.config);
    this.uiManager = new UIManager(this.config);
    this.formDetector = new FormDetector(this.config);

    this.initialize();
  }

  /**
   * Initialize Ghost Key
   */
  private async initialize(): Promise<void> {
    console.log('🔐 Ghost Key initializing...');

    // Load user session if exists
    this.currentUser = await this.secureStorage.getUser();

    // Start form detection if in auto mode
    if (this.config.mode === 'auto') {
      this.formDetector.start((field, type) => {
        this.handleFormDetected(field, type);
      });
    }

    console.log('✅ Ghost Key initialized');
  }

  /**
   * Handle detected form
   */
  private handleFormDetected(field: HTMLInputElement, type: 'registration' | 'login'): void {
    if (type === 'registration') {
      this.setupRegistrationFlow(field);
    } else {
      this.setupLoginFlow(field);
    }
  }

  /**
   * Setup registration flow
   */
  private setupRegistrationFlow(field: HTMLInputElement): void {
    let sampleCount = 0;
    const totalSamples = 5;
    const keystrokeSamples: any[] = [];

    // Show initial toast
    this.uiManager.showToast({
      type: 'info',
      message: 'Ghost Key Active',
      subtitle: `Type your password ${totalSamples} times`,
      progress: { current: 0, total: totalSamples }
    });

    // Highlight field
    this.uiManager.highlightField(field);

    // Capture keystroke samples
    const captureHandler = async (e: KeyboardEvent) => {
      if (e.key === 'Enter' && sampleCount < totalSamples) {
        e.preventDefault();

        // Capture this sample
        const sample = this.biometricCapture.captureKeystrokeSample(field);
        keystrokeSamples.push(sample);
        sampleCount++;

        // Update UI
        this.uiManager.showToast({
          type: 'info',
          message: 'Ghost Key Active',
          subtitle: sampleCount < totalSamples ? 'Type your password again' : 'Keystroke samples complete!',
          progress: { current: sampleCount, total: totalSamples }
        });

        // Clear field for next sample
        if (sampleCount < totalSamples) {
          field.value = '';
        } else {
          // All keystroke samples collected
          field.removeEventListener('keydown', captureHandler);
          await this.completeRegistration(field, keystrokeSamples);
        }
      }
    };

    field.addEventListener('keydown', captureHandler);
  }

  /**
   * Complete registration with voice enrollment
   */
  private async completeRegistration(field: HTMLInputElement, keystrokeSamples: any[]): Promise<void> {
    // Show voice enrollment modal
    const voiceResult = await this.uiManager.showVoiceEnrollmentModal({
      passphrase: "I'll Always Choose You",
      samples: 3
    });

    if (voiceResult.success) {
      // Train models
      const keystrokeModel = await this.biometricCapture.trainKeystrokeModel(keystrokeSamples);
      const voiceProfile = voiceResult.profile;

      // Encrypt and store
      const encrypted = await this.secureStorage.encryptBiometrics({
        keystroke: keystrokeModel,
        voice: voiceProfile
      });

      // Send to backend
      const response = await this.sendToBackend({
        type: 'register',
        biometrics: encrypted
      });

      if (response.success) {
        this.uiManager.showToast({
          type: 'success',
          message: 'Registration Complete!',
          subtitle: 'Redirecting...'
        });

        // Call success callback
        if (this.config.onSuccess) {
          this.config.onSuccess(response.user);
        }

        // Auto-submit form
        setTimeout(() => {
          const form = field.closest('form');
          if (form) {
            form.submit();
          }
        }, 1000);
      }
    }
  }

  /**
   * Setup login flow
   */
  private setupLoginFlow(field: HTMLInputElement): void {
    let failureCount = 0;

    // Show toast
    this.uiManager.showToast({
      type: 'info',
      message: 'Ghost Key Active',
      subtitle: 'Type your password naturally'
    });

    // Highlight field
    this.uiManager.highlightField(field);

    // Capture and authenticate
    const authHandler = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        // Capture keystroke
        const keystrokeData = this.biometricCapture.captureKeystrokeSample(field);

        // Authenticate
        const result = await this.authenticateKeystroke(keystrokeData);

        if (result.success && result.confidence! >= this.config.auth!.minConfidence!) {
          // Success!
          this.uiManager.showToast({
            type: 'success',
            message: 'Authenticated!',
            subtitle: `Confidence: ${Math.round(result.confidence! * 100)}%`
          });

          field.removeEventListener('keydown', authHandler);

          // Auto-submit form
          setTimeout(() => {
            const form = field.closest('form');
            if (form) {
              form.submit();
            }
          }, 500);
        } else {
          // Failed
          failureCount++;

          if (failureCount >= 2) {
            // Trigger voice auth
            field.removeEventListener('keydown', authHandler);
            await this.triggerVoiceAuth(field);
          } else {
            // Show retry message
            this.uiManager.showToast({
              type: 'warning',
              message: 'Authentication Failed',
              subtitle: `Attempt ${failureCount}/2 - Try again`
            });

            // Clear field
            field.value = '';
          }
        }
      }
    };

    field.addEventListener('keydown', authHandler);
  }

  /**
   * Trigger voice authentication
   */
  private async triggerVoiceAuth(field: HTMLInputElement): Promise<void> {
    this.uiManager.showToast({
      type: 'warning',
      message: 'Keystroke Auth Failed (2/2)',
      subtitle: 'Voice verification required'
    });

    let voiceFailures = 0;
    const maxVoiceAttempts = 4;

    while (voiceFailures < maxVoiceAttempts) {
      const voiceResult = await this.uiManager.showVoiceAuthModal({
        passphrase: "I'll Always Choose You",
        attemptsRemaining: maxVoiceAttempts - voiceFailures
      });

      if (voiceResult.success) {
        // Authenticate voice
        const authResult = await this.authenticateVoice(voiceResult.voiceData);

        if (authResult.success) {
          // Success!
          this.uiManager.showToast({
            type: 'success',
            message: 'Voice Authenticated!',
            subtitle: `Similarity: ${Math.round(authResult.confidence! * 100)}%`
          });

          // Auto-submit form
          setTimeout(() => {
            const form = field.closest('form');
            if (form) {
              form.submit();
            }
          }, 500);
          return;
        } else {
          voiceFailures++;
        }
      } else {
        voiceFailures++;
      }

      if (voiceFailures < maxVoiceAttempts) {
        this.uiManager.showToast({
          type: 'error',
          message: 'Voice Auth Failed',
          subtitle: `Attempts remaining: ${maxVoiceAttempts - voiceFailures}`
        });
      }
    }

    // All attempts failed - close tab
    this.closeTab();
  }

  /**
   * Close tab after failed authentication
   */
  private closeTab(): void {
    this.uiManager.showBlockedOverlay({
      message: 'Too many failed authentication attempts',
      countdown: 3
    });

    setTimeout(() => {
      window.close();
    }, 3000);
  }

  /**
   * Authenticate keystroke
   */
  private async authenticateKeystroke(keystrokeData: any): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/v1/auth/verify/keystroke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({ keystrokeData })
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: { code: 'NETWORK_ERROR', message: 'Failed to authenticate' } };
    }
  }

  /**
   * Authenticate voice
   */
  private async authenticateVoice(voiceData: any): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/v1/auth/verify/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({ voiceData })
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: { code: 'NETWORK_ERROR', message: 'Failed to authenticate' } };
    }
  }

  /**
   * Send data to backend
   */
  private async sendToBackend(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.config.endpoint}/api/v1/auth/${data.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(data)
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Public API: Attach to form manually
   */
  public attachToForm(selector: string, callbacks?: any): void {
    const field = document.querySelector(selector) as HTMLInputElement;
    if (!field) {
      console.error('Ghost Key: Field not found:', selector);
      return;
    }

    const form = field.closest('form');
    const isRegistration = this.formDetector.isRegistrationForm(form);

    if (isRegistration) {
      this.setupRegistrationFlow(field);
    } else {
      this.setupLoginFlow(field);
    }
  }

  /**
   * Public API: Get current user
   */
  public async getUser(): Promise<User | null> {
    return this.currentUser;
  }

  /**
   * Public API: Logout
   */
  public async logout(): Promise<void> {
    await this.secureStorage.clearUser();
    this.currentUser = null;
  }
}

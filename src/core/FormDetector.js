/**
 * Form Detector - Automatically detects password fields
 */

export class FormDetector {
  constructor(config) {
    this.config = config;
    this.observer = null;
    this.attachedFields = new Set();
  }

  /**
   * Start detecting forms
   */
  start(callback) {
    // Scan existing forms
    this.scanForForms(callback);

    // Watch for new forms (SPA support)
    this.observer = new MutationObserver(() => {
      this.scanForForms(callback);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['type', 'name', 'id', 'class']
    });
  }

  /**
   * Stop detecting forms
   */
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Scan for password fields
   */
  scanForForms(callback) {
    const passwordFields = document.querySelectorAll('input[type="password"]');

    passwordFields.forEach(field => {
      // Skip if already attached
      if (this.attachedFields.has(field)) {
        return;
      }

      // Skip if hidden
      if (!this.isVisible(field)) {
        return;
      }

      // Determine if registration or login
      const form = field.closest('form');
      const type = this.isRegistrationForm(form) ? 'registration' : 'login';

      // Mark as attached
      this.attachedFields.add(field);

      // Call callback
      callback(field, type);
    });
  }

  /**
   * Check if form is registration
   */
  isRegistrationForm(form) {
    if (!form) {
      return false;
    }

    // Check form attributes
    const formHTML = form.outerHTML.toLowerCase();
    const registrationIndicators = [
      'signup', 'sign-up', 'sign_up',
      'register', 'registration',
      'create-account', 'create_account',
      'new-account', 'new_account',
      'join'
    ];

    // Check if any indicator is present
    const hasIndicator = registrationIndicators.some(indicator => 
      formHTML.includes(indicator)
    );

    if (hasIndicator) {
      return true;
    }

    // Check for confirm password field (strong indicator of registration)
    const confirmPasswordFields = form.querySelectorAll(
      'input[type="password"][name*="confirm"], ' +
      'input[type="password"][id*="confirm"], ' +
      'input[type="password"][name*="repeat"], ' +
      'input[type="password"][id*="repeat"]'
    );

    if (confirmPasswordFields.length > 0) {
      return true;
    }

    // Check for email field (weak indicator, but combined with password suggests registration)
    const emailFields = form.querySelectorAll('input[type="email"]');
    const passwordFields = form.querySelectorAll('input[type="password"]');

    if (emailFields.length > 0 && passwordFields.length > 1) {
      return true;
    }

    return false;
  }

  /**
   * Check if element is visible
   */
  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetParent !== null;
  }
}

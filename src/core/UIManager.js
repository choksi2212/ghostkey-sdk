/**
 * UI Manager - Handles all UI components (toasts, modals, highlights)
 * Zero UI layers, minimal and beautiful
 */

export class UIManager {
  constructor(config) {
    this.config = config;
    this.activeToast = null;
    this.activeModal = null;
    this.injectStyles();
  }

  /**
   * Inject Ghost Key styles
   */
  injectStyles() {
    if (document.getElementById('ghostkey-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'ghostkey-styles';
    styles.textContent = `
      /* Field Highlight */
      .ghostkey-field-active {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
        border-color: #3b82f6 !important;
        transition: all 0.3s ease;
      }

      /* Toast Notification */
      .ghostkey-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 20px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 999999;
        animation: ghostkey-slide-in 0.3s ease;
        max-width: 320px;
      }

      .ghostkey-toast-success {
        background: rgba(16, 185, 129, 0.95);
      }

      .ghostkey-toast-error {
        background: rgba(239, 68, 68, 0.95);
      }

      .ghostkey-toast-warning {
        background: rgba(245, 158, 11, 0.95);
      }

      .ghostkey-toast-title {
        font-weight: 600;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ghostkey-toast-subtitle {
        font-size: 12px;
        opacity: 0.9;
      }

      .ghostkey-toast-progress {
        margin-top: 8px;
        display: flex;
        gap: 4px;
      }

      .ghostkey-toast-progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
      }

      .ghostkey-toast-progress-dot.active {
        background: white;
      }

      /* Modal Overlay */
      .ghostkey-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000000;
        animation: ghostkey-fade-in 0.3s ease;
      }

      /* Modal */
      .ghostkey-modal {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 440px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: ghostkey-scale-in 0.3s ease;
      }

      .ghostkey-modal-header {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .ghostkey-modal-body {
        margin-bottom: 24px;
      }

      .ghostkey-modal-phrase {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin: 16px 0;
      }

      .ghostkey-modal-status {
        text-align: center;
        padding: 12px;
        border-radius: 8px;
        margin: 16px 0;
        font-weight: 500;
      }

      .ghostkey-modal-status.recording {
        background: #fee2e2;
        color: #dc2626;
      }

      .ghostkey-modal-status.ready {
        background: #dbeafe;
        color: #2563eb;
      }

      .ghostkey-modal-status.complete {
        background: #d1fae5;
        color: #059669;
      }

      .ghostkey-modal-progress {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin: 16px 0;
      }

      .ghostkey-modal-progress-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #e5e7eb;
      }

      .ghostkey-modal-progress-dot.active {
        background: #3b82f6;
      }

      .ghostkey-modal-footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .ghostkey-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .ghostkey-btn-primary {
        background: #3b82f6;
        color: white;
      }

      .ghostkey-btn-primary:hover {
        background: #2563eb;
      }

      .ghostkey-btn-secondary {
        background: #e5e7eb;
        color: #1f2937;
      }

      .ghostkey-btn-secondary:hover {
        background: #d1d5db;
      }

      .ghostkey-btn-success {
        background: #10b981;
        color: white;
      }

      .ghostkey-btn-success:hover {
        background: #059669;
      }

      .ghostkey-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Blocked Overlay */
      .ghostkey-blocked-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000001;
        animation: ghostkey-fade-in 0.3s ease;
      }

      .ghostkey-blocked-content {
        text-align: center;
        color: white;
      }

      .ghostkey-blocked-icon {
        font-size: 64px;
        margin-bottom: 24px;
      }

      .ghostkey-blocked-title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .ghostkey-blocked-message {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 32px;
      }

      .ghostkey-blocked-countdown {
        font-size: 48px;
        font-weight: 700;
        color: #ef4444;
      }

      /* Animations */
      @keyframes ghostkey-slide-in {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes ghostkey-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes ghostkey-scale-in {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Highlight password field
   */
  highlightField(field) {
    field.classList.add('ghostkey-field-active');
  }

  /**
   * Remove field highlight
   */
  unhighlightField(field) {
    field.classList.remove('ghostkey-field-active');
  }

  /**
   * Show toast notification
   */
  showToast({ type = 'info', message, subtitle, progress }) {
    // Remove existing toast
    if (this.activeToast) {
      this.activeToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `ghostkey-toast ghostkey-toast-${type}`;

    let html = `
      <div class="ghostkey-toast-title">
        ${this.getIcon(type)} ${message}
      </div>
    `;

    if (subtitle) {
      html += `<div class="ghostkey-toast-subtitle">${subtitle}</div>`;
    }

    if (progress) {
      html += '<div class="ghostkey-toast-progress">';
      for (let i = 0; i < progress.total; i++) {
        const active = i < progress.current ? 'active' : '';
        html += `<div class="ghostkey-toast-progress-dot ${active}"></div>`;
      }
      html += '</div>';
    }

    toast.innerHTML = html;
    document.body.appendChild(toast);
    this.activeToast = toast;

    return toast;
  }

  /**
   * Hide toast
   */
  hideToast() {
    if (this.activeToast) {
      this.activeToast.remove();
      this.activeToast = null;
    }
  }

  /**
   * Show voice enrollment modal
   */
  async showVoiceEnrollmentModal({ passphrase, samples }) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'ghostkey-modal-overlay';

      let currentSample = 0;
      const voiceSamples = [];
      let isRecording = false;
      let mediaRecorder = null;
      let audioChunks = [];

      const updateModal = () => {
        const modal = overlay.querySelector('.ghostkey-modal');
        const statusDiv = modal.querySelector('.ghostkey-modal-status');
        const progressDiv = modal.querySelector('.ghostkey-modal-progress');
        const recordBtn = modal.querySelector('.ghostkey-btn-record');
        const completeBtn = modal.querySelector('.ghostkey-btn-complete');

        // Update progress dots
        progressDiv.innerHTML = '';
        for (let i = 0; i < samples; i++) {
          const dot = document.createElement('div');
          dot.className = `ghostkey-modal-progress-dot ${i < currentSample ? 'active' : ''}`;
          progressDiv.appendChild(dot);
        }

        // Update status
        if (currentSample >= samples) {
          statusDiv.className = 'ghostkey-modal-status complete';
          statusDiv.textContent = '✓ All samples recorded!';
          recordBtn.style.display = 'none';
          completeBtn.disabled = false;
        } else if (isRecording) {
          statusDiv.className = 'ghostkey-modal-status recording';
          statusDiv.textContent = '🔴 Recording...';
        } else {
          statusDiv.className = 'ghostkey-modal-status ready';
          statusDiv.textContent = `Ready to record (${currentSample}/${samples})`;
        }
      };

      overlay.innerHTML = `
        <div class="ghostkey-modal">
          <div class="ghostkey-modal-header">
            🎤 Voice Verification
          </div>
          <div class="ghostkey-modal-body">
            <p>Speak this phrase ${samples} times:</p>
            <div class="ghostkey-modal-phrase">"${passphrase}"</div>
            <div class="ghostkey-modal-status ready">Ready to record</div>
            <div class="ghostkey-modal-progress"></div>
          </div>
          <div class="ghostkey-modal-footer">
            <button class="ghostkey-btn ghostkey-btn-secondary ghostkey-btn-skip">Skip</button>
            <button class="ghostkey-btn ghostkey-btn-primary ghostkey-btn-record">🎤 Record</button>
            <button class="ghostkey-btn ghostkey-btn-success ghostkey-btn-complete" disabled>Complete</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.activeModal = overlay;

      updateModal();

      // Record button
      overlay.querySelector('.ghostkey-btn-record').addEventListener('click', async () => {
        if (isRecording) {
          // Stop recording
          mediaRecorder.stop();
          isRecording = false;
        } else {
          // Start recording
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
              audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              voiceSamples.push(audioBlob);
              currentSample++;
              stream.getTracks().forEach(track => track.stop());
              updateModal();
            };

            mediaRecorder.start();
            isRecording = true;
            updateModal();

            overlay.querySelector('.ghostkey-btn-record').textContent = 'Stop Recording';
          } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Please allow microphone access to continue');
          }
        }
      });

      // Skip button
      overlay.querySelector('.ghostkey-btn-skip').addEventListener('click', () => {
        overlay.remove();
        this.activeModal = null;
        resolve({ success: false });
      });

      // Complete button
      overlay.querySelector('.ghostkey-btn-complete').addEventListener('click', () => {
        overlay.remove();
        this.activeModal = null;
        resolve({ success: true, profile: voiceSamples });
      });
    });
  }

  /**
   * Show voice authentication modal
   */
  async showVoiceAuthModal({ passphrase, attemptsRemaining }) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'ghostkey-modal-overlay';

      let isRecording = false;
      let mediaRecorder = null;
      let audioChunks = [];
      let voiceData = null;

      overlay.innerHTML = `
        <div class="ghostkey-modal">
          <div class="ghostkey-modal-header">
            🎤 Voice Authentication
          </div>
          <div class="ghostkey-modal-body">
            <p>Speak your passphrase:</p>
            <div class="ghostkey-modal-phrase">"${passphrase}"</div>
            <div class="ghostkey-modal-status ready">Ready to record</div>
            <p style="text-align: center; margin-top: 16px; color: #ef4444; font-weight: 600;">
              Attempts remaining: ${attemptsRemaining}
            </p>
          </div>
          <div class="ghostkey-modal-footer">
            <button class="ghostkey-btn ghostkey-btn-primary ghostkey-btn-record">🎤 Record</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.activeModal = overlay;

      const statusDiv = overlay.querySelector('.ghostkey-modal-status');
      const recordBtn = overlay.querySelector('.ghostkey-btn-record');

      recordBtn.addEventListener('click', async () => {
        if (isRecording) {
          // Stop recording
          mediaRecorder.stop();
          isRecording = false;
          recordBtn.textContent = '🎤 Record';
          statusDiv.className = 'ghostkey-modal-status ready';
          statusDiv.textContent = 'Processing...';
        } else {
          // Start recording
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
              audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              voiceData = audioBlob;
              stream.getTracks().forEach(track => track.stop());
              
              // Auto-submit after recording
              setTimeout(() => {
                overlay.remove();
                this.activeModal = null;
                resolve({ success: true, voiceData });
              }, 500);
            };

            mediaRecorder.start();
            isRecording = true;
            recordBtn.textContent = 'Stop Recording';
            statusDiv.className = 'ghostkey-modal-status recording';
            statusDiv.textContent = '🔴 Recording...';
          } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Please allow microphone access to continue');
          }
        }
      });
    });
  }

  /**
   * Show blocked overlay
   */
  showBlockedOverlay({ message, countdown }) {
    const overlay = document.createElement('div');
    overlay.className = 'ghostkey-blocked-overlay';

    overlay.innerHTML = `
      <div class="ghostkey-blocked-content">
        <div class="ghostkey-blocked-icon">🚫</div>
        <div class="ghostkey-blocked-title">Access Denied</div>
        <div class="ghostkey-blocked-message">${message}</div>
        <div class="ghostkey-blocked-countdown">${countdown}</div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Countdown
    let remaining = countdown;
    const countdownEl = overlay.querySelector('.ghostkey-blocked-countdown');
    const interval = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  /**
   * Get icon for toast type
   */
  getIcon(type) {
    const icons = {
      info: '🔐',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || icons.info;
  }
}

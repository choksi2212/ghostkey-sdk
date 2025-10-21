/**
 * Biometric Capture - Captures keystroke and voice biometrics
 */

export class BiometricCapture {
  constructor(config) {
    this.config = config;
    this.keystrokeBuffer = [];
    this.startTime = null;
  }

  /**
   * Capture keystroke sample
   */
  captureKeystrokeSample(field) {
    const password = field.value;
    const features = this.extractKeystrokeFeatures(this.keystrokeBuffer);
    
    // Clear buffer for next sample
    this.keystrokeBuffer = [];
    
    return {
      password,
      features,
      timestamp: Date.now()
    };
  }

  /**
   * Start capturing keystrokes
   */
  startKeystrokeCapture(field) {
    this.keystrokeBuffer = [];
    this.startTime = performance.now();

    const keydownHandler = (e) => {
      this.keystrokeBuffer.push({
        key: e.key,
        type: 'keydown',
        timestamp: performance.now() - this.startTime,
        keyCode: e.keyCode
      });
    };

    const keyupHandler = (e) => {
      this.keystrokeBuffer.push({
        key: e.key,
        type: 'keyup',
        timestamp: performance.now() - this.startTime,
        keyCode: e.keyCode
      });
    };

    field.addEventListener('keydown', keydownHandler);
    field.addEventListener('keyup', keyupHandler);

    return {
      stop: () => {
        field.removeEventListener('keydown', keydownHandler);
        field.removeEventListener('keyup', keyupHandler);
      }
    };
  }

  /**
   * Extract keystroke features
   */
  extractKeystrokeFeatures(buffer) {
    const features = [];
    
    // Calculate dwell times (time key is held down)
    const dwellTimes = [];
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i].type === 'keydown' && buffer[i + 1].type === 'keyup' && 
          buffer[i].key === buffer[i + 1].key) {
        dwellTimes.push(buffer[i + 1].timestamp - buffer[i].timestamp);
      }
    }

    // Calculate flight times (time between key releases)
    const flightTimes = [];
    const keyupEvents = buffer.filter(e => e.type === 'keyup');
    for (let i = 0; i < keyupEvents.length - 1; i++) {
      flightTimes.push(keyupEvents[i + 1].timestamp - keyupEvents[i].timestamp);
    }

    // Combine features
    features.push(...dwellTimes);
    features.push(...flightTimes);

    // Calculate statistics
    if (dwellTimes.length > 0) {
      features.push(this.mean(dwellTimes));
      features.push(this.std(dwellTimes));
    }

    if (flightTimes.length > 0) {
      features.push(this.mean(flightTimes));
      features.push(this.std(flightTimes));
    }

    // Normalize to fixed length
    const targetLength = 100;
    while (features.length < targetLength) {
      features.push(0);
    }

    return features.slice(0, targetLength);
  }

  /**
   * Train keystroke model from samples
   */
  async trainKeystrokeModel(samples) {
    // Extract features from all samples
    const allFeatures = samples.map(sample => sample.features);
    
    // Calculate mean and std for each feature
    const numFeatures = allFeatures[0].length;
    const means = [];
    const stds = [];

    for (let i = 0; i < numFeatures; i++) {
      const values = allFeatures.map(features => features[i]);
      means.push(this.mean(values));
      stds.push(this.std(values));
    }

    return {
      means,
      stds,
      samples: allFeatures,
      password: samples[0].password,
      timestamp: Date.now()
    };
  }

  /**
   * Compare keystroke with model
   */
  compareKeystroke(features, model) {
    if (!model || !model.means) {
      return { similarity: 0, confidence: 0 };
    }

    // Calculate Euclidean distance
    let distance = 0;
    for (let i = 0; i < features.length; i++) {
      const diff = (features[i] - model.means[i]) / (model.stds[i] + 0.0001);
      distance += diff * diff;
    }
    distance = Math.sqrt(distance / features.length);

    // Convert to similarity (0-1)
    const similarity = Math.max(0, 1 - distance / 10);
    const confidence = similarity;

    return { similarity, confidence };
  }

  /**
   * Calculate mean
   */
  mean(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Calculate standard deviation
   */
  std(values) {
    if (values.length === 0) return 0;
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }
}

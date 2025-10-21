# 🔐 Ghost Key SDK

**Production-grade biometric authentication for web applications**

Add keystroke dynamics and voice biometrics to your app in just 5 lines of code.

[![npm version](https://img.shields.io/npm/v/@ghostkey/sdk.svg)](https://www.npmjs.com/package/@ghostkey/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- 🔐 **Keystroke Dynamics** - Authenticate users by typing patterns
- 🎤 **Voice Biometrics** - Voice-based authentication
- 🛡️ **Military-Grade Security** - AES-256-GCM encryption
- ⚡ **Lightning Fast** - <100ms authentication
- 📦 **Zero Dependencies** - 100% in-house libraries
- 🎨 **Framework Agnostic** - Works with React, Vue, Angular, vanilla JS
- 🌐 **Privacy-First** - Zero-knowledge architecture
- 📱 **Mobile Ready** - Works on all devices

---

## 🚀 Quick Start

### Installation

```bash
npm install @ghostkey/sdk
```

### Basic Usage

```javascript
import GhostKey from '@ghostkey/sdk';

// Initialize
const ghostKey = new GhostKey({
  apiKey: 'gk_live_your_api_key',
  endpoint: 'https://api.ghostkey.io'
});

// Attach to login form
ghostKey.attachToForm('#login-form', {
  onSuccess: (user) => {
    console.log('Authenticated:', user);
    window.location.href = '/dashboard';
  },
  onFailure: (error) => {
    console.error('Authentication failed:', error);
  }
});
```

That's it! Your login form now has biometric authentication. 🎉

---

## 📚 Framework Integrations

### React

```jsx
import { GhostKeyProvider, useGhostKey } from '@ghostkey/react';

function App() {
  return (
    <GhostKeyProvider apiKey="gk_live_...">
      <LoginForm />
    </GhostKeyProvider>
  );
}

function LoginForm() {
  const { authenticate, isLoading } = useGhostKey();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authenticate({
      username: e.target.username.value,
      password: e.target.password.value
    });
    
    if (result.success) {
      // Redirect to dashboard
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" type="password" />
      <button disabled={isLoading}>Login</button>
    </form>
  );
}
```

### Vue

```vue
<template>
  <form @submit.prevent="login">
    <input v-model="username" />
    <input v-model="password" type="password" />
    <button :disabled="isLoading">Login</button>
  </form>
</template>

<script>
import { useGhostKey } from '@ghostkey/vue';

export default {
  setup() {
    const { authenticate, isLoading } = useGhostKey();
    
    const login = async () => {
      const result = await authenticate({
        username: username.value,
        password: password.value
      });
    };
    
    return { login, isLoading };
  }
}
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { GhostKeyService } from '@ghostkey/angular';

@Component({
  selector: 'app-login',
  template: `
    <form (submit)="login()">
      <input [(ngModel)]="username" />
      <input [(ngModel)]="password" type="password" />
      <button [disabled]="isLoading">Login</button>
    </form>
  `
})
export class LoginComponent {
  constructor(private ghostKey: GhostKeyService) {}
  
  async login() {
    const result = await this.ghostKey.authenticate({
      username: this.username,
      password: this.password
    });
  }
}
```

---

## 🎯 Advanced Usage

### Programmatic Authentication

```javascript
const result = await ghostKey.authenticate({
  username: 'user@example.com',
  password: 'SecurePass123',
  biometrics: {
    keystroke: true,
    voice: false
  },
  options: {
    minConfidence: 0.90,
    requireVoice: false
  }
});

if (result.success) {
  console.log('User:', result.user);
  console.log('Confidence:', result.confidence);
  console.log('Token:', result.token);
}
```

### Voice Authentication

```javascript
// Enable voice authentication
const result = await ghostKey.authenticate({
  username: 'user@example.com',
  password: 'SecurePass123',
  biometrics: {
    keystroke: true,
    voice: true
  }
});

// Voice-only authentication
const voiceResult = await ghostKey.authenticateVoice({
  username: 'user@example.com',
  passphrase: 'I\'ll Always Choose You'
});
```

### Biometric Enrollment

```javascript
// Enroll keystroke pattern
await ghostKey.enrollKeystroke({
  username: 'user@example.com',
  samples: 15 // Number of typing samples
});

// Enroll voice
await ghostKey.enrollVoice({
  username: 'user@example.com',
  passphrase: 'I\'ll Always Choose You',
  samples: 3 // Number of voice samples
});
```

### Custom UI

```javascript
const ghostKey = new GhostKey({
  apiKey: 'gk_live_...',
  ui: {
    theme: 'dark',
    position: 'center',
    customCSS: '/path/to/custom.css',
    showConfidence: true,
    showProgress: true
  }
});
```

---

## 🔧 Configuration

### Full Configuration Options

```javascript
const ghostKey = new GhostKey({
  // Required
  apiKey: 'gk_live_your_api_key',
  
  // Optional
  endpoint: 'https://api.ghostkey.io', // API endpoint
  
  // Biometric settings
  biometrics: {
    keystroke: true,
    voice: true,
    behavioral: false
  },
  
  // Authentication settings
  auth: {
    minConfidence: 0.85,
    maxAttempts: 3,
    requireVoice: false,
    sessionDuration: 3600 // seconds
  },
  
  // UI settings
  ui: {
    theme: 'light', // 'light' | 'dark' | 'auto'
    position: 'center', // 'center' | 'top' | 'bottom'
    customCSS: null,
    showConfidence: false,
    showProgress: true,
    language: 'en'
  },
  
  // Security settings
  security: {
    encryption: 'AES-256-GCM',
    zeroKnowledge: true,
    localStorageEncryption: true
  },
  
  // Callbacks
  onSuccess: (user) => {},
  onFailure: (error) => {},
  onEnrollment: (status) => {},
  onProgress: (progress) => {}
});
```

---

## 📊 API Reference

### `GhostKey`

Main SDK class.

#### Methods

##### `authenticate(options)`

Authenticate a user with biometrics.

```javascript
const result = await ghostKey.authenticate({
  username: string,
  password: string,
  biometrics?: {
    keystroke?: boolean,
    voice?: boolean
  },
  options?: {
    minConfidence?: number,
    requireVoice?: boolean
  }
});
```

**Returns**: `Promise<AuthResult>`

##### `enrollKeystroke(options)`

Enroll keystroke biometric pattern.

```javascript
await ghostKey.enrollKeystroke({
  username: string,
  samples?: number
});
```

##### `enrollVoice(options)`

Enroll voice biometric pattern.

```javascript
await ghostKey.enrollVoice({
  username: string,
  passphrase: string,
  samples?: number
});
```

##### `attachToForm(selector, callbacks)`

Attach biometric authentication to an existing form.

```javascript
ghostKey.attachToForm('#login-form', {
  onSuccess: (user) => {},
  onFailure: (error) => {}
});
```

##### `getUser()`

Get current authenticated user.

```javascript
const user = await ghostKey.getUser();
```

##### `logout()`

Logout current user.

```javascript
await ghostKey.logout();
```

---

## 🔐 Security

### Zero-Knowledge Architecture

Ghost Key uses a zero-knowledge architecture, meaning:

- ✅ Biometric data is encrypted on the client
- ✅ Server never sees raw biometric data
- ✅ Only you can decrypt your biometric patterns
- ✅ Even we can't access your biometric data

### Encryption

- **Algorithm**: AES-256-GCM (military-grade)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Storage**: Encrypted blobs in AWS S3
- **Transport**: TLS 1.3

### Compliance

- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ HIPAA ready (Enterprise plan)
- ✅ SOC 2 Type II (in progress)

---

## 📈 Performance

- **Authentication**: <100ms
- **Enrollment**: <3 seconds
- **SDK Size**: <50KB gzipped
- **Accuracy**: 97-99%
- **False Accept Rate**: <1%

---

## 💰 Pricing

### Free Tier
- 1,000 authentications/month
- 100 active users
- Keystroke biometrics
- Community support

### Starter ($29/month)
- 10,000 authentications/month
- 1,000 active users
- Keystroke + Voice biometrics
- Email support

### Professional ($99/month)
- 100,000 authentications/month
- 10,000 active users
- All biometric modalities
- Priority support
- Advanced analytics

### Enterprise (Custom)
- Unlimited authentications
- Unlimited users
- On-premise deployment
- SLA guarantee
- Dedicated support

[View full pricing →](https://ghostkey.io/pricing)

---

## 📖 Documentation

- [Getting Started](https://docs.ghostkey.io/getting-started)
- [API Reference](https://docs.ghostkey.io/api)
- [React Guide](https://docs.ghostkey.io/react)
- [Vue Guide](https://docs.ghostkey.io/vue)
- [Angular Guide](https://docs.ghostkey.io/angular)
- [Security](https://docs.ghostkey.io/security)
- [Examples](https://github.com/ghostkey/examples)

---

## 🤝 Support

- **Email**: support@ghostkey.io
- **Discord**: [Join our community](https://discord.gg/ghostkey)
- **GitHub**: [Report issues](https://github.com/ghostkey/sdk/issues)
- **Docs**: [docs.ghostkey.io](https://docs.ghostkey.io)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🌟 Why Ghost Key?

### vs. Traditional Auth (Auth0, Okta)
- ✅ Biometric authentication built-in
- ✅ More secure (behavioral patterns)
- ✅ Better UX (no password fatigue)
- ✅ Affordable pricing

### vs. Enterprise Biometrics
- ✅ Easy integration (5 lines of code)
- ✅ Developer-friendly
- ✅ Free tier available
- ✅ Great documentation

---

**Made with ❤️ by the Ghost Key Team**

[Website](https://ghostkey.io) • [Docs](https://docs.ghostkey.io) • [GitHub](https://github.com/ghostkey) • [Twitter](https://twitter.com/ghostkey)

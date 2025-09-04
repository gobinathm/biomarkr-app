# 🚀 Biomarkr Deployment Guide

This guide covers deploying Biomarkr across different platforms: web, desktop, and mobile applications.

## 🌐 Web Application Deployment

### Option 1: Vercel (Recommended for Web)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Custom domain (optional)
vercel domains add yourdomain.com
```

**Pros**: Automatic deployments, edge network, built-in analytics
**Best for**: Public web hosting, personal use

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Pros**: Easy setup, form handling, serverless functions
**Best for**: Static hosting with additional features

### Option 3: Self-Hosted
```bash
# Build for production
npm run build

# Deploy to your server
scp -r dist/ user@yourserver:/var/www/biomarkr/

# Nginx configuration
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/biomarkr;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Pros**: Full control, privacy, custom configuration
**Best for**: Enterprise, privacy-focused deployments

### Option 4: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t biomarkr .
docker run -p 8080:80 biomarkr
```

**Pros**: Consistent environment, easy scaling
**Best for**: Cloud deployments, microservices

---

## 🖥️ Desktop Application (Electron)

### Setup Electron
```bash
# Install Electron dependencies
npm install --save-dev electron electron-builder
npm install --save-dev @types/electron
```

### Create Electron Main Process
```javascript
// electron/main.js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Package.json Scripts
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:dist": "npm run electron:build -- --publish=always"
  },
  "build": {
    "appId": "com.biomarkr.app",
    "productName": "Biomarkr",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.healthcare-fitness",
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

### Build Desktop Apps
```bash
# Development
npm run electron:dev

# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build -- --mac
npm run electron:build -- --win
npm run electron:build -- --linux

# Build for all platforms
npm run electron:build -- --mac --win --linux
```

**Distribution Options**:
- **Direct Download**: Host installers on your website
- **Microsoft Store**: Windows app store
- **Mac App Store**: Apple's app store (requires Apple Developer account)
- **Snap Store**: Linux app store

---

## 📱 Mobile Application (Capacitor)

### Setup Capacitor
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard
npm install @capacitor/status-bar

# Initialize
npx cap init biomarkr com.yourcompany.biomarkr
```

### Capacitor Configuration
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.biomarkr',
  appName: 'Biomarkr',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    App: {
      launchShowDuration: 2000
    },
    StatusBar: {
      style: 'default'
    }
  }
};

export default config;
```

### Add Platform Support
```bash
# Add platforms
npx cap add android
npx cap add ios

# Build web app
npm run build

# Sync to native platforms
npx cap sync

# Open in native IDEs
npx cap open android
npx cap open ios
```

### Android Deployment
```bash
# Build APK for testing
npx cap build android

# Generate signed APK/AAB
# 1. Open Android Studio
# 2. Build → Generate Signed Bundle/APK
# 3. Choose APK or AAB format
# 4. Upload to Google Play Console
```

**Android Requirements**:
- Android Studio
- Android SDK (API 22+)
- Java Development Kit (JDK 11+)
- Google Play Developer account ($25 one-time fee)

### iOS Deployment
```bash
# Build for iOS
npx cap build ios

# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Set up signing & capabilities
# 2. Archive for distribution
# 3. Upload to App Store Connect
```

**iOS Requirements**:
- Xcode (macOS only)
- Apple Developer account ($99/year)
- iOS Simulator for testing

---

## 🔧 Platform-Specific Optimizations

### Web Application
```javascript
// Add to src/main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// PWA Manifest (public/manifest.json)
{
  "name": "Biomarkr - Health Tracker",
  "short_name": "Biomarkr",
  "description": "Personal health data tracking application",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Desktop Features
```javascript
// Enhanced Electron features
const { dialog, shell } = require('electron');

// File operations
async function exportData() {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  // Export logic
}

// Open external links
shell.openExternal('https://biomarkr.com');
```

### Mobile Optimizations
```typescript
// Native mobile features
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar } from '@capacitor/status-bar';

// Haptic feedback
await Haptics.impact({ style: ImpactStyle.Medium });

// Status bar styling
StatusBar.setBackgroundColor({ color: '#2563eb' });
```

---

## 🚀 Automated Deployment

### GitHub Actions (Web)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitHub Actions (Desktop)
```yaml
# .github/workflows/build-desktop.yml
name: Build Desktop Apps
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run electron:build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/
```

---

## 📊 Performance & Analytics

### Web Performance
```javascript
// Add performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Load time:', perfData.loadEventEnd - perfData.loadEventStart);
    }, 0);
  });
}
```

### Privacy-Friendly Analytics
```javascript
// Simple privacy-first analytics
function trackEvent(event, properties = {}) {
  // Only track non-personal events
  if (!isDemoMode() && event !== 'health_data_interaction') {
    // Send to privacy-friendly analytics service
    console.log('Event:', event, properties);
  }
}
```

---

## 🔒 Security Considerations

### Web Security Headers
```nginx
# Nginx security headers
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header Referrer-Policy strict-origin-when-cross-origin;
```

### Desktop Security
```javascript
// Electron security best practices
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  webSecurity: true,
  allowRunningInsecureContent: false,
  experimentalFeatures: false
}
```

### Mobile Security
```xml
<!-- Android: android/app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
  <domain-config cleartextTrafficPermitted="false">
    <domain includeSubdomains="true">yourdomain.com</domain>
  </domain-config>
</network-security-config>
```

---

## 📱 Store Submission Guidelines

### Google Play Store
1. **Prepare**: Icon, screenshots, descriptions
2. **Test**: Internal testing track
3. **Review**: Content rating, privacy policy
4. **Publish**: Production release

### Apple App Store
1. **Prepare**: App Store Connect setup
2. **Review**: App Store Review Guidelines
3. **Submit**: Binary and metadata
4. **Monitor**: Review status and feedback

### Microsoft Store
1. **Package**: MSIX installer
2. **Submit**: Partner Center
3. **Certify**: Microsoft certification process

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] All features tested in demo mode
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] Error handling implemented
- [ ] Medical disclaimers included
- [ ] Privacy policy updated
- [ ] Build process validated

### Post-Deployment
- [ ] Functionality testing on target platform
- [ ] Performance monitoring setup
- [ ] Error tracking configured
- [ ] User feedback collection
- [ ] Update mechanism tested
- [ ] Backup and recovery procedures
- [ ] Documentation updated

Choose the deployment method that best fits your use case, audience, and technical requirements!
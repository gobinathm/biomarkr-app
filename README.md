# 🧬 Biomarkr - Personal Health Data Tracker

> A comprehensive, privacy-first personal health data management application for tracking, analyzing, and understanding your biomarker test results over time.

![Biomarkr Logo](https://img.shields.io/badge/Biomarkr-Health%20Tracker-blue?style=for-the-badge)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🌟 Features

### 📊 **Comprehensive Health Tracking**
- **17+ Test Panel Types** covering all major health systems
- **70+ Biomarkers** including cardiovascular, metabolic, hormonal, and nutritional markers
- **Multi-Profile Support** for family health management
- **Trend Analysis** with interactive charts and pattern recognition

### 🔐 **Privacy-First Architecture**
- **100% Local Storage** - Your data never leaves your device
- **Optional Vault Protection** with encryption
- **No Account Required** - Start tracking immediately
- **HIPAA-Conscious Design** with security best practices

### 📱 **Cross-Platform Ready**
- **Progressive Web App (PWA)** for mobile devices
- **Electron Desktop App** for Windows, macOS, Linux
- **Responsive Design** optimized for all screen sizes
- **Offline Capable** with service worker support

### 🎯 **Advanced Features**
- **Smart Reminders** for test scheduling and health maintenance
- **Data Export** to PDF, CSV, and JSON formats
- **Reference Range Management** with customizable normal values
- **Demo Mode** with realistic sample data for exploration

## 🚀 Quick Start

### 🌐 **Run as Website (Recommended)**

```bash
# Clone the repository
git clone https://github.com/your-username/biomarkr-app.git
cd biomarkr-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

Visit `http://localhost:5173` to access Biomarkr in your browser.

### 🖥️ **Desktop Application (Electron)**

```bash
# Install Electron dependencies
npm install --save-dev electron electron-builder

# Add to package.json scripts:
# "electron": "electron ."
# "electron:build": "electron-builder"

# Run desktop app
npm run electron

# Build desktop installers
npm run electron:build
```

### 📱 **Mobile App (Capacitor)**

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init biomarkr com.yourcompany.biomarkr

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open android
npx cap open ios
```

## 🏗️ **Deployment Options**

<details>
<summary><strong>🌐 Static Website Deployment</strong></summary>

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Self-Hosted
```bash
npm run build
# Serve dist/ folder with any web server (nginx, Apache, etc.)
```
</details>

<details>
<summary><strong>🖥️ Desktop App Distribution</strong></summary>

### Windows
```bash
npm run electron:build -- --win
```

### macOS
```bash
npm run electron:build -- --mac
```

### Linux
```bash
npm run electron:build -- --linux
```
</details>

<details>
<summary><strong>📱 Mobile App Stores</strong></summary>

### Android (Google Play)
```bash
npx cap build android
# Generate signed APK/AAB in Android Studio
```

### iOS (App Store)
```bash
npx cap build ios
# Build and distribute via Xcode
```
</details>

## 📁 **Project Structure**

```
biomarkr-app/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Settings, etc.)
│   ├── services/           # Cloud storage, data management
│   ├── utils/             # Utility functions
│   ├── data/              # Mock data and types
│   └── App.tsx            # Main application component
├── public/                # Static assets
├── docs/                  # Documentation
├── electron/              # Electron main process (if using)
├── capacitor/             # Capacitor configuration (if using)
└── dist/                  # Built application
```

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Icon library

### **Data & Storage**
- **localStorage** - Primary data storage
- **IndexedDB** - Large data storage (future)
- **Web Crypto API** - Client-side encryption
- **Cloud Storage APIs** - Optional backup (Google Drive, Dropbox)

### **Charts & Visualization**
- **Chart.js/React-Chartjs-2** - Interactive charts
- **Custom trend analysis** - Built-in pattern recognition

### **Mobile & Desktop**
- **Capacitor** - Native mobile app framework
- **Electron** - Desktop application framework
- **PWA** - Progressive Web App features

## 🎮 **Demo Mode**

Biomarkr includes a comprehensive demo mode with:
- **4 Sample Profiles** (2 adults, 2 children)
- **190+ Realistic Test Results** spanning 3 years
- **Interactive Reminders** with proper scheduling
- **All Features Enabled** for full exploration

Access demo mode during onboarding or by calling `forceDemoMode()` in browser console.

## 🔒 **Privacy & Security**

### **Data Privacy Principles**
- ✅ **Local-First**: All data stored on your device
- ✅ **No Tracking**: No analytics or user tracking
- ✅ **No Accounts**: No registration or personal information required
- ✅ **Open Source**: Transparent, auditable codebase

### **Security Features**
- 🔐 **Optional Encryption**: Protect sensitive data with passphrase
- ⏰ **Auto-Lock**: Automatic session timeout
- 🔄 **Secure Backup**: Encrypted cloud backups (optional)
- 🛡️ **CSP Headers**: Content Security Policy protection

## 📚 **Documentation**

- [**User Guide**](docs/USER_GUIDE.md) - How to use Biomarkr
- [**Developer Guide**](docs/DEVELOPER_GUIDE.md) - Contributing and development
- [**Health Metrics Guide**](HEALTH_METRICS.md) - Comprehensive biomarker reference
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Platform-specific deployment instructions
- [**API Reference**](docs/API.md) - Component and service documentation

## 🤝 **Contributing**

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development setup
- Submitting pull requests
- Issue reporting

### **Development Setup**
```bash
git clone https://github.com/your-username/biomarkr-app.git
cd biomarkr-app
npm install
npm run dev
```

### **Code Quality**
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript checking
npm run test          # Unit tests (future)
```

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⚠️ **Medical Disclaimer**

Biomarkr is a personal health tracking tool and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals for medical advice. This software is provided for informational purposes only.

## 🎯 **Roadmap**

### **v1.1 - Enhanced Analytics**
- [ ] Advanced trend analysis
- [ ] Predictive health insights
- [ ] Custom reference ranges
- [ ] Data correlation analysis

### **v1.2 - Integrations**
- [ ] Wearable device data import
- [ ] Lab integration APIs
- [ ] Health app synchronization
- [ ] FHIR compatibility

### **v1.3 - Advanced Features**
- [ ] AI-powered insights
- [ ] Genetic data integration
- [ ] Microbiome analysis
- [ ] Environmental health tracking

## 💬 **Support**

- 📧 **Email**: support@biomarkr.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/biomarkr-app/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/biomarkr-app/issues)
- 📖 **Wiki**: [GitHub Wiki](https://github.com/your-username/biomarkr-app/wiki)

---

<div align="center">
  <p><strong>Made with ❤️ for better health tracking</strong></p>
  <p>
    <a href="#top">Back to top</a> •
    <a href="https://github.com/gobinathm/biomarkr-app/releases">Releases</a> •
    <a href="docs/">Documentation</a>
  </p>
</div>
# Changelog

All notable changes to Biomarkr will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive landing page with feature overview and setup instructions
- Professional welcome experience for new users
- Data storage warning notices to inform users about browser-based storage
- Enhanced user onboarding flow with backup restoration options

### Fixed
- Removed unnecessary page refresh when accessing demo mode from landing page
- Fixed unclickable buttons in landing page sections due to background overlay elements
- Streamlined onboarding process by removing duplicate demo mode options

## [1.0.0] - Current Release

### Cloud Storage Support ✅
- **Dropbox Integration** - Full OAuth2 + PKCE authentication, encrypted backup/restore
- **OneDrive Integration** - Microsoft Graph API with app folder support
- **Google Drive Integration** - OAuth2 + Drive API v3 with automatic folder management

### Core Features
- **Privacy-First Architecture** - 100% local storage with optional cloud backup
- **Multi-Profile Support** - Family health management with separate profiles
- **Comprehensive Tracking** - 70+ biomarkers across 17+ test panel types
- **Advanced Analytics** - Interactive charts and trend analysis
- **Smart Reminders** - Test scheduling and health maintenance alerts
- **Data Export** - PDF, CSV, and JSON format support
- **Demo Mode** - Realistic sample data for feature exploration

### Security & Privacy
- **Optional Vault Protection** - Client-side encryption with passphrase
- **Auto-Lock Feature** - Automatic session timeout for security
- **No Account Required** - Start tracking immediately
- **HIPAA-Conscious Design** - Security best practices throughout

### Cross-Platform Support
- **Progressive Web App (PWA)** - Mobile-optimized experience
- **Electron Desktop App** - Windows, macOS, Linux support
- **Responsive Design** - All screen sizes supported
- **Offline Capable** - Full functionality without internet

## Roadmap

### Planned Cloud Storage Expansions
- **Box** - Enterprise cloud storage integration
- **iCloud Drive** - Apple ecosystem integration  
- **pCloud** - European privacy-focused storage
- **MEGA** - End-to-end encrypted storage
- **Nextcloud** - Self-hosted cloud storage
- **Custom S3** - Amazon S3 compatible storage

### Future Enhancements
- Advanced trend analysis with statistical significance
- Wearable device data import (Apple Watch, Fitbit, Oura)
- Lab integration APIs for automatic result import
- AI-powered health insights and recommendations
- FHIR compatibility for healthcare provider integration

---

**Note**: All cloud storage integrations include:
- OAuth2 authentication with secure token management
- Encrypted data backup using Web Crypto API
- Automatic folder creation and management
- Cross-device synchronization capabilities
- Full backup/restore functionality
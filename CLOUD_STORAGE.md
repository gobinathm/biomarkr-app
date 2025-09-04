# Cloud Storage Implementation

This document provides technical details about the cloud storage functionality implemented in Biomarkr.

## Architecture Overview

The cloud storage system is built with a modular architecture supporting multiple providers:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudSync     │    │ CloudStorage     │    │  Cloud Provider │
│   Component     │───▶│    Manager       │───▶│   (OneDrive,    │
│                 │    │                  │    │  Google Drive,  │
└─────────────────┘    └──────────────────┘    │   Dropbox)      │
                                              └─────────────────┘
```

## Security Model

### End-to-End Encryption
- **Algorithm**: AES-GCM with 256-bit keys
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Salt**: Static salt "biomarkr-salt" (consider making this dynamic in production)
- **IV**: Random 12-byte initialization vector for each encryption

### Data Flow
1. **Local Data** → JSON serialization
2. **Encryption** → AES-GCM with user's vault passphrase
3. **Upload** → Encrypted blob to cloud provider
4. **Download** → Encrypted blob from cloud provider  
5. **Decryption** → AES-GCM with user's vault passphrase
6. **Local Restore** → JSON deserialization to localStorage

## Provider Implementation

### Microsoft OneDrive
- **API**: Microsoft Graph API v1.0
- **Storage Location**: `/Apps/Biomarkr/` (app-scoped folder)
- **Authentication**: OAuth 2.0 with PKCE
- **Permissions**: `Files.ReadWrite.AppFolder`, `offline_access`
- **Special Features**: Automatic app folder creation

### Google Drive
- **API**: Google Drive API v3
- **Storage Location**: `/Biomarkr/` folder in user's Drive
- **Authentication**: OAuth 2.0 with offline access
- **Permissions**: `https://www.googleapis.com/auth/drive.file`
- **Special Features**: File versioning, metadata search

### Dropbox
- **API**: Dropbox API v2
- **Storage Location**: `/Apps/Biomarkr/` (app folder)
- **Authentication**: OAuth 2.0 with refresh tokens
- **Permissions**: App folder access only
- **Special Features**: Atomic uploads, conflict resolution

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 2. Provider Registration

#### OneDrive (Microsoft)
1. Go to [Azure App Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Create new registration:
   - **Name**: Biomarkr
   - **Supported account types**: Personal Microsoft accounts only
   - **Redirect URI**: Web platform with `http://localhost:5173/auth/onedrive/callback`
3. Copy **Application (client) ID** to `VITE_ONEDRIVE_CLIENT_ID`
4. Under **API permissions**, add:
   - Microsoft Graph → Delegated → Files.ReadWrite.AppFolder
   - Microsoft Graph → Delegated → offline_access

#### Google Drive
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:5173/auth/google/callback`
5. Copy **Client ID** to `VITE_GOOGLE_CLIENT_ID`

#### Dropbox
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create new app:
   - **API**: Scoped access
   - **Access type**: App folder
   - **Name**: Biomarkr
3. In app settings:
   - Add redirect URI: `http://localhost:5173/auth/dropbox/callback`
   - Set permission type to "App folder"
4. Copy **App key** to `VITE_DROPBOX_CLIENT_ID`

### 3. Production Deployment
For production deployment, update redirect URIs in all provider consoles to match your production domain:
- `https://yourdomain.com/auth/onedrive/callback`
- `https://yourdomain.com/auth/google/callback`
- `https://yourdomain.com/auth/dropbox/callback`

## File Structure

```
src/services/
├── cloudStorage.ts          # Abstract base class
├── cloudStorageManager.ts   # Central management
├── oneDriveStorage.ts       # OneDrive implementation
├── googleDriveStorage.ts    # Google Drive implementation
├── dropboxStorage.ts        # Dropbox implementation
└── storageUtils.ts          # Utility functions

src/components/
├── CloudSync.tsx            # Main UI component
└── BackupManager.tsx        # Backup list management

public/auth/
├── onedrive/callback/       # OAuth callback page
├── google/callback/         # OAuth callback page
└── dropbox/callback/        # OAuth callback page
```

## API Usage Examples

### Basic Connection
```typescript
import { cloudStorageManager } from '../services/cloudStorageManager';

// Connect to a provider
await cloudStorageManager.connect('onedrive');

// Check connection status
const { status, provider } = cloudStorageManager.getStatus();
```

### Backup Data
```typescript
const backupData = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  profiles: [], // User profiles
  testResults: [], // Lab results
  settings: {}, // App settings
  referenceRanges: [], // Custom ranges
  reminders: [] // Test reminders
};

await cloudStorageManager.backup(backupData);
```

### Restore Data
```typescript
const restoredData = await cloudStorageManager.restore();

// Apply restored data to localStorage
localStorage.setItem('biomarkr-profiles', JSON.stringify(restoredData.profiles));
localStorage.setItem('biomarkr-test-results', JSON.stringify(restoredData.testResults));
// ... etc
```

## Error Handling

The system implements comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Token refresh or re-authentication prompt
- **Storage Errors**: Quota exceeded, file not found, etc.
- **Encryption Errors**: Fallback to base64 encoding
- **Data Validation**: Schema validation on restore

## Security Considerations

### Production Recommendations
1. **Dynamic Salt**: Use user-specific or time-based salts for encryption
2. **Client Secrets**: Store client secrets securely (environment variables only)
3. **Token Storage**: Consider more secure storage than localStorage
4. **Rate Limiting**: Implement client-side rate limiting for API calls
5. **Data Validation**: Strengthen backup data validation
6. **Audit Logging**: Log all cloud storage operations

### Privacy Features
- **Local Encryption**: Data encrypted before leaving device
- **Minimal Permissions**: Apps request only necessary permissions
- **No Server Storage**: No data stored on Biomarkr servers
- **User Control**: Users can disconnect and delete data anytime

## Testing

### Local Development
The app works with demo client IDs for development:
- Authentication dialogs will show but won't complete
- All UI components are fully functional
- Error handling can be tested

### Integration Testing
With real client IDs:
- Full OAuth flow
- Upload/download operations
- Token refresh handling
- Error scenarios

## Performance

### Optimization Features
- **Token Caching**: Automatic token management
- **Incremental Backups**: Only changed data (future enhancement)
- **Compression**: Data compression before upload (future enhancement)
- **Background Sync**: Non-blocking operations

### File Size Limits
- **Typical Backup Size**: 10-50 KB (depends on data volume)
- **OneDrive**: 250 GB per file
- **Google Drive**: 5 TB per file
- **Dropbox**: 350 GB per file

## Troubleshooting

### Common Issues

#### "Authentication Failed"
- Check client ID configuration
- Verify redirect URIs match exactly
- Clear browser cookies and try again

#### "Upload Failed"
- Check internet connection
- Verify cloud storage quota
- Check provider service status

#### "Invalid Backup Data"
- Data corruption during transfer
- Encryption/decryption key mismatch
- Try different backup file

### Debug Mode
Enable debug logging:
```typescript
localStorage.setItem('biomarkr-debug', 'true');
```

## Future Enhancements

### Planned Features
- **Incremental Sync**: Only sync changed data
- **Conflict Resolution**: Merge conflicting data
- **Multiple Backups**: Keep multiple backup versions
- **Data Compression**: Reduce upload size
- **Background Sync**: Automatic syncing
- **Sync Scheduling**: User-defined sync intervals

### Additional Providers
- **iCloud** (when API becomes available)
- **Amazon S3** (for enterprise users)
- **Custom Endpoints** (self-hosted solutions)

## Contributing

When adding new cloud providers:

1. Extend `CloudStorageProvider` abstract class
2. Implement all required methods
3. Add provider to `CloudStorageManager`
4. Create OAuth callback page
5. Update documentation
6. Add comprehensive error handling
7. Include dark mode support in UI

## Support

For cloud storage issues:
1. Check browser console for errors
2. Verify environment variables
3. Test with different providers
4. Check provider service status
5. Review network connectivity

---

*Last updated: August 2024*
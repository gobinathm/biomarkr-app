# 📘 Biomarkr API Reference

This document provides comprehensive API documentation for all Biomarkr components, services, utilities, and interfaces.

## 📋 Table of Contents

1. [Core Components](#-core-components)
2. [Modal Components](#-modal-components)
3. [Manager Components](#-manager-components)
4. [Data Services](#-data-services)
5. [Storage Services](#-storage-services)
6. [Utility Functions](#-utility-functions)
7. [Data Types & Interfaces](#-data-types--interfaces)
8. [Context Providers](#-context-providers)
9. [Custom Hooks](#-custom-hooks)
10. [Constants & Enums](#-constants--enums)

---

## 🧩 Core Components

### App

The main application component that orchestrates all features.

```typescript
interface AppProps {}

function App(): JSX.Element
```

**Description**: Root component managing application state, routing, and feature integration.

**Features**:
- Profile management and switching
- Test result display and management
- Trend analysis and visualization
- Reminder system
- Vault security
- Data export functionality

**State Management**:
- Uses localStorage for data persistence
- Manages profiles, test results, reminders, and settings
- Handles vault lock/unlock states

---

### Onboarding

Guides new users through the initial setup process.

```typescript
interface OnboardingProps {
  onComplete: () => void;
  onDemoMode: () => void;
}

function Onboarding({ onComplete, onDemoMode }: OnboardingProps): JSX.Element
```

**Props**:
- `onComplete`: Callback when onboarding is finished
- `onDemoMode`: Callback to enable demo mode

**Features**:
- Welcome screen with privacy overview
- Demo mode explanation and activation
- Vault protection setup option
- Data import/export information

---

### AddResultWizard

Step-by-step wizard for adding new test results.

```typescript
interface AddResultWizardProps {
  isOpen: boolean;
  onClose: () => void;
  profileId?: string;
  onSave: (result: TestResult) => void;
  editResult?: TestResult;
}

function AddResultWizard({ 
  isOpen, 
  onClose, 
  profileId, 
  onSave, 
  editResult 
}: AddResultWizardProps): JSX.Element
```

**Props**:
- `isOpen`: Controls wizard visibility
- `onClose`: Callback to close the wizard
- `profileId`: Optional pre-selected profile ID
- `onSave`: Callback with new/edited test result
- `editResult`: Optional result to edit (edit mode)

**Features**:
- Multi-step form with validation
- Profile selection
- Test panel type selection
- Biomarker entry with reference ranges
- Draft auto-saving
- Data validation and error handling

**State**:
- Current step tracking
- Form data management
- Validation errors
- Draft recovery

---

### ResultsList

Displays test results in a searchable, filterable list.

```typescript
interface ResultsListProps {
  results: TestResult[];
  profiles: Profile[];
  onEdit: (result: TestResult) => void;
  onDelete: (id: string) => void;
  onView: (result: TestResult) => void;
  activeProfileId?: string;
}

function ResultsList({ 
  results, 
  profiles, 
  onEdit, 
  onDelete, 
  onView, 
  activeProfileId 
}: ResultsListProps): JSX.Element
```

**Props**:
- `results`: Array of test results to display
- `profiles`: Array of user profiles
- `onEdit`: Callback to edit a result
- `onDelete`: Callback to delete a result
- `onView`: Callback to view result details
- `activeProfileId`: Optional filter by profile

**Features**:
- Date-based sorting (newest first)
- Profile filtering
- Search by test name or lab
- Quick actions (edit, delete, view)
- Batch operations
- Responsive design

---

### ResultDetails

Detailed view of a single test result.

```typescript
interface ResultDetailsProps {
  result: TestResult;
  profile: Profile;
  onClose: () => void;
  onEdit: () => void;
  previousResults?: TestResult[];
}

function ResultDetails({ 
  result, 
  profile, 
  onClose, 
  onEdit, 
  previousResults 
}: ResultDetailsProps): JSX.Element
```

**Props**:
- `result`: Test result to display
- `profile`: Associated profile
- `onClose`: Callback to close details view
- `onEdit`: Callback to edit the result
- `previousResults`: Historical results for trend comparison

**Features**:
- Complete biomarker display with reference ranges
- Color-coded normal/abnormal indicators
- Historical comparison
- Trend indicators
- Notes and metadata
- Print-friendly layout

---

## 🪟 Modal Components

### AlertModal

General-purpose alert dialog for notifications and confirmations.

```typescript
interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

function AlertModal({ 
  isOpen, 
  title, 
  message, 
  type = 'info', 
  onClose, 
  onConfirm, 
  confirmText = 'OK', 
  cancelText = 'Cancel' 
}: AlertModalProps): JSX.Element
```

**Props**:
- `isOpen`: Controls modal visibility
- `title`: Modal header title
- `message`: Alert message content
- `type`: Visual style variant
- `onClose`: Callback to close modal
- `onConfirm`: Optional confirmation callback
- `confirmText`: Custom confirm button text
- `cancelText`: Custom cancel button text

**Features**:
- Keyboard navigation (ESC to close)
- Click-outside-to-close
- Accessible modal implementation
- Icon-based type indicators
- Focus management

---

### ConfirmModal

Specialized confirmation dialog for destructive actions.

```typescript
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  confirmText?: string;
  cancelText?: string;
}

function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  destructive = false,
  confirmText = 'Confirm', 
  cancelText = 'Cancel' 
}: ConfirmModalProps): JSX.Element
```

**Props**:
- `isOpen`: Controls modal visibility
- `title`: Confirmation dialog title
- `message`: Confirmation message
- `onConfirm`: Callback for confirm action
- `onCancel`: Callback for cancel action
- `destructive`: Applies warning styling
- `confirmText`: Custom confirm button text
- `cancelText`: Custom cancel button text

**Features**:
- Red styling for destructive actions
- Keyboard navigation
- Focus trapping
- Accessibility compliance

---

### PassphraseModal

Secure passphrase entry for vault operations.

```typescript
interface PassphraseModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onSubmit: (passphrase: string) => Promise<boolean>;
  onCancel: () => void;
  isCreating?: boolean;
}

function PassphraseModal({ 
  isOpen, 
  title, 
  message, 
  onSubmit, 
  onCancel, 
  isCreating = false 
}: PassphraseModalProps): JSX.Element
```

**Props**:
- `isOpen`: Controls modal visibility
- `title`: Modal title
- `message`: Optional instructional message
- `onSubmit`: Async callback with passphrase
- `onCancel`: Callback to cancel operation
- `isCreating`: Whether creating new passphrase

**Features**:
- Secure password input field
- Confirmation field for new passphrases
- Strength indicator (when creating)
- Error handling for invalid passphrases
- Auto-clear on submit

---

## 🛠️ Manager Components

### ProfileManager

Comprehensive profile management interface.

```typescript
interface ProfileManagerProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onAdd: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

function ProfileManager({ 
  profiles, 
  activeProfileId, 
  onAdd, 
  onEdit, 
  onDelete, 
  onSetActive 
}: ProfileManagerProps): JSX.Element
```

**Props**:
- `profiles`: Array of user profiles
- `activeProfileId`: Currently active profile ID
- `onAdd`: Callback to add new profile
- `onEdit`: Callback to edit profile
- `onDelete`: Callback to delete profile
- `onSetActive`: Callback to set active profile

**Features**:
- Profile list with relationship icons
- Add/edit profile form
- Default profile management
- Profile switching
- Bulk operations
- Responsive grid layout

---

### VaultManager

Security settings and vault management.

```typescript
interface VaultManagerProps {
  isVaultEnabled: boolean;
  isVaultLocked: boolean;
  onEnableVault: () => void;
  onDisableVault: () => void;
  onLockVault: () => void;
  onUnlockVault: (passphrase: string) => Promise<boolean>;
  onChangePassphrase: (oldPass: string, newPass: string) => Promise<boolean>;
}

function VaultManager({ 
  isVaultEnabled, 
  isVaultLocked, 
  onEnableVault, 
  onDisableVault, 
  onLockVault, 
  onUnlockVault, 
  onChangePassphrase 
}: VaultManagerProps): JSX.Element
```

**Props**:
- `isVaultEnabled`: Current vault status
- `isVaultLocked`: Current lock status
- `onEnableVault`: Callback to enable vault
- `onDisableVault`: Callback to disable vault
- `onLockVault`: Callback to lock vault
- `onUnlockVault`: Async unlock callback
- `onChangePassphrase`: Async passphrase change callback

**Features**:
- Vault status indicators
- Passphrase setup and changes
- Auto-lock timer configuration
- Security recommendations
- Emergency access information

---

### BackupManager

Cloud storage and backup management.

```typescript
interface BackupManagerProps {
  settings: BackupSettings;
  onUpdateSettings: (settings: Partial<BackupSettings>) => void;
  onBackupNow: () => Promise<void>;
  onRestore: (data: any) => Promise<void>;
  cloudProviders: CloudProvider[];
}

function BackupManager({ 
  settings, 
  onUpdateSettings, 
  onBackupNow, 
  onRestore, 
  cloudProviders 
}: BackupManagerProps): JSX.Element
```

**Props**:
- `settings`: Current backup configuration
- `onUpdateSettings`: Callback to update settings
- `onBackupNow`: Manual backup trigger
- `onRestore`: Data restoration callback
- `cloudProviders`: Available cloud storage providers

**Features**:
- Provider selection and authentication
- Automatic backup scheduling
- Manual backup/restore operations
- Backup history and status
- Encryption settings for cloud storage

---

## 💾 Data Services

### CloudStorageManager

Orchestrates cloud storage operations across providers.

```typescript
class CloudStorageManager {
  constructor(providers: CloudStorageProvider[]);
  
  async authenticate(provider: string): Promise<boolean>;
  async backup(data: any, provider: string): Promise<string>;
  async restore(backupId: string, provider: string): Promise<any>;
  async listBackups(provider: string): Promise<BackupInfo[]>;
  async deleteBackup(backupId: string, provider: string): Promise<void>;
  isAuthenticated(provider: string): boolean;
  disconnect(provider: string): void;
}

interface CloudStorageProvider {
  name: string;
  authenticate(): Promise<boolean>;
  upload(data: string, filename: string): Promise<string>;
  download(fileId: string): Promise<string>;
  list(): Promise<FileInfo[]>;
  delete(fileId: string): Promise<void>;
  isAuthenticated(): boolean;
  disconnect(): void;
}

interface BackupInfo {
  id: string;
  filename: string;
  createdAt: string;
  size: number;
  encrypted: boolean;
}

interface FileInfo {
  id: string;
  name: string;
  size: number;
  modifiedTime: string;
}
```

**Methods**:
- `authenticate()`: Authenticate with cloud provider
- `backup()`: Create encrypted backup
- `restore()`: Download and decrypt backup
- `listBackups()`: Get available backups
- `deleteBackup()`: Remove backup file
- `isAuthenticated()`: Check auth status
- `disconnect()`: Clear authentication

---

### GoogleDriveStorage

Google Drive storage implementation.

```typescript
class GoogleDriveStorage implements CloudStorageProvider {
  constructor(clientId: string);
  
  async authenticate(): Promise<boolean>;
  async upload(data: string, filename: string): Promise<string>;
  async download(fileId: string): Promise<string>;
  async list(): Promise<FileInfo[]>;
  async delete(fileId: string): Promise<void>;
  isAuthenticated(): boolean;
  disconnect(): void;
}
```

**Configuration**:
- Requires Google OAuth2 client ID
- Uses Google Drive API v3
- Stores files in application folder
- Handles refresh token management

---

### DropboxStorage

Dropbox storage implementation.

```typescript
class DropboxStorage implements CloudStorageProvider {
  constructor(appKey: string);
  
  async authenticate(): Promise<boolean>;
  async upload(data: string, filename: string): Promise<string>;
  async download(fileId: string): Promise<string>;
  async list(): Promise<FileInfo[]>;
  async delete(fileId: string): Promise<void>;
  isAuthenticated(): boolean;
  disconnect(): void;
}
```

**Configuration**:
- Requires Dropbox app key
- Uses Dropbox API v2
- Stores files in /Apps/Biomarkr folder
- OAuth2 flow implementation

---

## 🛠️ Utility Functions

### authHelpers

Authentication utilities for cloud providers.

```typescript
// OAuth flow helpers
function generateCodeVerifier(): string;
function generateCodeChallenge(verifier: string): string;
function buildAuthUrl(params: AuthParams): string;
function exchangeCodeForToken(code: string, params: TokenParams): Promise<TokenResponse>;

interface AuthParams {
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  state?: string;
}

interface TokenParams {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}
```

---

### unitConversion

Unit conversion utilities for biomarkers.

```typescript
// Convert between different units
function convertUnit(
  value: number, 
  fromUnit: string, 
  toUnit: string, 
  biomarker: string
): number | null;

function getAvailableUnits(biomarker: string): string[];
function getPreferredUnit(biomarker: string, system: 'metric' | 'imperial'): string;
function formatValue(value: number, unit: string): string;

// Common conversions
const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  glucose: {
    'mg/dL': 1,
    'mmol/L': 0.0555
  },
  cholesterol: {
    'mg/dL': 1,
    'mmol/L': 0.02586
  }
};
```

**Functions**:
- `convertUnit()`: Convert values between units
- `getAvailableUnits()`: Get supported units for biomarker
- `getPreferredUnit()`: Get preferred unit for measurement system
- `formatValue()`: Format number with appropriate precision

---

### providerValidation

Validation utilities for test result data.

```typescript
function validateTestResult(result: Partial<TestResult>): ValidationResult;
function validateBiomarker(biomarker: Partial<Biomarker>): ValidationResult;
function validateProfile(profile: Partial<Profile>): ValidationResult;
function validateReminder(reminder: Partial<Reminder>): ValidationResult;

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Reference range validation
function isInReferenceRange(
  value: string, 
  referenceRange: ReferenceRange,
  age?: number,
  gender?: string
): RangeResult;

interface RangeResult {
  status: 'normal' | 'low' | 'high' | 'critical';
  message?: string;
}
```

**Functions**:
- `validateTestResult()`: Validate test result data
- `validateBiomarker()`: Validate individual biomarker
- `validateProfile()`: Validate profile information
- `validateReminder()`: Validate reminder data
- `isInReferenceRange()`: Check if value is within normal range

---

### draftManager

Auto-save functionality for forms.

```typescript
class DraftManager {
  private static instance: DraftManager;
  
  static getInstance(): DraftManager;
  
  saveDraft(key: string, data: any): void;
  loadDraft<T>(key: string): T | null;
  clearDraft(key: string): void;
  hasDraft(key: string): boolean;
  getAllDrafts(): Record<string, any>;
  clearAllDrafts(): void;
  
  // Auto-save with debouncing
  autoSave(key: string, data: any, delay?: number): void;
  stopAutoSave(key: string): void;
}

// Draft keys
export const DRAFT_KEYS = {
  ADD_RESULT: 'add-result',
  EDIT_RESULT: 'edit-result',
  ADD_PROFILE: 'add-profile',
  EDIT_PROFILE: 'edit-profile',
  ADD_REMINDER: 'add-reminder'
} as const;
```

**Methods**:
- `saveDraft()`: Save form data as draft
- `loadDraft()`: Load previously saved draft
- `clearDraft()`: Remove specific draft
- `hasDraft()`: Check if draft exists
- `autoSave()`: Enable auto-save with debouncing
- `stopAutoSave()`: Disable auto-save for key

---

## 📊 Data Types & Interfaces

### Profile

User profile information.

```typescript
interface Profile {
  id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  dateOfBirth: string; // ISO date string
  gender: 'male' | 'female' | 'other';
  height?: string;
  weight?: string;
  notes?: string;
  createdAt: string; // ISO datetime string
  modifiedAt?: string; // ISO datetime string
  isDefault?: boolean;
}
```

---

### TestResult

Medical test result with biomarkers.

```typescript
interface TestResult {
  id: string;
  profileId: string;
  profileName?: string;
  date: string; // ISO date string
  time?: string; // HH:MM format
  lab: string; // Laboratory name
  panel: string; // Test panel type
  tags?: string[]; // Organizational tags
  notes?: string; // Additional notes
  createdAt: string; // ISO datetime string
  modifiedAt?: string; // ISO datetime string
  biomarkers: Biomarker[];
}
```

---

### Biomarker

Individual biomarker measurement.

```typescript
interface Biomarker {
  name: string; // Biomarker name
  value: string; // Measured value
  unit: string; // Measurement unit
  range?: string; // Reference range text
  referenceRange?: {
    min?: number;
    max?: number;
    text?: string;
  };
  flags?: string[]; // High, Low, Critical, etc.
  notes?: string; // Additional notes
}
```

---

### Reminder

Health-related reminder or task.

```typescript
interface Reminder {
  id: string;
  profileId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  isCompleted: boolean;
  category: 'test' | 'medication' | 'appointment' | 'lifestyle';
  createdAt: string; // ISO datetime string
  completedAt?: string; // ISO datetime string
}
```

---

### AppSettings

Application configuration settings.

```typescript
interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  vault: {
    enabled: boolean;
    autoLockMinutes: number;
  };
  backup: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    provider?: 'google' | 'dropbox' | 'onedrive';
  };
  display: {
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    units: 'metric' | 'imperial';
  };
}
```

---

## 🎯 Context Providers

### SettingsContext

Global settings management context.

```typescript
interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (data: string) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function SettingsProvider({ children }: { children: ReactNode }): JSX.Element;

function useSettings(): SettingsContextValue;
```

**Usage**:
```typescript
const { settings, updateSettings } = useSettings();

// Update theme
updateSettings({ theme: 'dark' });

// Update nested settings
updateSettings({ 
  vault: { ...settings.vault, autoLockMinutes: 30 } 
});
```

---

## 🪝 Custom Hooks

### useLocalStorage

Persistent state management with localStorage.

```typescript
function useLocalStorage<T>(
  key: string, 
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void];

function useLocalStorage<T>(
  key: string, 
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    validator?: (value: any) => value is T;
  }
): [T, (value: T | ((prev: T) => T)) => void];
```

**Usage**:
```typescript
const [profiles, setProfiles] = useLocalStorage<Profile[]>('profiles', []);

// Add new profile
setProfiles(prev => [...prev, newProfile]);

// Update existing profile
setProfiles(prev => prev.map(p => p.id === id ? updated : p));
```

---

### useDebounce

Debounce value changes for performance optimization.

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Usage**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    // Perform search
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

### useAsyncOperation

Handle async operations with loading and error states.

```typescript
function useAsyncOperation<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
): {
  execute: (...args: P) => Promise<T>;
  loading: boolean;
  error: Error | null;
  result: T | null;
  reset: () => void;
};
```

**Usage**:
```typescript
const { execute: saveData, loading, error } = useAsyncOperation(
  async (data: TestResult) => {
    // Save to cloud storage
    return await cloudStorage.backup(data);
  }
);

// Use in component
const handleSave = async () => {
  try {
    await saveData(testResult);
    showSuccess('Data saved successfully');
  } catch (err) {
    // Error handled by hook
  }
};
```

---

### useVault

Vault security management hook.

```typescript
function useVault(): {
  isEnabled: boolean;
  isLocked: boolean;
  enable: (passphrase: string) => Promise<boolean>;
  disable: (passphrase: string) => Promise<boolean>;
  lock: () => void;
  unlock: (passphrase: string) => Promise<boolean>;
  changePassphrase: (old: string, newPass: string) => Promise<boolean>;
  autoLockMinutes: number;
  setAutoLockMinutes: (minutes: number) => void;
};
```

**Usage**:
```typescript
const { isLocked, unlock, lock } = useVault();

if (isLocked) {
  return <PassphraseModal onSubmit={unlock} />;
}

// Auto-lock after inactivity
const handleActivity = useCallback(() => {
  // Reset auto-lock timer
}, []);
```

---

## 📈 Constants & Enums

### Test Panel Types

Available test panel categories.

```typescript
export const TEST_PANELS = [
  'Complete Blood Count (CBC)',
  'Comprehensive Metabolic Panel', 
  'Lipid Panel',
  'Thyroid Function Tests',
  'Liver Function Tests',
  'Kidney Function Tests',
  'Hemoglobin A1C',
  'Vitamin D Test',
  'Iron Studies',
  'Inflammatory Markers',
  'Cardiac Risk Panel',
  'Hormone Panel',
  'Nutrient Status Panel',
  'Autoimmune Panel',
  'Metabolic Health Panel',
  'Cancer Markers',
  'Bone Health Panel'
] as const;

export type TestPanel = typeof TEST_PANELS[number];
```

---

### Biomarker Categories

Biomarker classification system.

```typescript
export enum BiomarkerCategory {
  HEMATOLOGY = 'hematology',
  CHEMISTRY = 'chemistry',
  LIPIDS = 'lipids',
  HORMONES = 'hormones',
  VITAMINS = 'vitamins',
  MINERALS = 'minerals',
  INFLAMMATION = 'inflammation',
  CARDIAC = 'cardiac',
  TUMOR_MARKERS = 'tumor_markers',
  AUTOIMMUNE = 'autoimmune'
}

export const CATEGORY_LABELS: Record<BiomarkerCategory, string> = {
  [BiomarkerCategory.HEMATOLOGY]: 'Blood Cells',
  [BiomarkerCategory.CHEMISTRY]: 'Blood Chemistry',
  [BiomarkerCategory.LIPIDS]: 'Lipid Profile',
  [BiomarkerCategory.HORMONES]: 'Hormones',
  [BiomarkerCategory.VITAMINS]: 'Vitamins',
  [BiomarkerCategory.MINERALS]: 'Minerals',
  [BiomarkerCategory.INFLAMMATION]: 'Inflammation',
  [BiomarkerCategory.CARDIAC]: 'Heart Health',
  [BiomarkerCategory.TUMOR_MARKERS]: 'Cancer Markers',
  [BiomarkerCategory.AUTOIMMUNE]: 'Autoimmune'
};
```

---

### Storage Keys

LocalStorage key constants.

```typescript
export const STORAGE_KEYS = {
  PROFILES: 'biomarkr-profiles',
  TEST_RESULTS: 'biomarkr-test-results',
  REMINDERS: 'biomarkr-reminders',
  SETTINGS: 'biomarkr-settings',
  ACTIVE_PROFILE: 'biomarkr-active-profile',
  VAULT_ENABLED: 'biomarkr-vault-enabled',
  DEMO_MODE: 'biomarkr-demo-mode',
  ONBOARDED: 'biomarkr-onboarded'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
```

---

### Error Codes

Standardized error codes for error handling.

```typescript
export enum ErrorCode {
  // Validation Errors
  VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
  VALIDATION_FORMAT = 'VALIDATION_FORMAT',
  VALIDATION_RANGE = 'VALIDATION_RANGE',
  
  // Storage Errors
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_ACCESS_DENIED = 'STORAGE_ACCESS_DENIED',
  STORAGE_NOT_AVAILABLE = 'STORAGE_NOT_AVAILABLE',
  
  // Vault Errors
  VAULT_LOCKED = 'VAULT_LOCKED',
  VAULT_INVALID_PASSPHRASE = 'VAULT_INVALID_PASSPHRASE',
  VAULT_ENCRYPTION_FAILED = 'VAULT_ENCRYPTION_FAILED',
  
  // Cloud Storage Errors
  CLOUD_AUTH_FAILED = 'CLOUD_AUTH_FAILED',
  CLOUD_UPLOAD_FAILED = 'CLOUD_UPLOAD_FAILED',
  CLOUD_DOWNLOAD_FAILED = 'CLOUD_DOWNLOAD_FAILED',
  CLOUD_NOT_CONNECTED = 'CLOUD_NOT_CONNECTED',
  
  // General Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_REQUIRED]: 'This field is required',
  [ErrorCode.VALIDATION_FORMAT]: 'Invalid format',
  [ErrorCode.VALIDATION_RANGE]: 'Value out of acceptable range',
  [ErrorCode.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded',
  [ErrorCode.VAULT_LOCKED]: 'Vault is locked - enter passphrase',
  [ErrorCode.VAULT_INVALID_PASSPHRASE]: 'Invalid passphrase',
  [ErrorCode.CLOUD_AUTH_FAILED]: 'Cloud authentication failed',
  // ... other error messages
};
```

---

## 🎨 Theme & Styling

### CSS Custom Properties

Available CSS variables for theming.

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #1e40af;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #d1d5db;
}
```

---

### Tailwind Configuration

Custom Tailwind CSS configuration.

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a'
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

---

*This API reference is automatically generated and maintained. For the most up-to-date information, refer to the TypeScript definitions in the source code.*

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Cloud, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Download,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  Upload,
  Plus,
  PlayCircle
} from 'lucide-react';
import { CloudStorageManager, CloudProvider, cloudStorageManager } from '../services/cloudStorageManager';
import { getAvailableProviders } from '../utils/providerValidation';
import { enableDemoMode } from '../data/mockData';

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'vault-choice' | 'backup-check' | 'vault-setup' | 'passphrase' | 'cloud-choice' | 'complete';

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [skipPassphrase, setSkipPassphrase] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<string | null>(null);
  const [hasCloudBackups, setHasCloudBackups] = useState(false);
  const [checkingBackups, setCheckingBackups] = useState(true);
  
  // Check for existing cloud backups on load
  useEffect(() => {
    checkForExistingBackups();
  }, []);
  
  const checkForExistingBackups = async () => {
    try {
      // Method 1: Check if we have a currently connected provider
      if (cloudStorageManager.isConnected()) {
        try {
          const backups = await cloudStorageManager.getBackupList();
          console.log(`Backups found in current provider:`, backups.length);
          if (backups.length > 0) {
            setHasCloudBackups(true);
            return;
          }
        } catch (error) {
          console.log(`No backups found in current provider:`, error);
        }
      }
      
      // Method 2: Check if we have any stored provider tokens (even if expired)
      const storedProviders = [
        { name: 'dropbox', key: 'dropbox_tokens' },
        { name: 'onedrive', key: 'onedrive_tokens' }, 
        { name: 'googledrive', key: 'googledrive_tokens' }
      ];
      
      let hasStoredTokens = false;
      for (const provider of storedProviders) {
        const tokens = localStorage.getItem(provider.key);
        if (tokens) {
          console.log(`Found stored tokens for ${provider.name}`);
          hasStoredTokens = true;
          break;
        }
      }
      
      // Method 3: Check browser history for previous cloud connections
      const hasUsedCloudStorage = localStorage.getItem('biomarkr-has-used-cloud');
      
      if (hasStoredTokens || hasUsedCloudStorage) {
        console.log('Evidence of previous cloud usage found');
        setHasCloudBackups(true);
      }
      
    } catch (error) {
      console.log('Error checking for backups:', error);
    } finally {
      setCheckingBackups(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={() => setCurrentStep('vault-choice')} />;
      case 'vault-choice':
        return (
          <VaultChoiceStep 
            hasCloudBackups={hasCloudBackups}
            checkingBackups={checkingBackups}
            onCreateNew={() => setCurrentStep('vault-setup')}
            onRestoreFromBackup={() => {
              // Set flag to show backup restoration instead of vault creation
              localStorage.setItem('biomarkr-restoring-from-backup', 'true');
              onComplete();
            }}
            onCheckForBackups={() => setCurrentStep('backup-check')}
            onDemoMode={() => {
              // Enable demo mode and complete onboarding
              enableDemoMode();
              onComplete();
            }}
            onBack={() => setCurrentStep('welcome')}
          />
        );
      case 'backup-check':
        return (
          <BackupCheckStep
            onRestoreFromBackup={(backupData) => {
              // Store backup data for restoration
              localStorage.setItem('biomarkr-restore-data', JSON.stringify(backupData));
              localStorage.setItem('biomarkr-restoring-from-backup', 'true');
              // Store the provider info to maintain connection
              localStorage.setItem('biomarkr-restore-provider', backupData.provider);
              onComplete();
            }}
            onCreateNewVault={() => setCurrentStep('vault-setup')}
            onBack={() => setCurrentStep('vault-choice')}
          />
        );
      case 'vault-setup':
        return <VaultSetupStep onNext={() => setCurrentStep('passphrase')} />;
      case 'passphrase':
        return (
          <PassphraseStep
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            confirmPassphrase={confirmPassphrase}
            setConfirmPassphrase={setConfirmPassphrase}
            showPassphrase={showPassphrase}
            setShowPassphrase={setShowPassphrase}
            skipPassphrase={skipPassphrase}
            setSkipPassphrase={setSkipPassphrase}
            onNext={() => setCurrentStep('cloud-choice')}
            onBack={() => setCurrentStep('vault-setup')}
          />
        );
      case 'cloud-choice':
        return (
          <CloudChoiceStep
            selectedProvider={selectedCloudProvider}
            setSelectedProvider={setSelectedCloudProvider}
            onNext={() => setCurrentStep('complete')}
            onBack={() => setCurrentStep('passphrase')}
          />
        );
      case 'complete':
        return <CompleteStep onFinish={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {renderStep()}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Welcome to <span className="bg-logo-gradient bg-clip-text text-transparent">Biomarkr</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your personal, private lab results tracker that keeps your health data secure and under your control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Works Offline</h3>
          <p className="text-sm text-gray-600">Access your data anytime, even without internet</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Private by Design</h3>
          <p className="text-sm text-gray-600">Your data stays on your device unless you choose to backup</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <Monitor className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Cross-Device</h3>
          <p className="text-sm text-gray-600">Optional sync across your devices via your cloud drive</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm font-medium text-blue-900 mb-1">Your Privacy Promise</p>
            <p className="text-sm text-blue-800">
              No cloud by default. Your device holds your data. We never see your health information.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}

function VaultSetupStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Create Your Local Vault</h2>
        <p className="text-gray-600">
          We'll create a secure, encrypted storage area on your device for your lab results.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 mb-1">Stored Locally</p>
            <p className="text-sm text-gray-600">Your vault is created in your browser's secure storage (IndexedDB)</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 mb-1">Encrypted by Default</p>
            <p className="text-sm text-gray-600">All data is automatically encrypted before storage</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 mb-1">No Network Required</p>
            <p className="text-sm text-gray-600">Works completely offline after initial setup</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">Important to Know</p>
            <p className="text-sm text-amber-800">
              Your vault is tied to this browser and device. Clearing browser data will remove your vault unless you've backed it up to a cloud drive.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        Create My Vault
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}

function PassphraseStep({
  passphrase,
  setPassphrase,
  confirmPassphrase,
  setConfirmPassphrase,
  showPassphrase,
  setShowPassphrase,
  skipPassphrase,
  setSkipPassphrase,
  onNext,
  onBack
}: {
  passphrase: string;
  setPassphrase: (value: string) => void;
  confirmPassphrase: string;
  setConfirmPassphrase: (value: string) => void;
  showPassphrase: boolean;
  setShowPassphrase: (value: boolean) => void;
  skipPassphrase: boolean;
  setSkipPassphrase: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const passphraseMatch = passphrase === confirmPassphrase && passphrase.length > 0;
  const canProceed = skipPassphrase || passphraseMatch;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Key className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Secure Your Vault</h2>
        <p className="text-gray-600">
          Add an extra layer of protection with a passphrase, or skip for device-level security only.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="skip-passphrase"
            checked={skipPassphrase}
            onChange={(e) => setSkipPassphrase(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="skip-passphrase" className="ml-3 text-sm text-gray-700">
            Skip passphrase setup (rely on device security only)
          </label>
        </div>

        {!skipPassphrase && (
          <>
            <div>
              <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700 mb-2">
                Create Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  id="passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter a strong passphrase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassphrase ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-passphrase" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Passphrase
              </label>
              <input
                type={showPassphrase ? 'text' : 'password'}
                id="confirm-passphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  confirmPassphrase && !passphraseMatch ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your passphrase"
              />
              {confirmPassphrase && !passphraseMatch && (
                <p className="mt-1 text-sm text-red-600">Passphrases don't match</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Recovery Limitation</p>
            <p className="text-sm text-blue-800">
              {skipPassphrase 
                ? "Without a passphrase, your vault can only be recovered if you've backed it up to a cloud drive."
                : "If you forget your passphrase, your vault can only be recovered from a cloud backup. We cannot reset it for you."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}

function CloudChoiceStep({
  selectedProvider,
  setSelectedProvider,
  onNext,
  onBack
}: {
  selectedProvider: string | null;
  setSelectedProvider: (provider: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const providers = [
    {
      id: 'onedrive',
      name: 'Microsoft OneDrive',
      description: 'Backup to your OneDrive account',
      color: 'blue',
      icon: Cloud
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      description: 'Backup to your Google Drive account',
      color: 'red',
      icon: Cloud
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Backup to your Dropbox account',
      color: 'indigo',
      icon: Cloud
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Cloud className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect Cloud Drive (Optional)</h2>
        <p className="text-gray-600">
          Choose a cloud drive to backup and sync your encrypted vault across devices.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
             onClick={() => setSelectedProvider(null)}>
          <input
            type="radio"
            name="cloud-provider"
            checked={selectedProvider === null}
            onChange={() => setSelectedProvider(null)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <WifiOff className="w-5 h-5 text-gray-600 mr-2" />
              <p className="font-medium text-gray-900">Skip for Now</p>
            </div>
            <p className="text-sm text-gray-600">Use local storage only (you can connect later)</p>
          </div>
        </div>

        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
              selectedProvider === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <input
              type="radio"
              name="cloud-provider"
              checked={selectedProvider === provider.id}
              onChange={() => setSelectedProvider(provider.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center">
                <provider.icon className={`w-5 h-5 text-${provider.color}-600 mr-2`} />
                <p className="font-medium text-gray-900">{provider.name}</p>
              </div>
              <p className="text-sm text-gray-600">{provider.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 mb-1">Privacy & Security</p>
            <p className="text-sm text-green-800">
              We store one encrypted data file in your drive's app folder. Your health data is encrypted before upload and we never have access to it.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}

function CompleteStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your secure vault is ready. You can now start tracking your lab results with complete privacy and control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
          <p className="text-sm text-gray-600">Your data is encrypted and stays on your device</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <Wifi className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Works Offline</h3>
          <p className="text-sm text-gray-600">Access your data anytime, anywhere</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Next steps:</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Add your first lab result to get started</li>
          <li>• Set up test reminders to stay on track</li>
          <li>• Explore trends as you add more data</li>
          <li>• Consider installing as an app for quick access</li>
        </ul>
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        Start Tracking
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}

interface VaultChoiceStepProps {
  hasCloudBackups: boolean;
  checkingBackups: boolean;
  onCreateNew: () => void;
  onRestoreFromBackup: () => void;
  onCheckForBackups: () => void;
  onDemoMode: () => void;
  onBack: () => void;
}

function VaultChoiceStep({ hasCloudBackups, checkingBackups, onCreateNew, onRestoreFromBackup, onCheckForBackups, onDemoMode, onBack }: VaultChoiceStepProps) {
  if (checkingBackups) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Checking for Existing Data</h2>
          <p className="text-gray-600">Looking for previous backups in your connected cloud drives...</p>
        </div>
      </div>
    );
  }

  if (!hasCloudBackups) {
    // No local evidence found, but user might have backups in cloud
    // Show option to check manually
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Cloud className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Getting Started</h2>
          <p className="text-gray-600">How would you like to begin with Biomarkr?</p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Create new vault */}
          <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer group" onClick={onCreateNew}>
            <div className="flex items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4 group-hover:bg-blue-200">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Start Fresh</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Create a new vault and start tracking lab results from scratch.
                </p>
                <div className="flex items-center text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Recommended for new users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Check for existing backups */}
          <div className="p-6 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group" onClick={onCheckForBackups}>
            <div className="flex items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4 group-hover:bg-green-200">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Check for Existing Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Connect to your cloud drive to check for previous Biomarkr backups.
                </p>
                <div className="flex items-center text-sm text-green-700">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  <span>Great if you've used Biomarkr before</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo mode option */}
          <div className="p-6 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group" onClick={onDemoMode}>
            <div className="flex items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mr-4 group-hover:bg-purple-200">
                <PlayCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Try Demo Mode</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Explore Biomarkr with pre-loaded sample data to see how it works.
                </p>
                <div className="flex items-center text-sm text-purple-700">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  <span>Perfect for testing the app</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <button
            onClick={onCreateNew}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            Start Fresh
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Download className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Previous Cloud Usage Detected!</h2>
        <p className="text-gray-600">We found evidence that you've used cloud backup before. You may have existing data in your cloud drive that can be restored.</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Restore from backup option */}
        <div className="p-6 border-2 border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer group" onClick={onRestoreFromBackup}>
          <div className="flex items-start">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4 group-hover:bg-green-200">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Restore from Backup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restore your previous lab results, settings, and reminders from cloud backup.
              </p>
              <div className="flex items-center text-sm text-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Recommended - Keep your existing data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create new vault option */}
        <div className="p-6 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group" onClick={onCreateNew}>
          <div className="flex items-start">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4 group-hover:bg-blue-200">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Start Fresh</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create a new vault and start tracking lab results from scratch.
              </p>
              <div className="flex items-center text-sm text-amber-700">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>This will not affect your existing backups</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo mode option */}
        <div className="p-6 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group" onClick={onDemoMode}>
          <div className="flex items-start">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mr-4 group-hover:bg-purple-200">
              <PlayCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Try Demo Mode</h3>
              <p className="text-sm text-gray-600 mb-3">
                Explore Biomarkr with pre-loaded sample data to see how it works.
              </p>
              <div className="flex items-center text-sm text-purple-700">
                <PlayCircle className="w-4 h-4 mr-1" />
                <span>Perfect for testing the app</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Your Data is Safe</p>
            <p className="text-sm text-blue-800">
              Your existing backups remain secure in your cloud drive regardless of which option you choose.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onRestoreFromBackup}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Restore Backup
        </button>
      </div>
    </div>
  );
}

interface BackupCheckStepProps {
  onRestoreFromBackup: (backupData: any) => void;
  onCreateNewVault: () => void;
  onBack: () => void;
}

interface CloudProviderState {
  provider: CloudProvider;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: 'disconnected' | 'connecting' | 'checking' | 'found' | 'not-found' | 'error';
  backups?: Array<{
    name: string;
    date: string;
    lastModified: string;
    size: number;
  }>;
  error?: string;
}

function BackupCheckStep({ onRestoreFromBackup, onCreateNewVault, onBack }: BackupCheckStepProps) {
  const [providers, setProviders] = useState<CloudProviderState[]>([]);

  useEffect(() => {
    // Initialize available cloud providers
    const availableProviders = getAvailableProviders();
    const initialProviders: CloudProviderState[] = availableProviders.map(providerConfig => ({
      provider: providerConfig.id,
      name: providerConfig.name,
      icon: Cloud, // We'll use a generic icon for now
      color: providerConfig.color,
      status: 'disconnected'
    }));
    
    setProviders(initialProviders);
  }, []);


  const handleConnectProvider = async (providerIndex: number) => {
    const updatedProviders = [...providers];
    const providerState = updatedProviders[providerIndex];
    
    try {
      providerState.status = 'connecting';
      setProviders([...updatedProviders]);
      
      await cloudStorageManager.connect(providerState.provider);
      
      providerState.status = 'checking';
      setProviders([...updatedProviders]);
      
      const backups = await cloudStorageManager.getBackupList();
      
      if (backups.length > 0) {
        providerState.status = 'found';
        providerState.backups = backups.map(backup => ({
          name: backup.name,
          date: backup.date, // date is already formatted
          lastModified: backup.lastModified,
          size: backup.size
        }));
      } else {
        providerState.status = 'not-found';
      }
      
    } catch (error) {
      providerState.status = 'error';
      providerState.error = error instanceof Error ? error.message : 'Connection failed';
    }
    
    setProviders([...updatedProviders]);
  };

  const handleRestoreBackup = (provider: CloudProvider, backup: any) => {
    onRestoreFromBackup({ provider, backup });
  };

  const getStatusIcon = (status: CloudProviderState['status']) => {
    switch (status) {
      case 'connecting':
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'found':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'not-found':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Cloud className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (providerState: CloudProviderState) => {
    switch (providerState.status) {
      case 'disconnected':
        return 'Click to connect and check for backups';
      case 'connecting':
        return 'Connecting...';
      case 'checking':
        return 'Checking for backups...';
      case 'found':
        return `Found ${providerState.backups?.length} backup(s)`;
      case 'not-found':
        return 'No backups found';
      case 'error':
        return providerState.error || 'Connection failed';
      default:
        return '';
    }
  };

  const hasFoundBackups = providers.some(p => p.status === 'found');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <RefreshCw className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Check for Existing Data</h2>
        <p className="text-gray-600">Connect to your cloud storage to check for previous Biomarkr backups.</p>
      </div>

      <div className="space-y-4 mb-8">
        {providers.map((providerState, index) => (
          <div key={providerState.provider} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className={`p-4 cursor-pointer transition-colors ${
                providerState.status === 'disconnected' ? 'hover:bg-gray-50' : 'bg-gray-50'
              }`}
              onClick={() => providerState.status === 'disconnected' && handleConnectProvider(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <providerState.icon className={`w-6 h-6 text-${providerState.color}-600 mr-3`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{providerState.name}</h3>
                    <p className="text-sm text-gray-600">{getStatusText(providerState)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(providerState.status)}
                </div>
              </div>
            </div>
            
            {/* Show backup details if found */}
            {providerState.status === 'found' && providerState.backups && (
              <div className="border-t border-gray-200 bg-green-50 p-4">
                <h4 className="font-medium text-green-900 mb-2">Available Backups:</h4>
                {providerState.backups.map((backup, backupIndex) => (
                  <div key={backupIndex} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-green-900">{backup.name}</p>
                      <p className="text-xs text-green-700">Created: {backup.date}</p>
                      <p className="text-xs text-green-600">Last updated: {backup.lastModified}</p>
                    </div>
                    <button
                      onClick={() => handleRestoreBackup(providerState.provider, backup)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Restore This
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show options when no backup found */}
            {providerState.status === 'not-found' && (
              <div className="border-t border-gray-200 bg-yellow-50 p-4">
                <h4 className="font-medium text-yellow-900 mb-2">No Backup Found</h4>
                <p className="text-sm text-yellow-800 mb-4">
                  Connected successfully, but no Biomarkr backup was found in your {providerState.name}.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onCreateNewVault()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create New Vault
                  </button>
                  <button
                    onClick={() => {
                      // Reset this provider to allow trying another
                      const updatedProviders = [...providers];
                      updatedProviders[index].status = 'disconnected';
                      setProviders(updatedProviders);
                      // Disconnect from current provider
                      cloudStorageManager.disconnect();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium"
                  >
                    Try Another Provider
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasFoundBackups && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Backups Found!</p>
              <p className="text-sm text-blue-800">
                We found existing Biomarkr data in your cloud storage. You can restore any of the backups above, or choose to start fresh.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onCreateNewVault}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Fresh
        </button>
      </div>
    </div>
  );
}
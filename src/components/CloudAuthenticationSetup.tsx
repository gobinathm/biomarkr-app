import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
  ExternalLink,
  Key,
  Lock
} from 'lucide-react';

interface CloudProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  setupSteps: string[];
  authUrl?: string;
  isAvailable: boolean;
}

const cloudProviders: CloudProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: <Cloud className="w-6 h-6 text-blue-600" />,
    description: 'Store your health data securely in Google Drive with end-to-end encryption',
    setupSteps: [
      'Click "Connect to Google Drive"',
      'Sign in to your Google account',
      'Grant Biomarkr permission to store files',
      'Your data will be encrypted before upload'
    ],
    authUrl: 'https://accounts.google.com/oauth/v2/auth',
    isAvailable: true
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: <Cloud className="w-6 h-6 text-blue-800" />,
    description: 'Sync your health data with Dropbox storage',
    setupSteps: [
      'Connect to your Dropbox account',
      'Authorize Biomarkr app access',
      'Data will be encrypted and synced'
    ],
    authUrl: 'https://www.dropbox.com/oauth2/authorize',
    isAvailable: false // Not implemented yet
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    icon: <Cloud className="w-6 h-6 text-blue-700" />,
    description: 'Store data in Microsoft OneDrive with enterprise security',
    setupSteps: [
      'Sign in to Microsoft account',
      'Grant storage permissions',
      'Enable encrypted sync'
    ],
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    isAvailable: false // Not implemented yet
  }
];

interface CloudAuthenticationSetupProps {
  onAuthComplete: (provider: string, credentials: any) => void;
  onSkip: () => void;
  requiredFor: 'backup' | 'primary' | 'hybrid';
}

export const CloudAuthenticationSetup: React.FC<CloudAuthenticationSetupProps> = ({
  onAuthComplete,
  onSkip,
  requiredFor
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getTitle = () => {
    switch (requiredFor) {
      case 'backup':
        return 'Connect Cloud Storage for Backups';
      case 'primary':
        return 'Connect Cloud Database Storage';
      case 'hybrid':
        return 'Connect Cloud Storage for Hybrid Mode';
      default:
        return 'Connect Cloud Storage';
    }
  };

  const getDescription = () => {
    switch (requiredFor) {
      case 'backup':
        return 'Your data will stay local, with encrypted backups stored in the cloud for safety.';
      case 'primary':
        return 'Your data will be stored in the cloud as your primary database, with local caching for speed.';
      case 'hybrid':
        return 'Your data will be intelligently synced between local and cloud storage.';
      default:
        return 'Connect to a cloud storage provider to sync your health data.';
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setAuthError(null);
  };

  const handleAuthenticate = async () => {
    if (!selectedProvider) return;

    const provider = cloudProviders.find(p => p.id === selectedProvider);
    if (!provider || !provider.isAvailable) {
      setAuthError('Selected provider is not available yet');
      return;
    }

    setAuthStatus('authenticating');
    setAuthError(null);

    try {
      // For now, we'll simulate authentication
      // In a real implementation, this would handle OAuth flow
      if (selectedProvider === 'google-drive') {
        await simulateGoogleDriveAuth();
      } else {
        throw new Error('Provider not implemented yet');
      }

      setAuthStatus('success');
      
      // Simulate successful authentication
      const mockCredentials = {
        provider: selectedProvider,
        accessToken: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
        userId: 'user_' + Math.random().toString(36).substr(2, 9)
      };

      // Wait a moment to show success state
      setTimeout(() => {
        onAuthComplete(selectedProvider, mockCredentials);
      }, 1000);

    } catch (error) {
      setAuthStatus('error');
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const simulateGoogleDriveAuth = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate auth flow
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate for demo
          resolve();
        } else {
          reject(new Error('User cancelled authentication'));
        }
      }, 2000);
    });
  };

  const selectedProviderInfo = selectedProvider 
    ? cloudProviders.find(p => p.id === selectedProvider)
    : null;

  if (authStatus === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Successfully Connected!
        </h3>
        <p className="text-gray-600 mb-4">
          {selectedProviderInfo?.name} is now connected and ready to sync your health data.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Shield className="w-4 h-4" />
          <span>Your data will be encrypted before upload</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {getDescription()}
        </p>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cloudProviders.map((provider) => (
          <div
            key={provider.id}
            className={`
              relative p-4 border-2 rounded-lg cursor-pointer transition-all
              ${!provider.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => provider.isAvailable && handleProviderSelect(provider.id)}
          >
            {!provider.isAvailable && (
              <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
                Coming Soon
              </div>
            )}

            <div className="flex items-center space-x-3 mb-3">
              {provider.icon}
              <h3 className="font-semibold text-gray-900">
                {provider.name}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {provider.description}
            </p>

            {selectedProvider === provider.id && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Setup Steps */}
      {selectedProviderInfo && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Setup Steps for {selectedProviderInfo.name}:
          </h3>
          <ol className="space-y-2">
            {selectedProviderInfo.setupSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Security & Privacy</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All data is encrypted with AES-256 before leaving your device</li>
              <li>• Your encryption keys never leave your device</li>
              <li>• Cloud providers only store encrypted data they cannot read</li>
              <li>• You can revoke access at any time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Authentication Error */}
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 mb-1">Authentication Failed</h4>
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onSkip}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>

          <button
            onClick={handleAuthenticate}
            disabled={!selectedProvider || authStatus === 'authenticating'}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2
              ${selectedProvider && authStatus !== 'authenticating'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {authStatus === 'authenticating' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Connect {selectedProviderInfo?.name || 'Provider'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Options</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Enable automatic sync</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Compress data before upload</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Use additional encryption layer</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
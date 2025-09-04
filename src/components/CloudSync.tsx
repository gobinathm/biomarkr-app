import React, { useState, useEffect } from 'react';
import { cloudStorageManager, CloudProvider, SyncStatus as CloudSyncStatus } from '../services/cloudStorageManager';
import { getAvailableProviders } from '../utils/providerValidation';
import { isDemoMode } from '../data/mockData';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Upload,
  Clock,
  AlertCircle,
  Shield,
  Unlink,
  Link
} from 'lucide-react';

type SyncStatus = CloudSyncStatus;
type ConflictResolution = 'keep-local' | 'keep-cloud' | 'merge';

interface CloudSyncProps {
  onShowAlert: (options: { title: string; message: string; type?: string }) => void;
}

export function CloudSync({ onShowAlert }: CloudSyncProps) {
  // Check if we're in demo mode
  if (isDemoMode()) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cloud Storage & Sync</h2>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CloudOff className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-purple-900 mb-2">
                  Cloud Storage Disabled in Demo Mode
                </h3>
                <p className="text-purple-800 mb-4">
                  Cloud storage and synchronization features are disabled when using demo data. 
                  This ensures that sample data doesn't interfere with your real cloud storage accounts.
                </p>
                <div className="bg-purple-100 rounded-md p-3">
                  <p className="text-sm text-purple-700">
                    <strong>To use cloud storage:</strong> Create a new vault or restore from an existing backup 
                    instead of using demo mode. You can exit demo mode from the Settings page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [currentState, setCurrentState] = useState(cloudStorageManager.getStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [showRestoreHelp, setShowRestoreHelp] = useState(false);
  const [showCheckBackupsHelp, setShowCheckBackupsHelp] = useState(false);

  // Check if we should show help messages and auto-restore connection
  useEffect(() => {
    const shouldShowRestoreHelp = localStorage.getItem('biomarkr-show-restore-help');
    const shouldShowCheckBackupsHelp = localStorage.getItem('biomarkr-show-check-backups-help');
    const restoreProvider = localStorage.getItem('biomarkr-restore-provider');
    
    if (shouldShowRestoreHelp) {
      setShowRestoreHelp(true);
      localStorage.removeItem('biomarkr-show-restore-help');
      
      // Auto-reconnect to the provider used for restore
      if (restoreProvider && !cloudStorageManager.isConnected()) {
        handleAutoReconnect(restoreProvider as CloudProvider);
        localStorage.removeItem('biomarkr-restore-provider');
      }
    }
    
    if (shouldShowCheckBackupsHelp) {
      setShowCheckBackupsHelp(true);
      localStorage.removeItem('biomarkr-show-check-backups-help');
      // Auto-open connection modal to help user connect
      setShowConnectionModal(true);
    }
  }, []);

  const handleAutoReconnect = async (provider: CloudProvider) => {
    try {
      setIsLoading(true);
      await cloudStorageManager.connect(provider);
      onShowAlert({
        title: 'Cloud Storage Connected',
        message: `Successfully reconnected to ${provider}. Your backup has been restored and syncing is active.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Auto-reconnection failed:', error);
      // Don't show error - user can manually connect if needed
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const unsubscribe = cloudStorageManager.onStatusChange((status, provider) => {
      setCurrentState({ status, provider, lastSync: cloudStorageManager.getStatus().lastSync });
    });
    return unsubscribe;
  }, []);

  const handleConnect = async (provider: CloudProvider) => {
    try {
      setIsLoading(true);
      await cloudStorageManager.connect(provider);
      
      // If user came from "Check for Existing Data" flow, automatically check for backups
      if (showCheckBackupsHelp) {
        try {
          const backups = await cloudStorageManager.getBackupList(provider);
          if (backups.length > 0) {
            onShowAlert({
              title: 'Existing Data Found!',
              message: `Found ${backups.length} backup(s) in your ${getProviderName(provider)}. You can restore your previous data using the Backup Manager below.`,
              type: 'success'
            });
            setShowCheckBackupsHelp(false);
          } else {
            onShowAlert({
              title: 'No Previous Data Found',
              message: `No Biomarkr backups were found in your ${getProviderName(provider)}. You can start fresh by creating new lab result entries.`,
              type: 'info'
            });
          }
        } catch (error) {
          console.log('Error checking for backups:', error);
          onShowAlert({
            title: 'Connected Successfully',
            message: `Your ${getProviderName(provider)} account has been connected. Check the Backup Manager below to see if you have any previous data.`,
            type: 'success'
          });
        }
      } else {
        onShowAlert({
          title: 'Connected Successfully',
          message: `Your ${getProviderName(provider)} account has been connected.`,
          type: 'success'
        });
      }
    } catch (error) {
      onShowAlert({
        title: 'Connection Failed',
        message: error instanceof Error ? error.message : 'Failed to connect to cloud storage',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    cloudStorageManager.disconnect();
    onShowAlert({
      title: 'Disconnected',
      message: 'Cloud storage has been disconnected.',
      type: 'info'
    });
  };

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      
      // Collect all app data for backup
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        profiles: JSON.parse(localStorage.getItem('biomarkr-profiles') || '[]'),
        testResults: JSON.parse(localStorage.getItem('biomarkr-test-results') || '[]'),
        settings: JSON.parse(localStorage.getItem('biomarkr-settings') || '{}'),
        referenceRanges: JSON.parse(localStorage.getItem('biomarkr-reference-ranges') || '[]'),
        reminders: JSON.parse(localStorage.getItem('biomarkr-reminders') || '[]')
      };
      
      await cloudStorageManager.backup(backupData);
      onShowAlert({
        title: 'Backup Complete',
        message: 'Your data has been successfully backed up to the cloud.',
        type: 'success'
      });
    } catch (error) {
      onShowAlert({
        title: 'Backup Failed',
        message: error instanceof Error ? error.message : 'Failed to backup data',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsLoading(true);
      const backupData = await cloudStorageManager.restore();
      
      // Restore all data
      if (backupData.profiles) localStorage.setItem('biomarkr-profiles', JSON.stringify(backupData.profiles));
      if (backupData.testResults) localStorage.setItem('biomarkr-test-results', JSON.stringify(backupData.testResults));
      if (backupData.settings) localStorage.setItem('biomarkr-settings', JSON.stringify(backupData.settings));
      if (backupData.referenceRanges) localStorage.setItem('biomarkr-reference-ranges', JSON.stringify(backupData.referenceRanges));
      if (backupData.reminders) localStorage.setItem('biomarkr-reminders', JSON.stringify(backupData.reminders));
      
      onShowAlert({
        title: 'Restore Complete',
        message: 'Your data has been successfully restored from the cloud backup. The page will refresh to load the restored data.',
        type: 'success'
      });
      
      // Refresh the page to reload all data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      onShowAlert({
        title: 'Restore Failed',
        message: error instanceof Error ? error.message : 'Failed to restore data',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderName = (provider: CloudProvider): string => {
    switch (provider) {
      case 'onedrive': return 'Microsoft OneDrive';
      case 'googledrive': return 'Google Drive';
      case 'dropbox': return 'Dropbox';
      default: return 'Cloud Storage';
    }
  };

  return (
    <div className="space-y-6">
      {showRestoreHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Download className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 mb-1">Ready to Restore Your Data</h3>
              <p className="text-sm text-blue-800 mb-3">
                You chose to restore from an existing backup. Your cloud storage provider should already be connected. 
                Use the backup manager below to restore your previous lab results and settings.
              </p>
              <button
                onClick={() => setShowRestoreHelp(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Got it, dismiss this message
              </button>
            </div>
            <button
              onClick={() => setShowRestoreHelp(false)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {showCheckBackupsHelp && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <RefreshCw className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-900 mb-1">Checking for Your Previous Data</h3>
              <p className="text-sm text-green-800 mb-3">
                {showConnectionModal ? 
                  "Choose your cloud storage provider to check for existing Biomarkr backups. After connecting, we'll automatically look for your previous data." :
                  "Connect to your cloud storage provider to check for existing Biomarkr backups. We'll automatically search for your previous lab results and settings after you connect."
                }
              </p>
              {!showConnectionModal && (
                <button
                  onClick={() => setShowConnectionModal(true)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium mr-4"
                >
                  Connect Now
                </button>
              )}
              <button
                onClick={() => setShowCheckBackupsHelp(false)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
            <button
              onClick={() => setShowCheckBackupsHelp(false)}
              className="text-green-400 hover:text-green-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <SyncStatusChip status={currentState.status} lastSync={currentState.lastSync} />
      
      {currentState.provider ? (
        <ConnectedProviderCard
          provider={currentState.provider}
          status={currentState.status}
          lastSync={currentState.lastSync}
          isLoading={isLoading}
          onDisconnect={handleDisconnect}
          onBackup={handleBackup}
          onRestore={handleRestore}
          onShowConflict={() => setShowConflictModal(true)}
        />
      ) : (
        <DisconnectedCard onConnect={() => setShowConnectionModal(true)} />
      )}

      {showConflictModal && (
        <ConflictModal
          onClose={() => setShowConflictModal(false)}
          onResolve={(resolution) => {
            onResolveConflict(resolution);
            setShowConflictModal(false);
          }}
        />
      )}

      {showConnectionModal && (
        <ConnectionModal
          onClose={() => setShowConnectionModal(false)}
          onConnect={(provider) => {
            handleConnect(provider as CloudProvider);
            setShowConnectionModal(false);
          }}
        />
      )}
    </div>
  );
}

function SyncStatusChip({ status, lastSync }: { status: SyncStatus; lastSync?: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'synced':
        return {
          icon: CheckCircle,
          text: 'Up to date',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'pending':
        return {
          icon: RefreshCw,
          text: 'Syncing...',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'conflict':
        return {
          icon: AlertTriangle,
          text: 'Sync conflict',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Sync error',
          color: 'red',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      case 'disconnected':
        return {
          icon: CloudOff,
          text: 'Not connected',
          color: 'gray',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-2 rounded-full ${config.bgColor} border border-${config.color}-200`}>
      <Icon className={`w-4 h-4 mr-2 ${config.iconColor} ${status === 'pending' ? 'animate-spin' : ''}`} />
      <span className={`text-sm font-medium ${config.textColor} dark:text-white`}>{config.text}</span>
      {lastSync && status === 'synced' && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">• {lastSync}</span>
      )}
    </div>
  );
}

function ConnectedProviderCard({
  provider,
  status,
  lastSync,
  isLoading,
  onDisconnect,
  onBackup,
  onRestore,
  onShowConflict
}: {
  provider: CloudProvider;
  status: SyncStatus;
  lastSync?: string | null;
  isLoading: boolean;
  onDisconnect: () => void;
  onBackup: () => void;
  onRestore: () => void;
  onShowConflict: () => void;
}) {
  const getProviderConfig = () => {
    switch (provider) {
      case 'onedrive':
        return { name: 'Microsoft OneDrive', color: 'blue' };
      case 'googledrive':
        return { name: 'Google Drive', color: 'red' };
      case 'dropbox':
        return { name: 'Dropbox', color: 'indigo' };
      default:
        return { name: 'Cloud Drive', color: 'gray' };
    }
  };

  const providerConfig = getProviderConfig();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Cloud className={`w-6 h-6 text-${providerConfig.color}-600 mr-3`} />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{providerConfig.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connected and ready for backup</p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          title="Disconnect"
        >
          <Unlink className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-start">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-900 mb-1">Secure Storage</p>
            <p className="text-green-800">
              One encrypted file stored in: <code className="bg-green-100 px-1 rounded">/Apps/LabTracker/vault.enc</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={onBackup}
          disabled={status === 'pending' || isLoading}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Backing up...' : 'Backup Now'}
        </button>
        <button
          onClick={onRestore}
          disabled={status === 'pending' || isLoading}
          className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Restoring...' : 'Restore'}
        </button>
      </div>

      {status === 'conflict' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900 mb-1">Sync Conflict Detected</p>
                <p className="text-yellow-800">Your local data and cloud backup have different versions.</p>
              </div>
            </div>
            <button
              onClick={onShowConflict}
              className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
            >
              Resolve
            </button>
          </div>
        </div>
      )}

      {lastSync && (
        <div className="text-xs text-gray-500 mt-3 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Last synced: {lastSync}
        </div>
      )}
    </div>
  );
}

function DisconnectedCard({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="text-center">
        <CloudOff className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">No Cloud Drive Connected</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Connect a cloud drive to backup and sync your encrypted vault across devices.
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium flex items-center mx-auto"
        >
          <Link className="w-4 h-4 mr-2" />
          Connect Cloud Drive
        </button>
      </div>
    </div>
  );
}

function ConflictModal({
  onClose,
  onResolve
}: {
  onClose: () => void;
  onResolve: (resolution: ConflictResolution) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resolve Sync Conflict</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Your local vault and cloud backup contain different data. Choose how to resolve this conflict:
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onResolve('keep-local')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <p className="font-medium text-gray-900 mb-1">Keep Local Version</p>
              <p className="text-sm text-gray-600">
                Use your device's data and overwrite the cloud backup
              </p>
            </button>

            <button
              onClick={() => onResolve('keep-cloud')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <p className="font-medium text-gray-900 mb-1">Keep Cloud Version</p>
              <p className="text-sm text-gray-600">
                Replace your local data with the cloud backup
              </p>
            </button>

            <button
              onClick={() => onResolve('merge')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <p className="font-medium text-gray-900 mb-1">Smart Merge</p>
              <p className="text-sm text-gray-600">
                Combine both versions, keeping the latest data for each item
              </p>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> This action cannot be undone. Consider backing up your current data before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionModal({
  onClose,
  onConnect
}: {
  onClose: () => void;
  onConnect: (provider: string) => void;
}) {
  // Get only providers with valid (non-demo) client IDs
  const providers = getAvailableProviders();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connect Cloud Drive</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose a cloud drive provider to backup and sync your encrypted vault.
          </p>

          {providers.length > 0 ? (
            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => onConnect(provider.id)}
                  className="w-full flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                >
                <Cloud className={`w-5 h-5 text-${provider.color}-600 mr-3`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{provider.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{provider.description}</p>
                </div>
              </button>
            ))}
          </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Providers Configured</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Cloud storage providers require API client IDs to be configured.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-left">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Setup Instructions:</p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Register apps with cloud providers (OneDrive, Google Drive, Dropbox)</li>
                  <li>Add client IDs to your .env file:</li>
                  <li className="ml-4 font-mono text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">VITE_ONEDRIVE_CLIENT_ID=your-client-id</li>
                  <li className="ml-4 font-mono text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">VITE_GOOGLE_CLIENT_ID=your-client-id</li>
                  <li className="ml-4 font-mono text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">VITE_DROPBOX_CLIENT_ID=your-client-id</li>
                  <li>See CLOUD_STORAGE.md for detailed setup instructions</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {providers.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">Privacy & Security</p>
                <ul className="text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Minimal OAuth permissions (app folder access only)</li>
                  <li>• Data is encrypted before upload</li>
                  <li>• Stored in dedicated app folder: /Apps/Biomarkr/</li>
                  <li>• We never see your health information</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
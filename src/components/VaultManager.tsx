import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  X
} from 'lucide-react';

interface VaultManagerProps {
  isLocked: boolean;
  hasPassphrase: boolean;
  autoLockEnabled: boolean;
  autoLockMinutes: number;
  lastActivity?: string;
  onUnlock: (passphrase?: string) => void;
  onLock: () => void;
  onSetPassphrase: (passphrase: string) => void;
  onRemovePassphrase: (currentPassphrase: string) => void;
  onUpdateAutoLock: (enabled: boolean, minutes: number) => void;
}

export function VaultManager({
  isLocked,
  hasPassphrase,
  autoLockEnabled,
  autoLockMinutes,
  lastActivity,
  onUnlock,
  onLock,
  onSetPassphrase,
  onRemovePassphrase,
  onUpdateAutoLock
}: VaultManagerProps) {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const [showAutoLockModal, setShowAutoLockModal] = useState(false);

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <VaultLockedScreen
          hasPassphrase={hasPassphrase}
          onUnlock={onUnlock}
          showModal={showUnlockModal}
          setShowModal={setShowUnlockModal}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VaultStatusCard
        hasPassphrase={hasPassphrase}
        autoLockEnabled={autoLockEnabled}
        autoLockMinutes={autoLockMinutes}
        lastActivity={lastActivity}
        onLock={onLock}
        onShowPassphraseModal={() => setShowPassphraseModal(true)}
        onShowAutoLockModal={() => setShowAutoLockModal(true)}
      />

      {showPassphraseModal && (
        <PassphraseModal
          hasPassphrase={hasPassphrase}
          onClose={() => setShowPassphraseModal(false)}
          onSetPassphrase={onSetPassphrase}
          onRemovePassphrase={onRemovePassphrase}
        />
      )}

      {showAutoLockModal && (
        <AutoLockModal
          enabled={autoLockEnabled}
          minutes={autoLockMinutes}
          onClose={() => setShowAutoLockModal(false)}
          onUpdate={onUpdateAutoLock}
        />
      )}
    </div>
  );
}

function VaultLockedScreen({
  hasPassphrase,
  onUnlock,
  showModal,
  setShowModal
}: {
  hasPassphrase: boolean;
  onUnlock: (passphrase?: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (hasPassphrase) {
      if (!passphrase) {
        setError('Please enter your passphrase');
        return;
      }
      // In a real app, this would validate the passphrase
      onUnlock(passphrase);
    } else {
      onUnlock();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vault Locked</h2>
        <p className="text-gray-600">
          {hasPassphrase 
            ? 'Enter your passphrase to access your health data'
            : 'Your vault was automatically locked for security'
          }
        </p>
      </div>

      {hasPassphrase && (
        <div className="mb-6">
          <label htmlFor="unlock-passphrase" className="block text-sm font-medium text-gray-700 mb-2">
            Passphrase
          </label>
          <div className="relative">
            <input
              type={showPassphrase ? 'text' : 'password'}
              id="unlock-passphrase"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your passphrase"
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
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
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )}

      <button
        onClick={handleUnlock}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <Unlock className="w-5 h-5 mr-2" />
        Unlock Vault
      </button>

      {hasPassphrase && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Forgot your passphrase?
          </button>
        </div>
      )}
    </div>
  );
}

function VaultStatusCard({
  hasPassphrase,
  autoLockEnabled,
  autoLockMinutes,
  lastActivity,
  onLock,
  onShowPassphraseModal,
  onShowAutoLockModal
}: {
  hasPassphrase: boolean;
  autoLockEnabled: boolean;
  autoLockMinutes: number;
  lastActivity?: string;
  onLock: () => void;
  onShowPassphraseModal: () => void;
  onShowAutoLockModal: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
            <Unlock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Vault Unlocked</h3>
            <p className="text-sm text-gray-600">Your health data is accessible</p>
          </div>
        </div>
        <button
          onClick={onLock}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
        >
          <Lock className="w-4 h-4 mr-2" />
          Lock Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Passphrase</span>
            </div>
            <button
              onClick={onShowPassphraseModal}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {hasPassphrase ? 'Change' : 'Set'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {hasPassphrase ? 'Protected with passphrase' : 'Device security only'}
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Auto-lock</span>
            </div>
            <button
              onClick={onShowAutoLockModal}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {autoLockEnabled ? 'Edit' : 'Enable'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {autoLockEnabled ? `After ${autoLockMinutes} minutes` : 'Disabled'}
          </p>
        </div>
      </div>

      {lastActivity && (
        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Last activity: {lastActivity}
        </div>
      )}

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Security Status</p>
            <p className="text-blue-800">
              Your vault is encrypted and stored locally in your browser's secure storage (IndexedDB).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassphraseModal({
  hasPassphrase,
  onClose,
  onSetPassphrase,
  onRemovePassphrase
}: {
  hasPassphrase: boolean;
  onClose: () => void;
  onSetPassphrase: (passphrase: string) => void;
  onRemovePassphrase: (currentPassphrase: string) => void;
}) {
  const [currentPassphrase, setCurrentPassphrase] = useState('');
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrases, setShowPassphrases] = useState(false);
  const [action, setAction] = useState<'set' | 'change' | 'remove'>(hasPassphrase ? 'change' : 'set');

  const passphraseMatch = newPassphrase === confirmPassphrase && newPassphrase.length > 0;
  const canProceed = action === 'remove' ? currentPassphrase.length > 0 : passphraseMatch && (hasPassphrase ? currentPassphrase.length > 0 : true);

  const handleSubmit = () => {
    if (action === 'remove') {
      onRemovePassphrase(currentPassphrase);
    } else {
      onSetPassphrase(newPassphrase);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {action === 'set' ? 'Set Passphrase' : action === 'change' ? 'Change Passphrase' : 'Remove Passphrase'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasPassphrase && (
          <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setAction('change')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg ${
                  action === 'change' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Change
              </button>
              <button
                onClick={() => setAction('remove')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg ${
                  action === 'remove' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {hasPassphrase && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrases ? 'text' : 'password'}
                  value={currentPassphrase}
                  onChange={(e) => setCurrentPassphrase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter current passphrase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrases(!showPassphrases)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassphrases ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {action !== 'remove' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {hasPassphrase ? 'New Passphrase' : 'Passphrase'}
                </label>
                <input
                  type={showPassphrases ? 'text' : 'password'}
                  value={newPassphrase}
                  onChange={(e) => setNewPassphrase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new passphrase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Passphrase
                </label>
                <input
                  type={showPassphrases ? 'text' : 'password'}
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    confirmPassphrase && !passphraseMatch ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new passphrase"
                />
                {confirmPassphrase && !passphraseMatch && (
                  <p className="mt-1 text-sm text-red-600">Passphrases don't match</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 mb-1">Important</p>
              <p className="text-amber-800">
                {action === 'remove' 
                  ? 'Removing your passphrase will rely on device security only. Your vault can still be recovered from cloud backups.'
                  : 'If you forget your passphrase, your vault can only be recovered from a cloud backup. We cannot reset it for you.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canProceed}
            className={`flex-1 font-medium py-2 px-4 rounded-lg ${
              action === 'remove'
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white'
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white'
            } disabled:cursor-not-allowed`}
          >
            {action === 'set' ? 'Set Passphrase' : action === 'change' ? 'Change Passphrase' : 'Remove Passphrase'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AutoLockModal({
  enabled,
  minutes,
  onClose,
  onUpdate
}: {
  enabled: boolean;
  minutes: number;
  onClose: () => void;
  onUpdate: (enabled: boolean, minutes: number) => void;
}) {
  const [autoLockEnabled, setAutoLockEnabled] = useState(enabled);
  const [autoLockMinutes, setAutoLockMinutes] = useState(minutes);

  const timeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' }
  ];

  const handleSave = () => {
    onUpdate(autoLockEnabled, autoLockMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Auto-lock Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-autolock"
              checked={autoLockEnabled}
              onChange={(e) => setAutoLockEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable-autolock" className="ml-3 text-sm font-medium text-gray-700">
              Enable auto-lock
            </label>
          </div>

          {autoLockEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lock after inactivity
              </label>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-start">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Security Benefit</p>
              <p className="text-blue-800">
                Auto-lock protects your health data if you step away from your device or forget to lock manually.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
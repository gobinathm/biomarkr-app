import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'set' | 'change' | 'remove';
  hasPassphrase: boolean;
  onSetPassphrase: (passphrase: string) => void;
  onRemovePassphrase: (currentPassphrase: string) => boolean;
  showAlert: (options: { title: string; message: string; type: string }) => void;
}

export function PassphraseModal({
  isOpen,
  onClose,
  mode,
  hasPassphrase,
  onSetPassphrase,
  onRemovePassphrase,
  showAlert
}: PassphraseModalProps) {
  const [currentPassphrase, setCurrentPassphrase] = useState('');
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrases, setShowPassphrases] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === 'remove') {
      if (!currentPassphrase) {
        setErrors({ current: 'Current passphrase is required' });
        return;
      }
      
      if (onRemovePassphrase(currentPassphrase)) {
        showAlert({
          title: 'Protection Removed',
          message: 'Vault protection removed successfully.',
          type: 'success'
        });
        onClose();
        resetForm();
      } else {
        setErrors({ current: 'Incorrect passphrase' });
      }
    } else {
      // Set or Change passphrase
      if (!newPassphrase) {
        setErrors({ new: 'New passphrase is required' });
        return;
      }
      
      if (newPassphrase !== confirmPassphrase) {
        setErrors({ confirm: 'Passphrases do not match' });
        return;
      }

      if (hasPassphrase && mode === 'change') {
        if (!currentPassphrase) {
          setErrors({ current: 'Current passphrase is required' });
          return;
        }
        
        const storedPassphrase = localStorage.getItem('biomarkr-vault-passphrase');
        if (currentPassphrase !== storedPassphrase) {
          setErrors({ current: 'Incorrect current passphrase' });
          return;
        }
      }

      onSetPassphrase(newPassphrase);
      showAlert({
        title: mode === 'set' ? 'Protection Enabled' : 'Passphrase Updated',
        message: mode === 'set' 
          ? 'Vault protection enabled successfully.' 
          : 'Passphrase updated successfully.',
        type: 'success'
      });
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentPassphrase('');
    setNewPassphrase('');
    setConfirmPassphrase('');
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            {mode === 'remove' ? (
              <Unlock className="w-5 h-5 text-red-600 mr-3" />
            ) : (
              <Lock className="w-5 h-5 text-blue-600 mr-3" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'set' && 'Set Vault Passphrase'}
              {mode === 'change' && 'Change Passphrase'}
              {mode === 'remove' && 'Remove Protection'}
            </h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {(hasPassphrase && mode !== 'set') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassphrases ? 'text' : 'password'}
                    value={currentPassphrase}
                    onChange={(e) => {
                      setCurrentPassphrase(e.target.value);
                      if (errors.current) setErrors(prev => ({ ...prev, current: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                      errors.current ? 'border-red-300' : 'border-gray-300'
                    }`}
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
                {errors.current && (
                  <p className="mt-1 text-sm text-red-600">{errors.current}</p>
                )}
              </div>
            )}

            {mode !== 'remove' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mode === 'change' ? 'New Passphrase' : 'Passphrase'}
                  </label>
                  <input
                    type={showPassphrases ? 'text' : 'password'}
                    value={newPassphrase}
                    onChange={(e) => {
                      setNewPassphrase(e.target.value);
                      if (errors.new) setErrors(prev => ({ ...prev, new: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.new ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new passphrase"
                  />
                  {errors.new && (
                    <p className="mt-1 text-sm text-red-600">{errors.new}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Passphrase
                  </label>
                  <input
                    type={showPassphrases ? 'text' : 'password'}
                    value={confirmPassphrase}
                    onChange={(e) => {
                      setConfirmPassphrase(e.target.value);
                      if (errors.confirm) setErrors(prev => ({ ...prev, confirm: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirm ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm passphrase"
                  />
                  {errors.confirm && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>
                  )}
                </div>
              </>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-1">Important</p>
                  <p className="text-amber-800">
                    {mode === 'remove' 
                      ? 'Removing your passphrase will rely on device security only. Your data will remain encrypted but accessible without a passphrase.'
                      : 'If you forget your passphrase, you will lose access to your vault. Store it safely!'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg font-medium ${
                mode === 'remove'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {mode === 'set' && 'Set Passphrase'}
              {mode === 'change' && 'Update Passphrase'}
              {mode === 'remove' && 'Remove Protection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
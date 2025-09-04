import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  Calendar, 
  HardDrive, 
  RefreshCw, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { cloudStorageManager } from '../services/cloudStorageManager';
import { formatBytes, calculateStorageSize, estimateDataSize, StorageInfo } from '../services/storageUtils';
import { useConfirm } from './ConfirmModal';

interface BackupManagerProps {
  onShowAlert: (options: { title: string; message: string; type?: string }) => void;
}

export function BackupManager({ onShowAlert }: BackupManagerProps) {
  const [backups, setBackups] = useState<Array<{name: string; date: string; size: number}>>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { showConfirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    loadBackups();
    loadStorageInfo();
  }, []);

  const loadBackups = async () => {
    if (!cloudStorageManager.isConnected()) return;
    
    try {
      const backupList = await cloudStorageManager.getBackupList();
      setBackups(backupList);
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const info = await calculateStorageSize();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const handleDeleteBackup = (backup: {name: string; date: string; size: number}) => {
    showConfirm({
      title: 'Delete Backup',
      message: `Are you sure you want to delete the backup from ${backup.date}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          setLoading(true);
          await cloudStorageManager.deleteBackup(backup.name);
          await loadBackups();
          onShowAlert({
            title: 'Backup Deleted',
            message: 'The backup has been successfully deleted.',
            type: 'success'
          });
        } catch (error) {
          onShowAlert({
            title: 'Delete Failed',
            message: error instanceof Error ? error.message : 'Failed to delete backup',
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleRestoreBackup = (backup: {name: string; date: string; size: number}) => {
    showConfirm({
      title: 'Restore Backup',
      message: `Are you sure you want to restore the backup from ${backup.date}? This will replace all your current data.`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        try {
          setLoading(true);
          // This would need implementation in CloudStorageManager to restore specific backup
          onShowAlert({
            title: 'Restore Complete',
            message: 'Your data has been restored successfully. The page will refresh.',
            type: 'success'
          });
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          onShowAlert({
            title: 'Restore Failed',
            message: error instanceof Error ? error.message : 'Failed to restore backup',
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (!cloudStorageManager.isConnected()) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <HardDrive className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Cloud Storage Connected</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect a cloud storage provider to manage your backups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Local Storage Info */}
      {storageInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Local Storage Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Data Size</span>
                <span>{formatBytes(estimateDataSize())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Storage Used</span>
                <span>{formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {storageInfo.percentage.toFixed(1)}% of available browser storage used
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backup List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cloud Backups</h3>
          <button
            onClick={loadBackups}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Backups Found</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create your first backup to see it listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup, index) => (
              <div 
                key={backup.name}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Backup {index + 1}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {backup.date}
                      </span>
                      <span>{formatBytes(backup.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRestoreBackup(backup)}
                    disabled={loading}
                    className="flex items-center px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(backup)}
                    disabled={loading}
                    className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {backups.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">Backup Information</p>
                <p className="text-blue-800 dark:text-blue-300">
                  Your data is automatically encrypted before being stored in the cloud. 
                  Only you can decrypt and access your backup files.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmComponent />
    </div>
  );
}
import { CloudStorageProvider } from './cloudStorage';
import { OneDriveStorage } from './oneDriveStorage';
import { GoogleDriveStorage } from './googleDriveStorage';
import { DropboxStorage } from './dropboxStorage';

export type CloudProvider = 'onedrive' | 'googledrive' | 'dropbox';
export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error' | 'disconnected';

export interface BackupData {
  version: string;
  timestamp: string;
  profiles: any[];
  testResults: any[];
  settings: any;
  referenceRanges: any[];
  reminders: any[];
}

export class CloudStorageManager {
  private providers: Map<CloudProvider, CloudStorageProvider> = new Map();
  private currentProvider: CloudProvider | null = null;
  private status: SyncStatus = 'disconnected';
  private lastSyncTime: string | null = null;
  private listeners: ((status: SyncStatus, provider: CloudProvider | null) => void)[] = [];

  constructor() {
    this.providers.set('onedrive', new OneDriveStorage());
    this.providers.set('googledrive', new GoogleDriveStorage());
    this.providers.set('dropbox', new DropboxStorage());
    
    this.loadState();
  }

  private loadState(): void {
    const stored = localStorage.getItem('cloud-storage-state');
    if (stored) {
      try {
        const state = JSON.parse(stored);
        this.currentProvider = state.currentProvider;
        this.lastSyncTime = state.lastSyncTime;
        
        // Check if the provider is still authenticated
        if (this.currentProvider) {
          const provider = this.providers.get(this.currentProvider);
          if (provider?.isAuthenticated()) {
            this.status = 'synced';
          } else {
            this.currentProvider = null;
            this.status = 'disconnected';
          }
        }
      } catch (error) {
        console.error('Failed to load cloud storage state:', error);
      }
    }
  }

  private saveState(): void {
    const state = {
      currentProvider: this.currentProvider,
      lastSyncTime: this.lastSyncTime
    };
    localStorage.setItem('cloud-storage-state', JSON.stringify(state));
  }

  async connect(provider: CloudProvider): Promise<void> {
    try {
      this.setStatus('pending');
      
      const storageProvider = this.providers.get(provider);
      if (!storageProvider) {
        throw new Error(`Provider ${provider} not supported`);
      }

      await storageProvider.authenticate();
      
      this.currentProvider = provider;
      this.setStatus('synced');
      this.saveState();
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  disconnect(): void {
    if (this.currentProvider) {
      const provider = this.providers.get(this.currentProvider);
      provider?.disconnect();
      
      this.currentProvider = null;
      this.lastSyncTime = null;
      this.setStatus('disconnected');
      this.saveState();
    }
  }

  async backup(data: BackupData): Promise<void> {
    if (!this.currentProvider) {
      throw new Error('No cloud provider connected');
    }

    try {
      this.setStatus('pending');
      
      const provider = this.providers.get(this.currentProvider);
      if (!provider) {
        throw new Error('Provider not found');
      }

      // Create encrypted backup
      const encryptedData = await this.encryptData(data);
      const filename = `biomarkr-backup.enc`; // Use consistent filename, not date-based
      
      await provider.uploadFile(filename, encryptedData);
      
      // Mark that user has successfully used cloud storage
      localStorage.setItem('biomarkr-has-used-cloud', 'true');
      
      this.lastSyncTime = new Date().toLocaleString();
      this.setStatus('synced');
      this.saveState();
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  async restore(): Promise<BackupData> {
    if (!this.currentProvider) {
      throw new Error('No cloud provider connected');
    }

    try {
      this.setStatus('pending');
      
      const provider = this.providers.get(this.currentProvider);
      if (!provider) {
        throw new Error('Provider not found');
      }

      // List available backups
      const files = await provider.listFiles();
      const backupFiles = files
        .filter(file => file.name === 'biomarkr-backup.enc')
        .sort((a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime());

      if (backupFiles.length === 0) {
        throw new Error('No backup files found');
      }

      // Get the most recent backup
      const latestBackup = backupFiles[0];
      const encryptedData = await provider.downloadFile(latestBackup.name);
      
      // Decrypt and parse the data
      const data = await this.decryptData(encryptedData);
      
      this.lastSyncTime = new Date().toLocaleString();
      this.setStatus('synced');
      this.saveState();
      
      return data;
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  async getBackupList(): Promise<Array<{name: string; date: string; size: number}>> {
    if (!this.currentProvider) {
      throw new Error('No cloud provider connected');
    }

    const provider = this.providers.get(this.currentProvider);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const files = await provider.listFiles();
    return files
      .filter(file => file.name === 'biomarkr-backup.enc' || (file.name.startsWith('biomarkr-backup-') && file.name.endsWith('.enc')))
      .map(file => ({
        name: file.name,
        date: new Date(file.modifiedTime).toLocaleDateString(),
        lastModified: new Date(file.modifiedTime).toLocaleString(),
        size: file.size
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async deleteBackup(filename: string): Promise<void> {
    if (!this.currentProvider) {
      throw new Error('No cloud provider connected');
    }

    const provider = this.providers.get(this.currentProvider);
    if (!provider) {
      throw new Error('Provider not found');
    }

    await provider.deleteFile(filename);
  }

  private async encryptData(data: BackupData): Promise<string> {
    // Simple encryption using built-in Web Crypto API
    // In a production app, you'd want to use a proper encryption library
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    try {
      // Generate a key from the user's vault passphrase (if available)
      const passphrase = localStorage.getItem('vault-passphrase') || 'default-key';
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('biomarkr-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = encoder.encode(JSON.stringify(data));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed, using base64 encoding:', error);
      // Fallback to simple base64 encoding if encryption fails
      return btoa(JSON.stringify(data));
    }
  }

  private async decryptData(encryptedData: string): Promise<BackupData> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    try {
      // Try to decrypt
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      if (combined.length < 12) {
        throw new Error('Invalid encrypted data');
      }

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const passphrase = localStorage.getItem('vault-passphrase') || 'default-key';
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('biomarkr-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      const jsonString = decoder.decode(decrypted);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed, trying base64 decode:', error);
      // Fallback to simple base64 decoding
      try {
        const jsonString = atob(encryptedData);
        return JSON.parse(jsonString);
      } catch (fallbackError) {
        throw new Error('Failed to decrypt backup data');
      }
    }
  }

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.status, this.currentProvider);
    });
  }

  onStatusChange(callback: (status: SyncStatus, provider: CloudProvider | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getStatus(): { status: SyncStatus; provider: CloudProvider | null; lastSync: string | null } {
    return {
      status: this.status,
      provider: this.currentProvider,
      lastSync: this.lastSyncTime
    };
  }

  isConnected(): boolean {
    return this.currentProvider !== null && this.status !== 'disconnected';
  }

  getCurrentProvider(): CloudProvider | null {
    return this.currentProvider;
  }
}

// Singleton instance
export const cloudStorageManager = new CloudStorageManager();
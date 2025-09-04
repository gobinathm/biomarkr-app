export interface StorageInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

export function calculateStorageSize(): Promise<StorageInfo> {
  return new Promise((resolve) => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        const used = estimate.usage || 0;
        const total = estimate.quota || 0;
        const available = total - used;
        const percentage = total > 0 ? (used / total) * 100 : 0;
        
        resolve({
          used,
          available,
          total,
          percentage
        });
      }).catch(() => {
        // Fallback for browsers that don't support storage estimation
        resolve({
          used: 0,
          available: 0,
          total: 0,
          percentage: 0
        });
      });
    } else {
      // Fallback for browsers that don't support storage API
      resolve({
        used: 0,
        available: 0,
        total: 0,
        percentage: 0
      });
    }
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function estimateDataSize(): number {
  try {
    const profiles = localStorage.getItem('biomarkr-profiles') || '[]';
    const testResults = localStorage.getItem('biomarkr-test-results') || '[]';
    const settings = localStorage.getItem('biomarkr-settings') || '{}';
    const referenceRanges = localStorage.getItem('biomarkr-reference-ranges') || '[]';
    const reminders = localStorage.getItem('biomarkr-reminders') || '[]';
    
    const totalData = profiles + testResults + settings + referenceRanges + reminders;
    return new Blob([totalData]).size;
  } catch (error) {
    console.error('Error estimating data size:', error);
    return 0;
  }
}

export function validateBackupData(data: any): boolean {
  try {
    // Check if data has required structure
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Check for required fields
    const requiredFields = ['version', 'timestamp'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false;
      }
    }
    
    // Check if arrays are actually arrays
    const arrayFields = ['profiles', 'testResults', 'referenceRanges', 'reminders'];
    for (const field of arrayFields) {
      if (field in data && !Array.isArray(data[field])) {
        return false;
      }
    }
    
    // Check settings is an object
    if ('settings' in data && (typeof data.settings !== 'object' || Array.isArray(data.settings))) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating backup data:', error);
    return false;
  }
}

export function createBackupMetadata() {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    device: {
      platform: navigator.platform,
      userAgent: navigator.userAgent.substring(0, 100), // Truncate for privacy
      language: navigator.language
    }
  };
}
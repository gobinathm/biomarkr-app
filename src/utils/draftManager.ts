// Draft management utility for auto-saving and recovering work in progress

export interface DraftData {
  id: string;
  timestamp: number;
  lastModified: number;
  type: 'test-result' | 'reference-range' | 'reminder';
  data: any;
  step?: string; // For multi-step workflows
  version: number;
}

export class DraftManager {
  private static instance: DraftManager;
  private drafts: Map<string, DraftData> = new Map();
  private saveTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly STORAGE_KEY = 'labtracker-drafts';
  private readonly AUTO_SAVE_DELAY = 3000; // 3 seconds
  private readonly MAX_DRAFTS = 10;
  private readonly DRAFT_EXPIRY_DAYS = 7;

  private constructor() {
    this.loadDrafts();
    this.cleanupExpiredDrafts();
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupExpiredDrafts();
    }, 60 * 60 * 1000); // Every hour
  }

  static getInstance(): DraftManager {
    if (!DraftManager.instance) {
      DraftManager.instance = new DraftManager();
    }
    return DraftManager.instance;
  }

  /**
   * Save a draft with automatic debouncing
   */
  saveDraft(id: string, type: DraftData['type'], data: any, step?: string): void {
    // Clear existing timer if any
    const existingTimer = this.saveTimers.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer for debounced save
    const timer = setTimeout(() => {
      this.saveDraftImmediate(id, type, data, step);
      this.saveTimers.delete(id);
    }, this.AUTO_SAVE_DELAY);

    this.saveTimers.set(id, timer);
  }

  /**
   * Save draft immediately without debouncing
   */
  saveDraftImmediate(id: string, type: DraftData['type'], data: any, step?: string): void {
    const now = Date.now();
    const existing = this.drafts.get(id);
    
    const draft: DraftData = {
      id,
      timestamp: existing?.timestamp || now,
      lastModified: now,
      type,
      data: { ...data },
      step,
      version: (existing?.version || 0) + 1
    };

    this.drafts.set(id, draft);
    this.persistDrafts();
  }

  /**
   * Get a draft by ID
   */
  getDraft(id: string): DraftData | null {
    return this.drafts.get(id) || null;
  }

  /**
   * Get all drafts of a specific type
   */
  getDraftsByType(type: DraftData['type']): DraftData[] {
    return Array.from(this.drafts.values())
      .filter(draft => draft.type === type)
      .sort((a, b) => b.lastModified - a.lastModified);
  }

  /**
   * Get all drafts
   */
  getAllDrafts(): DraftData[] {
    return Array.from(this.drafts.values())
      .sort((a, b) => b.lastModified - a.lastModified);
  }

  /**
   * Check if a draft exists
   */
  hasDraft(id: string): boolean {
    return this.drafts.has(id);
  }

  /**
   * Delete a specific draft
   */
  deleteDraft(id: string): void {
    // Clear any pending save timer
    const timer = this.saveTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.saveTimers.delete(id);
    }

    this.drafts.delete(id);
    this.persistDrafts();
  }

  /**
   * Clear all drafts
   */
  clearAllDrafts(): void {
    // Clear all save timers
    this.saveTimers.forEach(timer => clearTimeout(timer));
    this.saveTimers.clear();
    
    this.drafts.clear();
    this.persistDrafts();
  }

  /**
   * Clear drafts of a specific type
   */
  clearDraftsByType(type: DraftData['type']): void {
    const toDelete = Array.from(this.drafts.keys()).filter(
      id => this.drafts.get(id)?.type === type
    );

    toDelete.forEach(id => {
      const timer = this.saveTimers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.saveTimers.delete(id);
      }
      this.drafts.delete(id);
    });

    this.persistDrafts();
  }

  /**
   * Get draft age in minutes
   */
  getDraftAge(id: string): number | null {
    const draft = this.drafts.get(id);
    if (!draft) return null;
    
    return Math.floor((Date.now() - draft.lastModified) / (1000 * 60));
  }

  /**
   * Get human-readable draft age
   */
  getDraftAgeString(id: string): string | null {
    const ageMinutes = this.getDraftAge(id);
    if (ageMinutes === null) return null;

    if (ageMinutes < 1) return 'Just now';
    if (ageMinutes < 60) return `${ageMinutes}m ago`;
    
    const ageHours = Math.floor(ageMinutes / 60);
    if (ageHours < 24) return `${ageHours}h ago`;
    
    const ageDays = Math.floor(ageHours / 24);
    return `${ageDays}d ago`;
  }

  /**
   * Load drafts from localStorage
   */
  private loadDrafts(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.drafts = new Map(parsed.map((draft: DraftData) => [draft.id, draft]));
        }
      }
    } catch (error) {
      console.warn('Failed to load drafts from localStorage:', error);
      this.drafts = new Map();
    }
  }

  /**
   * Persist drafts to localStorage
   */
  private persistDrafts(): void {
    try {
      const draftsArray = Array.from(this.drafts.values());
      
      // Limit number of stored drafts
      if (draftsArray.length > this.MAX_DRAFTS) {
        const sorted = draftsArray.sort((a, b) => b.lastModified - a.lastModified);
        const toKeep = sorted.slice(0, this.MAX_DRAFTS);
        this.drafts = new Map(toKeep.map(draft => [draft.id, draft]));
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.drafts.values())));
    } catch (error) {
      console.warn('Failed to persist drafts to localStorage:', error);
    }
  }

  /**
   * Clean up expired drafts
   */
  private cleanupExpiredDrafts(): void {
    const now = Date.now();
    const expiryTime = this.DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    const toDelete: string[] = [];
    
    this.drafts.forEach((draft, id) => {
      if (now - draft.lastModified > expiryTime) {
        toDelete.push(id);
      }
    });

    toDelete.forEach(id => {
      this.deleteDraft(id);
    });

    // Draft cleanup completed
  }

  /**
   * Generate a unique draft ID based on type and context
   */
  static generateDraftId(type: DraftData['type'], context?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}-${context || 'default'}-${timestamp}-${random}`;
  }

  /**
   * Merge draft data with new data (useful for form updates)
   */
  static mergeDraftData(existing: any, updates: any): any {
    if (!existing) return updates;
    
    // Deep merge objects
    if (typeof existing === 'object' && typeof updates === 'object' && !Array.isArray(existing) && !Array.isArray(updates)) {
      const merged = { ...existing };
      
      for (const key in updates) {
        if (updates[key] !== undefined && updates[key] !== null && updates[key] !== '') {
          merged[key] = updates[key];
        }
      }
      
      return merged;
    }
    
    return updates;
  }

  /**
   * Validate draft data integrity
   */
  static validateDraftData(draft: DraftData): boolean {
    if (!draft.id || !draft.type || !draft.timestamp || !draft.lastModified) {
      return false;
    }

    if (draft.timestamp > Date.now() || draft.lastModified > Date.now()) {
      return false;
    }

    if (draft.version < 1) {
      return false;
    }

    return true;
  }
}

// Hook for React components to use draft functionality
export function useDraftManager() {
  const draftManager = DraftManager.getInstance();

  return {
    saveDraft: (id: string, type: DraftData['type'], data: any, step?: string) => {
      draftManager.saveDraft(id, type, data, step);
    },
    
    getDraft: (id: string) => draftManager.getDraft(id),
    
    deleteDraft: (id: string) => {
      draftManager.deleteDraft(id);
    },
    
    hasDraft: (id: string) => draftManager.hasDraft(id),
    
    getDraftAge: (id: string) => draftManager.getDraftAgeString(id),
    
    getAllDrafts: () => draftManager.getAllDrafts(),
    
    getDraftsByType: (type: DraftData['type']) => draftManager.getDraftsByType(type)
  };
}

// Export singleton instance for direct access
export const draftManager = DraftManager.getInstance();
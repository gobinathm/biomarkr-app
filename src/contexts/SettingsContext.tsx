import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type Units = 'US (mg/dL, lb)' | 'Metric (mmol/L, kg)' | 'Mixed';
export type Theme = 'Light' | 'Dark' | 'System';

interface Settings {
  dateFormat: DateFormat;
  units: Units;
  theme: Theme;
  notificationsEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  formatDate: (date: string | Date) => string;
  getPreferredUnit: (type: 'glucose' | 'cholesterol' | 'weight') => string;
}

const DEFAULT_SETTINGS: Settings = {
  dateFormat: 'MM/DD/YYYY',
  units: 'US (mg/dL, lb)',
  theme: 'Light',
  notificationsEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biomarkr-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('biomarkr-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (settings.theme === 'Dark') {
      applyTheme(true);
    } else if (settings.theme === 'Light') {
      applyTheme(false);
    } else if (settings.theme === 'System') {
      // Listen to system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.theme]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    switch (settings.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const getPreferredUnit = (type: 'glucose' | 'cholesterol' | 'weight'): string => {
    switch (settings.units) {
      case 'US (mg/dL, lb)':
        return type === 'weight' ? 'lb' : 'mg/dL';
      case 'Metric (mmol/L, kg)':
        return type === 'weight' ? 'kg' : 'mmol/L';
      case 'Mixed':
        // Mixed could have different logic based on biomarker
        return type === 'weight' ? 'kg' : 'mg/dL';
      default:
        return type === 'weight' ? 'lb' : 'mg/dL';
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    formatDate,
    getPreferredUnit,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
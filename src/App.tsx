import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Onboarding } from './components/Onboarding';
import { VaultManager } from './components/VaultManager';
import { CloudSync } from './components/CloudSync';
import { AddResultWizard } from './components/AddResultWizard';
import { ResultDetails } from './components/ResultDetails';
import { ResultsList } from './components/ResultsList';
import { ReferenceRangeManager } from './components/ReferenceRangeManager';
import { DraftRecovery } from './components/DraftRecovery';
import { BackupManager } from './components/BackupManager';
import { ProfileManager } from './components/ProfileManager';
import { AlertModal, useAlert } from './components/AlertModal';
import { PassphraseModal } from './components/PassphraseModal';
import { ExportModal } from './components/ExportModal';
import { ConfirmModal, useConfirm } from './components/ConfirmModal';
import { useDraftManager } from './utils/draftManager';
import { useSettings } from './contexts/SettingsContext';
import { isDemoMode, disableDemoMode, forceDemoMode } from './data/mockData';
import { 
  Home, 
  FileText, 
  TrendingUp, 
  Bell, 
  Cloud, 
  Settings, 
  Search,
  Menu,
  X,
  Plus,
  Calendar,
  Activity,
  Shield,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  User,
  Users,
  PlayCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

type Section = 'home' | 'results' | 'trends' | 'reminders' | 'storage' | 'settings';

interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange?: {
    min?: number;
    max?: number;
    text?: string;
  };
  flags?: string[];
  notes?: string;
}

interface TestResult {
  id: string;
  profileId?: string;
  profileName?: string;
  date: string;
  time?: string;
  lab: string;
  panel: string;
  biomarkers: Biomarker[];
  tags?: string[];
  notes?: string;
  createdAt?: string;
  modifiedAt?: string;
}

function App() {
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [showResultDetails, setShowResultDetails] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [showRangeManager, setShowRangeManager] = useState(false);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState('default');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  
  // Vault management state
  const [hasPassphrase, setHasPassphrase] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(30);
  
  const { hasDrafts } = useDraftManager();
  const { showAlert, AlertComponent } = useAlert();

  // Load test results from localStorage
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // Load test results on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biomarkr-test-results');
      console.log('Loading test results from localStorage:', saved ? `${saved.length} characters` : 'null');
      if (saved) {
        const parsedResults = JSON.parse(saved);
        console.log('Parsed test results:', parsedResults.length, 'results');
        setTestResults(parsedResults);
      }
      // Mark initial data as loaded to allow future saves
      setHasLoadedInitialData(true);
    } catch (error) {
      console.error('Error loading test results:', error);
      setHasLoadedInitialData(true);
    }
  }, []);

  // Save test results when they change (but not if we just loaded them)
  
  useEffect(() => {
    // Don't save during initial load to prevent overwriting demo data
    if (!hasLoadedInitialData) return;
    
    try {
      console.log('Saving test results to localStorage:', testResults.length, 'results');
      localStorage.setItem('biomarkr-test-results', JSON.stringify(testResults));
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  }, [testResults, hasLoadedInitialData]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, description: 'Latest results & quick trends' },
    { id: 'results', label: 'Results', icon: FileText, description: 'All test entries' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, description: 'Biomarker charts' },
    { id: 'reminders', label: 'Reminders', icon: Bell, description: 'Test schedules' },
    { id: 'storage', label: 'Storage', icon: Cloud, description: 'Backup & sync' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences' }
  ];

  // Simulate first-run check and load vault settings
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('biomarkr-onboarded');
    const isRestoringFromBackup = localStorage.getItem('biomarkr-restoring-from-backup');
    
    // If restoring from backup, show the storage page instead of onboarding
    if (isRestoringFromBackup) {
      localStorage.removeItem('biomarkr-restoring-from-backup');
      localStorage.setItem('biomarkr-onboarded', 'true');
      localStorage.setItem('biomarkr-show-restore-help', 'true');
      setIsFirstRun(false);
      setCurrentSection('storage');
    } else {
      setIsFirstRun(!hasCompletedOnboarding);
    }
    
    // Load vault settings
    try {
      const vaultSettings = localStorage.getItem('biomarkr-vault-settings');
      if (vaultSettings) {
        const settings = JSON.parse(vaultSettings);
        setHasPassphrase(settings.hasPassphrase ?? false);
        setAutoLockEnabled(settings.autoLockEnabled ?? true);
        setAutoLockMinutes(settings.autoLockMinutes ?? 30);
      }
    } catch (error) {
      console.error('Error loading vault settings:', error);
    }
    
    // Expose debug function globally
    (window as any).forceDemoMode = forceDemoMode;
    console.log('Debug: Use forceDemoMode() in console to test demo mode');
  }, []);

  // Save vault settings when they change
  useEffect(() => {
    try {
      const vaultSettings = {
        hasPassphrase,
        autoLockEnabled,
        autoLockMinutes
      };
      localStorage.setItem('biomarkr-vault-settings', JSON.stringify(vaultSettings));
    } catch (error) {
      console.error('Error saving vault settings:', error);
    }
  }, [hasPassphrase, autoLockEnabled, autoLockMinutes]);

  // Load profiles for profile switcher
  useEffect(() => {
    const loadProfiles = () => {
      try {
        const saved = localStorage.getItem('biomarkr-profiles');
        console.log('Loading profiles from localStorage:', saved);
        if (saved) {
          const parsedProfiles = JSON.parse(saved);
          console.log('Parsed profiles:', parsedProfiles);
          setProfiles(parsedProfiles);
          
          // Check for saved active profile first
          const savedActiveProfile = localStorage.getItem('biomarkr-active-profile');
          console.log('Saved active profile:', savedActiveProfile);
          if (savedActiveProfile && parsedProfiles.find((p: any) => p.id === savedActiveProfile)) {
            setCurrentProfileId(savedActiveProfile);
          } else {
            // Set current profile to default or first available
            const defaultProfile = parsedProfiles.find((p: any) => p.isDefault) || parsedProfiles[0];
            console.log('Setting default profile:', defaultProfile);
            if (defaultProfile) {
              setCurrentProfileId(defaultProfile.id);
            }
          }
        } else {
          console.log('No profiles found, creating default');
          // Create default profile if none exist
          const defaultProfile = {
            id: 'default',
            name: 'Default Profile',
            relationship: 'self',
            createdAt: new Date().toISOString(),
            isDefault: true
          };
          setProfiles([defaultProfile]);
          setCurrentProfileId('default');
          localStorage.setItem('biomarkr-profiles', JSON.stringify([defaultProfile]));
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    };
    loadProfiles();
  }, []);

  // Close profile switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileSwitcher) {
        const target = event.target as HTMLElement;
        // Don't close if clicking inside the profile switcher
        if (!target.closest('[data-profile-switcher]')) {
          setShowProfileSwitcher(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileSwitcher]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('biomarkr-onboarded', 'true');
    setIsFirstRun(false);
    
    // If demo mode was enabled, reload the page to ensure all demo data is loaded properly
    if (isDemoMode()) {
      // Small delay to ensure localStorage is written before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Vault management functions
  const handleSetPassphrase = (passphrase: string) => {
    // In a real app, this would hash and store the passphrase securely
    localStorage.setItem('biomarkr-vault-passphrase', passphrase);
    setHasPassphrase(true);
  };

  const handleRemovePassphrase = (currentPassphrase: string) => {
    // In a real app, this would verify the current passphrase
    const storedPassphrase = localStorage.getItem('biomarkr-vault-passphrase');
    if (storedPassphrase === currentPassphrase) {
      localStorage.removeItem('biomarkr-vault-passphrase');
      setHasPassphrase(false);
      setIsVaultLocked(false);
      return true;
    }
    return false;
  };

  const handleUnlock = (passphrase?: string) => {
    if (!hasPassphrase) {
      setIsVaultLocked(false);
      return;
    }
    
    // In a real app, this would verify the passphrase
    const storedPassphrase = localStorage.getItem('biomarkr-vault-passphrase');
    if (passphrase === storedPassphrase) {
      setIsVaultLocked(false);
    } else {
      showAlert({
        title: 'Incorrect Passphrase',
        message: 'The passphrase you entered is incorrect. Please try again.',
        type: 'error'
      });
    }
  };

  const handleUpdateAutoLock = (enabled: boolean, minutes: number) => {
    setAutoLockEnabled(enabled);
    setAutoLockMinutes(minutes);
  };

  // Show onboarding for first-time users
  if (isFirstRun) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show vault manager if locked
  if (isVaultLocked) {
    return (
      <VaultManager
        isLocked={true}
        hasPassphrase={hasPassphrase}
        autoLockEnabled={autoLockEnabled}
        autoLockMinutes={autoLockMinutes}
        onUnlock={handleUnlock}
        onLock={() => setIsVaultLocked(true)}
        onSetPassphrase={handleSetPassphrase}
        onRemovePassphrase={handleRemovePassphrase}
        onUpdateAutoLock={handleUpdateAutoLock}
      />
    );
  }

  const renderContent = () => {
    // Filter test results by current profile
    const filteredTestResults = testResults.filter(result => 
      !result.profileId || result.profileId === currentProfileId
    );
    
    // Debug: Profile filtering working correctly

    switch (currentSection) {
      case 'home':
        return <HomeScreen testResults={filteredTestResults} currentProfileId={currentProfileId} />;
      case 'results':
        return <ResultsScreen testResults={filteredTestResults} onAddResult={() => setShowAddWizard(true)} />;
      case 'trends':
        return <TrendsScreen currentProfileId={currentProfileId} />;
      case 'reminders':
        return <RemindersScreen currentProfileId={currentProfileId} showAlert={showAlert} />;
      case 'storage':
        return <StorageScreen 
          hasPassphrase={hasPassphrase}
          autoLockEnabled={autoLockEnabled}
          autoLockMinutes={autoLockMinutes}
          onSetPassphrase={handleSetPassphrase}
          onRemovePassphrase={handleRemovePassphrase}
          onUpdateAutoLock={handleUpdateAutoLock}
          onUnlock={handleUnlock}
          showAlert={showAlert}
        />;
      case 'settings':
        return <SettingsScreen 
          hasPassphrase={hasPassphrase}
          autoLockEnabled={autoLockEnabled}
          autoLockMinutes={autoLockMinutes}
          onSetPassphrase={handleSetPassphrase}
          onRemovePassphrase={handleRemovePassphrase}
          onUpdateAutoLock={handleUpdateAutoLock}
          onOpenProfileManager={() => setShowProfileManager(true)}
          onLock={() => setIsVaultLocked(true)}
          showAlert={showAlert}
        />;
      default:
        return <HomeScreen testResults={testResults} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center flex-shrink-0 px-4">
            <button 
              onClick={() => setCurrentSection('home')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Activity className="h-8 w-8 text-blue-600 drop-shadow-sm" />
              <h1 className="ml-3 text-xl font-display font-bold bg-logo-gradient dark:bg-logo-gradient-dark bg-clip-text text-transparent">
                Biomarkr
              {isDemoMode() && (
                <span className="ml-2 text-xs font-sans font-normal bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  DEMO
                </span>
              )}
              </h1>
            </button>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id as Section)}
                    className={`${
                      currentSection === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="ml-2 text-xs text-blue-800 dark:text-blue-300 font-medium">Your data stays on your device</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <button 
                onClick={() => setCurrentSection('home')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Activity className="h-8 w-8 text-blue-600 drop-shadow-sm" />
                <h1 className="ml-3 text-xl font-display font-bold bg-logo-gradient bg-clip-text text-transparent">
                  Biomarkr
                  {isDemoMode() && (
                    <span className="ml-2 text-xs font-sans font-normal bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      DEMO
                    </span>
                  )}
                </h1>
              </button>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="mt-4 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentSection(item.id as Section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      currentSection === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    } group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  className="md:hidden -ml-2 mr-2 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{currentSection}</h2>
              </div>
              
              {/* Global Search */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search panels, biomarkers, dates, labs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (isDemoMode()) {
                    showAlert({
                      title: 'Add Test Result',
                      message: 'Test result entry is available in the full version. In demo mode, you can explore existing data with comprehensive sample results.',
                      type: 'info'
                    });
                  } else {
                    setShowAddWizard(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Result</span>
              </button>

              {/* Profile Switcher */}
              <div className="relative" data-profile-switcher>
                <button
                  onClick={() => {
                    console.log('Profile switcher clicked, current profiles:', profiles);
                    console.log('Current profile ID:', currentProfileId);
                    console.log('showProfileSwitcher before toggle:', showProfileSwitcher);
                    setShowProfileSwitcher(!showProfileSwitcher);
                  }}
                  className="flex items-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:block">
                    {profiles.find(p => p.id === currentProfileId)?.name || 'Profile'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 hidden sm:block">▼</span>
                </button>

                {showProfileSwitcher && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                    {console.log('Rendering profile switcher dropdown with', profiles.length, 'profiles')}
                    <div className="p-3 border-b dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Switch Profile</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Select which profile to view data for</div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {profiles.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => {
                            console.log('Switching to profile:', profile.id, profile.name);
                            setCurrentProfileId(profile.id);
                            localStorage.setItem('biomarkr-active-profile', profile.id);
                            setShowProfileSwitcher(false);
                          }}
                          className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            currentProfileId === profile.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{profile.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{profile.relationship || 'self'}</div>
                              </div>
                            </div>
                            {currentProfileId === profile.id && (
                              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t dark:border-gray-700 p-3">
                      <button
                        onClick={() => {
                          setShowProfileManager(true);
                          setShowProfileSwitcher(false);
                        }}
                        className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Manage Profiles...
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-white">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-6 gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id as Section)}
                  className={`${
                    currentSection === item.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="truncate w-full text-center">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddResultWizard
        isOpen={showAddWizard}
        onClose={() => setShowAddWizard(false)}
        onSave={(result) => {
          // TODO: Save result to storage
          setShowAddWizard(false);
        }}
        onOpenProfileManager={() => setShowProfileManager(true)}
      />

      <ReferenceRangeManager
        isOpen={showRangeManager}
        onClose={() => setShowRangeManager(false)}
        biomarkerName=""
        currentUnit=""
        onSave={(range) => {
        }}
      />

      <DraftRecovery
        isOpen={showDraftRecovery}
        onClose={() => setShowDraftRecovery(false)}
        onRecover={(draft) => {
          // TODO: Handle draft recovery
          setShowDraftRecovery(false);
          setShowAddWizard(true);
        }}
      />

      <ProfileManager
        isOpen={showProfileManager}
        onClose={() => setShowProfileManager(false)}
      />
      
      <AlertComponent />
    </div>
  );
}

// Screen Components
function HomeScreen({ testResults, currentProfileId }: { testResults: TestResult[]; currentProfileId: string }) {
  const latestResult = testResults[0];
  const { formatDate } = useSettings();
  const [reminders, setReminders] = useState([]);
  
  // Load reminders for this profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biomarkr-reminders');
      if (saved) {
        const parsedReminders = JSON.parse(saved);
        const filteredReminders = parsedReminders.filter((reminder: any) => 
          (!reminder.profileId || reminder.profileId === currentProfileId) && !reminder.isCompleted
        );
        // Sort by due date and take first 3
        const upcomingReminders = filteredReminders
          .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 3);
        setReminders(upcomingReminders);
      }
    } catch (error) {
      console.error('Error loading reminders for home:', error);
    }
  }, [currentProfileId]);
  
  // Process quick trends data
  const getQuickTrends = () => {
    if (testResults.length < 2) return [];
    
    // Get recent biomarkers with at least 2 data points
    const biomarkerData = testResults
      .flatMap(result => result.biomarkers?.map(b => ({
        name: b.name,
        value: parseFloat(b.value),
        date: result.date
      })) || [])
      .filter(b => !isNaN(b.value))
      .reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = [];
        acc[item.name].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    
    // Find biomarkers with trends
    return Object.entries(biomarkerData)
      .filter(([_, data]) => data.length >= 2)
      .slice(0, 3)
      .map(([name, data]) => {
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latest = sorted[sorted.length - 1];
        const previous = sorted[sorted.length - 2];
        const change = latest.value - previous.value;
        const changePercent = Math.abs(change / previous.value * 100);
        
        return {
          name,
          latest: latest.value,
          change,
          changePercent: changePercent.toFixed(1),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      });
  };
  
  const quickTrends = getQuickTrends();
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Latest Results</h3>
        {latestResult ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(latestResult.date)}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{latestResult.lab}</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{latestResult.panel}</h4>
            <div className="space-y-2">
              {latestResult.biomarkers.map((marker, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{marker.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{marker.value} {marker.unit}</span>
                    {marker.range && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">Range: {marker.range}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No test results yet</p>
            <p className="text-sm">Add your first lab result to get started</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Trends</h3>
          {quickTrends.length > 0 ? (
            <div className="space-y-3">
              {quickTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{trend.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Latest: {trend.latest}</div>
                  </div>
                  <div className="flex items-center">
                    {trend.trend === 'up' && <span className="text-red-600 text-xs">↗ +{trend.changePercent}%</span>}
                    {trend.trend === 'down' && <span className="text-green-600 text-xs">↘ -{trend.changePercent}%</span>}
                    {trend.trend === 'stable' && <span className="text-gray-600 text-xs">→ Stable</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Trends appear here</p>
              <p className="text-sm">Add more results to see patterns</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Reminders</h3>
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{reminder.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(reminder.dueDate) < new Date() ? 'Overdue' : 
                       Math.ceil((new Date(reminder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reminder.category === 'appointment' ? 'bg-blue-100 text-blue-800' :
                      reminder.category === 'test' ? 'bg-green-100 text-green-800' :
                      reminder.category === 'medication' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No reminders set</p>
              <p className="text-sm">Set test schedules to stay on track</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Not Medical Advice</p>
            <p>This information is for tracking purposes only. Always consult healthcare professionals for medical interpretation and advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ testResults, onAddResult }: { testResults: TestResult[]; onAddResult: () => void }) {
  const { formatDate } = useSettings();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Test Results Log</h3>
        <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option>All time</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="space-y-4">
        {testResults.length > 0 ? (
          testResults.map((result) => (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(result.date)}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.lab}</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">{result.panel}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.biomarkers.map((marker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{marker.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{marker.value} {marker.unit}</span>
                      {marker.range && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">Range: {marker.range}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No test results</h3>
            <p className="mb-6">Start tracking your lab results to monitor your health over time</p>
            <button 
              onClick={onAddResult}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium"
            >
              Add First Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendsScreen({ currentProfileId }: { currentProfileId: string }) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedBiomarker, setSelectedBiomarker] = useState('All biomarkers');

  // Load test results for trends
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biomarkr-test-results');
      if (saved) {
        const allResults = JSON.parse(saved);
        console.log('TrendsScreen: loaded', allResults.length, 'total results');
        // Filter by current profile
        const filteredResults = allResults.filter((result: TestResult) => 
          !result.profileId || result.profileId === currentProfileId
        );
        console.log('TrendsScreen: filtered to', filteredResults.length, 'results for profile', currentProfileId);
        setTestResults(filteredResults);
      }
    } catch (error) {
      console.error('Error loading test results for trends:', error);
    }
  }, [currentProfileId]);

  // Process data for charts
  const processChartData = (biomarkerName: string) => {
    return testResults
      .filter(result => result.biomarkers?.some(b => b.name === biomarkerName))
      .map(result => {
        const biomarker = result.biomarkers.find(b => b.name === biomarkerName);
        return {
          date: result.date,
          value: parseFloat(biomarker?.value || '0'),
          unit: biomarker?.unit || '',
          lab: result.lab
        };
      })
      .filter(item => !isNaN(item.value))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Get unique biomarkers for dropdown
  const uniqueBiomarkers = ['All biomarkers', ...new Set(
    testResults.flatMap(result => result.biomarkers?.map(b => b.name) || [])
  )];

  // Get most common biomarkers for charts
  const biomarkerCounts = testResults
    .flatMap(result => result.biomarkers?.map(b => b.name) || [])
    .reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topBiomarkers = Object.entries(biomarkerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name]) => name);
  
  // Use most common biomarkers for charts, fallback to specific names
  const firstBiomarker = topBiomarkers[0] || 'Total Cholesterol';
  const secondBiomarker = topBiomarkers[1] || 'Glucose';
  
  const firstChartData = processChartData(firstBiomarker);
  const secondChartData = processChartData(secondBiomarker);
  
  console.log('TrendsScreen chart data:', {
    firstBiomarker,
    firstChartData: firstChartData.length,
    secondBiomarker,
    secondChartData: secondChartData.length,
    uniqueBiomarkers: uniqueBiomarkers.length,
    topBiomarkers: topBiomarkers.slice(0, 5)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Biomarker Trends</h3>
        <select 
          value={selectedBiomarker}
          onChange={(e) => setSelectedBiomarker(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {uniqueBiomarkers.map(biomarker => (
            <option key={biomarker} value={biomarker}>{biomarker}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title={`${firstBiomarker} Trend`}
          data={firstChartData}
          unit={firstChartData[0]?.unit || ''}
          color="#dc2626"
        />
        <TrendChart 
          title={`${secondBiomarker} Trend`}
          data={secondChartData}
          unit={secondChartData[0]?.unit || ''}
          color="#2563eb"
        />
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Data Interpretation</p>
            <p>Trends are based on your entered data. Consult your healthcare provider for medical interpretation of any patterns or changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemindersScreen({ currentProfileId, showAlert }: { currentProfileId: string; showAlert: (options: any) => void }) {
  const [reminders, setReminders] = useState([]);
  const [hasLoadedReminders, setHasLoadedReminders] = useState(false);

  // Load reminders on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biomarkr-reminders');
      console.log('Loading reminders from localStorage:', saved ? 'data found' : 'no data');
      if (saved) {
        const parsedReminders = JSON.parse(saved);
        console.log('Total reminders loaded:', parsedReminders.length);
        // Filter reminders by current profile
        const filteredReminders = parsedReminders.filter((reminder: any) => 
          !reminder.profileId || reminder.profileId === currentProfileId
        );
        console.log('Filtered reminders for profile', currentProfileId, ':', filteredReminders.length);
        setReminders(filteredReminders);
      }
      setHasLoadedReminders(true);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setHasLoadedReminders(true);
    }
  }, [currentProfileId]);

  // Save reminders when they change (but not during initial load)
  useEffect(() => {
    if (!hasLoadedReminders) return;
    
    try {
      // When saving, we need to merge with reminders from other profiles
      const allReminders = JSON.parse(localStorage.getItem('biomarkr-reminders') || '[]');
      const otherProfileReminders = allReminders.filter((reminder: any) => 
        reminder.profileId && reminder.profileId !== currentProfileId
      );
      const updatedReminders = [...otherProfileReminders, ...reminders];
      
      console.log('Saving reminders to localStorage:', updatedReminders.length, 'total');
      localStorage.setItem('biomarkr-reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  }, [reminders, currentProfileId, hasLoadedReminders]);

  const toggleReminderComplete = (reminderId: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, isCompleted: !reminder.isCompleted }
        : reminder
    ));
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  // Separate upcoming and past reminders
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingReminders = reminders.filter(reminder => 
    new Date(reminder.dueDate) >= today && !reminder.isCompleted
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const pastOverdueReminders = reminders.filter(reminder => 
    new Date(reminder.dueDate) < today && !reminder.isCompleted
  ).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  
  const completedReminders = reminders.filter(reminder => reminder.isCompleted)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const renderReminder = (reminder: any) => (
    <div key={reminder.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${reminder.isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button
            onClick={() => toggleReminderComplete(reminder.id)}
            className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
              reminder.isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {reminder.isCompleted && <CheckCircle className="w-3 h-3" />}
          </button>
          <div>
            <h4 className={`font-medium ${reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {reminder.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded-full ${
            reminder.category === 'appointment' ? 'bg-blue-100 text-blue-800' :
            reminder.category === 'test' ? 'bg-green-100 text-green-800' :
            reminder.category === 'medication' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {reminder.category}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <span>{new Date(reminder.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => {
              showAlert({
                title: 'Edit Reminder',
                message: 'Edit functionality is available in the full version. In demo mode, you can delete and toggle reminders.',
                type: 'info'
              });
            }}
          >
            Edit
          </button>
          <button 
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={() => deleteReminder(reminder.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Test Reminders</h3>
        {reminders.length > 0 && (
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            onClick={() => {
              showAlert({
                title: 'Add Reminder',
                message: 'Reminder creation feature is available in the full version. In demo mode, you can interact with existing reminders.',
                type: 'info'
              });
            }}
          >
            Add Reminder
          </button>
        )}
      </div>

      {(upcomingReminders.length > 0 || pastOverdueReminders.length > 0 || completedReminders.length > 0) ? (
        <div className="space-y-8">
          {/* Overdue Reminders */}
          {pastOverdueReminders.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-red-700 dark:text-red-400 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Overdue ({pastOverdueReminders.length})
              </h4>
              <div className="space-y-4">
                {pastOverdueReminders.map(renderReminder)}
              </div>
            </div>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming ({upcomingReminders.length})
              </h4>
              <div className="space-y-4">
                {upcomingReminders.map(renderReminder)}
              </div>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-green-700 dark:text-green-400 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed ({completedReminders.length})
              </h4>
              <div className="space-y-4">
                {completedReminders.slice(0, 5).map(renderReminder)}
                {completedReminders.length > 5 && (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    ... and {completedReminders.length - 5} more completed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No reminders set</h3>
          <p className="mb-6">Stay on top of your health by setting test reminders</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            onClick={() => {
              showAlert({
                title: 'Add Reminder',
                message: 'Reminder creation feature is available in the full version. In demo mode, you can interact with existing reminders.',
                type: 'info'
              });
            }}
          >
            Add First Reminder
          </button>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Local Notifications Only</p>
            <p>All reminders work offline and stay on your device. Enable browser notifications for the best experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorageScreen({
  hasPassphrase,
  autoLockEnabled,
  autoLockMinutes,
  onSetPassphrase,
  onRemovePassphrase,
  onUpdateAutoLock,
  onUnlock,
  showAlert
}: {
  hasPassphrase: boolean;
  autoLockEnabled: boolean;
  autoLockMinutes: number;
  onSetPassphrase: (passphrase: string) => void;
  onRemovePassphrase: (currentPassphrase: string) => boolean;
  onUpdateAutoLock: (enabled: boolean, minutes: number) => void;
  onUnlock: (passphrase?: string) => void;
  showAlert: (options: any) => void;
}) {

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Shield className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Your Privacy & Control</h3>
            <p className="text-sm text-blue-800 mb-3">
              All your health data is stored locally on your device. Cloud connections are used only for encrypted backup and sync across your devices.
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Data is encrypted before upload</li>
              <li>• You control when to backup/restore</li>
              <li>• Disconnect anytime without data loss</li>
            </ul>
          </div>
        </div>
      </div>

      <CloudSync onShowAlert={showAlert} />

      <BackupManager onShowAlert={showAlert} />
    </div>
  );
}

function SettingsScreen({
  hasPassphrase,
  autoLockEnabled,
  autoLockMinutes,
  onSetPassphrase,
  onRemovePassphrase,
  onUpdateAutoLock,
  onOpenProfileManager,
  onLock,
  showAlert
}: {
  hasPassphrase: boolean;
  autoLockEnabled: boolean;
  autoLockMinutes: number;
  onSetPassphrase: (passphrase: string) => void;
  onRemovePassphrase: (currentPassphrase: string) => boolean;
  onUpdateAutoLock: (enabled: boolean, minutes: number) => void;
  onOpenProfileManager: () => void;
  onLock: () => void;
  showAlert: (options: any) => void;
}) {
  const { settings, updateSetting, formatDate } = useSettings();
  const { showConfirm, ConfirmComponent } = useConfirm();
  const [activeTab, setActiveTab] = useState<'display' | 'profiles' | 'security' | 'privacy' | 'about' | 'demo'>(isDemoMode() ? 'demo' : 'display');
  const [passphraseModal, setPassphraseModal] = useState<{ isOpen: boolean; mode: 'set' | 'change' | 'remove' }>({ 
    isOpen: false, 
    mode: 'set' 
  });
  const [showExportModal, setShowExportModal] = useState(false);

  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      // User is enabling notifications - request permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updateSetting('notificationsEnabled', true);
          showAlert({
            title: 'Notifications Enabled',
            message: 'You will now receive test reminder notifications.',
            type: 'success'
          });
        } else {
          showAlert({
            title: 'Permission Required',
            message: 'Please enable notifications in your browser settings to receive reminders.',
            type: 'warning'
          });
        }
      } else {
        showAlert({
          title: 'Not Supported',
          message: 'Notifications are not supported in your browser.',
          type: 'error'
        });
      }
    } else {
      // User is disabling notifications
      updateSetting('notificationsEnabled', false);
      showAlert({
        title: 'Notifications Disabled',
        message: 'You will no longer receive test reminder notifications.',
        type: 'info'
      });
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  const handleExportFormat = (format: '1' | '2' | '3') => {
    try {
      // Get all data from localStorage
      const data = {
        testResults: JSON.parse(localStorage.getItem('biomarkr-test-results') || '[]'),
        settings: JSON.parse(localStorage.getItem('biomarkr-settings') || '{}'),
        profiles: JSON.parse(localStorage.getItem('biomarkr-profiles') || '[]'),
        customPanels: JSON.parse(localStorage.getItem('biomarkr-custom-panels') || '[]'),
      };

      const timestamp = new Date().toISOString().split('T')[0];

      switch (format) {
        case '1': // JSON
          exportAsJSON(data, timestamp);
          break;
        case '2': // CSV
          exportAsCSV(data.testResults, timestamp);
          break;
        case '3': // PDF
          exportAsPDF(data, timestamp);
          break;
        default:
          showAlert({
            title: 'Invalid Format',
            message: 'Invalid format selected. Please try again.',
            type: 'error'
          });
          return;
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert({
        title: 'Export Error',
        message: 'Error exporting data. Please try again.',
        type: 'error'
      });
    }
  };

  const exportAsJSON = (data: any, timestamp: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `biomarkr-data-export-${timestamp}.json`);
  };

  const exportAsCSV = (testResults: any[], timestamp: string) => {
    if (testResults.length === 0) {
      showAlert({
        title: 'No Data',
        message: 'No test results to export.',
        type: 'warning'
      });
      return;
    }

    // Create CSV header
    const headers = ['Date', 'Lab', 'Panel', 'Biomarker', 'Value', 'Unit', 'Reference Range', 'Profile'];
    
    // Create CSV rows
    const rows = [];
    testResults.forEach(result => {
      result.biomarkers?.forEach((biomarker: any) => {
        rows.push([
          result.date,
          result.lab,
          result.panel,
          biomarker.name,
          biomarker.value,
          biomarker.unit,
          biomarker.referenceRange?.text || biomarker.range || '',
          result.profileName || 'Default'
        ]);
      });
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `biomarkr-results-${timestamp}.csv`);
  };

  const exportAsPDF = (data: any, timestamp: string) => {
    // Create a simple HTML report
    const { testResults, profiles } = data;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Biomarkr Health Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .summary { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1 style="font-family: 'Oswald', sans-serif; font-weight: 700;">Biomarkr Health Report</h1>
        <p>Generated on: ${formatDate(new Date())}</p>
        
        <div class="summary">
          <h2>Summary</h2>
          <p>Total Test Results: ${testResults.length}</p>
          <p>Total Profiles: ${profiles?.length || 1}</p>
        </div>

        <h2>Recent Test Results</h2>
        ${testResults.slice(0, 10).map((result: any) => `
          <h3>${result.date} - ${result.panel}</h3>
          <p><strong>Lab:</strong> ${result.lab}</p>
          <table>
            <tr><th>Biomarker</th><th>Value</th><th>Unit</th><th>Reference Range</th></tr>
            ${result.biomarkers?.map((biomarker: any) => `
              <tr>
                <td>${biomarker.name}</td>
                <td>${biomarker.value}</td>
                <td>${biomarker.unit}</td>
                <td>${biomarker.referenceRange?.text || biomarker.range || 'N/A'}</td>
              </tr>
            `).join('') || ''}
          </table>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    downloadFile(blob, `biomarkr-report-${timestamp}.html`);
    
    showAlert({
      title: 'Export Complete',
      message: 'HTML report exported. You can open it in a browser and print to PDF.',
      type: 'success'
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    showConfirm({
      title: 'Clear All Data',
      message: 'Are you sure you want to permanently delete all your test results? This action cannot be undone.',
      confirmText: 'Delete All Data',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        try {
          // Get all localStorage keys that start with 'biomarkr-'
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('biomarkr-')) {
              keysToRemove.push(key);
            }
          }
          
          // Remove all biomarkr related data
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Also remove cloud storage authentication tokens
          localStorage.removeItem('dropbox_tokens');
          localStorage.removeItem('onedrive_tokens');
          localStorage.removeItem('googledrive_tokens');
          localStorage.removeItem('cloud-storage-state');
          
          // Also check for any legacy keys
          localStorage.removeItem('labtracker-onboarded');
          localStorage.removeItem('labtracker-draft');
          
          // Ask about vault settings separately
          showConfirm({
            title: 'Reset Security Settings',
            message: 'Do you also want to reset your vault passphrase and security settings?',
            confirmText: 'Reset Security',
            cancelText: 'Keep Security',
            type: 'warning',
            onConfirm: () => {
              localStorage.removeItem('biomarkr-vault-passphrase');
            }
          });
          
          showAlert({
            title: 'Data Cleared',
            message: 'All data has been cleared successfully.',
            type: 'success'
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          showAlert({
            title: 'Clear Error',
            message: 'Error clearing data. Please try again.',
            type: 'error'
          });
        }
      }
    });
  };

  const tabs = [
    ...(isDemoMode() ? [{ id: 'demo', label: 'Demo Mode', icon: '🎮' }] : []),
    { id: 'display', label: 'Display', icon: '⚙️' },
    { id: 'profiles', label: 'Profiles & Family', icon: '👥' },
    { id: 'security', label: 'Security & Vault', icon: '🔒' },
    { id: 'privacy', label: 'Privacy & Data', icon: '🛡️' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'demo':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg shadow p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <PlayCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Demo Mode Active
                  </h3>
                  <p className="text-purple-800 dark:text-purple-200 mb-4">
                    You're currently using Biomarkr with sample data to explore its features. Demo mode includes:
                  </p>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 mb-6 space-y-1">
                    <li>• 2 sample profiles (John Doe, Sarah Smith)</li>
                    <li>• 36 test results with realistic biomarker data</li>
                    <li>• 20 reminders for various health activities</li>
                    <li>• Disabled cloud storage to protect your real accounts</li>
                  </ul>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mb-6">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium mb-1">Important:</p>
                        <p>Exiting demo mode will remove all sample data and return you to the onboarding process. Your real health data (if any) will remain untouched.</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      showConfirm({
                        title: 'Exit Demo Mode',
                        message: 'Are you sure you want to exit demo mode? All sample data will be removed and you\'ll return to the initial setup.',
                        confirmText: 'Exit Demo Mode',
                        cancelText: 'Stay in Demo',
                        onConfirm: () => {
                          disableDemoMode();
                          window.location.reload(); // Reload to restart onboarding
                        }
                      });
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Exit Demo Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'display':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Display Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Units</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose measurement units for lab values</p>
                  </div>
                  <select 
                    value={settings.units}
                    onChange={(e) => updateSetting('units', e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="US (mg/dL, lb)">US (mg/dL, lb)</option>
                    <option value="Metric (mmol/L, kg)">Metric (mmol/L, kg)</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred color scheme</p>
                  </div>
                  <select 
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                    <option value="System">System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Date Format</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How dates are displayed</p>
                  </div>
                  <select 
                    value={settings.dateFormat}
                    onChange={(e) => updateSetting('dateFormat', e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Reminder Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about upcoming tests</p>
                  </div>
                  <button 
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.notificationsEnabled ? 'bg-blue-600 dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`${
                      settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profiles':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Family & Profile Management</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage profiles for family members to track their health data separately. Each profile can have its own test results and settings.
              </p>
              
              <button
                onClick={onOpenProfileManager}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <User className="w-5 h-5 mr-2" />
                Manage Profiles
              </button>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Profile Benefits</p>
                    <ul className="space-y-1">
                      <li>• Separate health data for each family member</li>
                      <li>• Age and gender-appropriate reference ranges</li>
                      <li>• Individual trend tracking and insights</li>
                      <li>• Privacy protection with isolated data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security & Vault</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Vault Protection</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasPassphrase ? 'Vault is protected with a passphrase' : 'Vault is not protected'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {hasPassphrase ? (
                    <button 
                      onClick={() => setPassphraseModal({ isOpen: true, mode: 'remove' })}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Protection
                    </button>
                  ) : null}
                  <button 
                    onClick={() => setPassphraseModal({ 
                      isOpen: true, 
                      mode: hasPassphrase ? 'change' : 'set' 
                    })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {hasPassphrase ? 'Change Passphrase' : 'Set Passphrase'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-Lock</p>
                  <p className="text-sm text-gray-600">Automatically lock the vault after inactivity</p>
                </div>
                <div className="flex items-center space-x-3">
                  <select 
                    value={autoLockMinutes}
                    onChange={(e) => onUpdateAutoLock(autoLockEnabled, parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    disabled={!autoLockEnabled}
                  >
                    <option value={5}>5 min</option>
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                  </select>
                  <button 
                    onClick={() => onUpdateAutoLock(!autoLockEnabled, autoLockMinutes)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      autoLockEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`${
                      autoLockEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Lock Vault Now</p>
                    <p className="text-sm text-gray-600">Immediately lock your vault for security</p>
                  </div>
                  <button 
                    onClick={onLock}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Lock Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Data Management</h3>
            <div className="space-y-4">
              <button 
                onClick={handleExportData}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium text-gray-900">Export All Data</p>
                <p className="text-sm text-gray-600">Choose format: JSON (complete), CSV (results), or HTML/PDF (report)</p>
              </button>
              <button 
                onClick={handleClearData}
                className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
              >
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm">Permanently delete all test results from this device</p>
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-xl font-display font-bold bg-logo-gradient bg-clip-text text-transparent">About Biomarkr</h3>
                  <p className="text-sm text-gray-600">Personal Health Data Management</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p className="mb-4">
                  <strong>Biomarkr</strong> is a comprehensive personal health data management application designed to help you track, analyze, and understand your biomarker test results over time. Whether you're managing a chronic condition, optimizing your health, or working with healthcare providers, Biomarkr provides the tools you need to make informed decisions about your health.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2 mb-4">
                  <li>• <strong>Comprehensive Test Tracking:</strong> Record results from blood panels, metabolic panels, lipid profiles, and custom biomarker tests</li>
                  <li>• <strong>Trend Analysis:</strong> Visualize your biomarker changes over time with interactive charts and historical data</li>
                  <li>• <strong>Multi-Profile Support:</strong> Manage health data for family members with separate profiles and privacy controls</li>
                  <li>• <strong>Reference Range Management:</strong> Set custom reference ranges and get alerts when values fall outside normal ranges</li>
                  <li>• <strong>Data Export:</strong> Export your data in multiple formats (JSON, CSV, PDF) for sharing with healthcare providers</li>
                  <li>• <strong>Smart Reminders:</strong> Never miss important tests with customizable reminder notifications</li>
                </ul>

                <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Privacy & Security</h4>
                <p className="mb-4">
                  Your health data is incredibly sensitive, and we've built Biomarkr with privacy as the foundation. All your data is stored locally on your device using encrypted browser storage. We never transmit, store, or have access to your personal health information on our servers. You maintain complete control over your data with optional vault protection and auto-lock features for additional security.
                </p>

                <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">How It Works</h4>
                <p className="mb-4">
                  Simply add your test results using our intuitive wizard, and Biomarkr automatically organizes and analyzes your data. The application supports common lab panels like Complete Blood Count (CBC), Comprehensive Metabolic Panel (CMP), Lipid Panel, and Thyroid Function tests, while also allowing you to create custom panels for specialized testing.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Version:</span> 1.0.0</p>
                    <p><span className="font-medium">Release Date:</span> 2024</p>
                    <p><span className="font-medium">Platform:</span> Web Application</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Privacy Policy:</span> <a href="#" className="text-blue-600 hover:underline">View Policy</a></p>
                    <p><span className="font-medium">Terms of Service:</span> <a href="#" className="text-blue-600 hover:underline">View Terms</a></p>
                    <p><span className="font-medium">Support:</span> <a href="#" className="text-blue-600 hover:underline">Help Center</a></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Privacy-First Design</p>
                    <p>All your health data stays on your device. We never see or store your personal health information on our servers. Your data, your control.</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">No Account Required</p>
                    <p>Start using Biomarkr immediately without creating accounts, providing personal information, or subscription fees.</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Advanced Analytics</p>
                    <p>Track trends, identify patterns, and get insights from your health data with powerful visualization tools.</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium mb-1">Family-Friendly</p>
                    <p>Manage health data for multiple family members with separate profiles, making it perfect for families and caregivers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
      
      <PassphraseModal
        isOpen={passphraseModal.isOpen}
        onClose={() => setPassphraseModal({ isOpen: false, mode: 'set' })}
        mode={passphraseModal.mode}
        hasPassphrase={hasPassphrase}
        onSetPassphrase={onSetPassphrase}
        onRemovePassphrase={onRemovePassphrase}
        showAlert={showAlert}
      />
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportFormat}
      />
      
      <ConfirmComponent />
    </div>
  );
}

// Trend Chart Component
interface TrendChartProps {
  title: string;
  data: Array<{
    date: string;
    value: number;
    unit: string;
    lab: string;
  }>;
  unit: string;
  color: string;
}

function TrendChart({ title, data, unit, color }: TrendChartProps) {
  const { formatDate } = useSettings();

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">{title}</h4>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
            <p className="text-sm">Add test results to see trends</p>
          </div>
        </div>
      </div>
    );
  }

  // Format data for recharts
  const chartData = data.map(item => ({
    ...item,
    displayDate: formatDate(item.date)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`${data.displayDate}`}</p>
          <p className="text-blue-600 dark:text-blue-400">
            {`${payload[0].value} ${data.unit}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{`Lab: ${data.lab}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.length} data points</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;

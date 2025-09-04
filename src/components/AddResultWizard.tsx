import React, { useState, useEffect } from 'react';
import { Profile } from './ProfileManager';
import { useAlert } from './AlertModal';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Calendar,
  Clock,
  Building2,
  FlaskConical,
  Plus,
  Trash2,
  Star,
  StarOff,
  AlertCircle,
  CheckCircle,
  Save,
  RotateCcw,
  Search,
  GripVertical,
  Info
} from 'lucide-react';

type WizardStep = 'profile' | 'panel' | 'datetime' | 'lab' | 'biomarkers' | 'review';

interface Biomarker {
  id: string;
  name: string;
  value: string;
  unit: string;
  availableUnits: string[];
  referenceRange?: {
    low: string;
    high: string;
    unit: string;
    labName?: string;
  };
  notes?: string;
  isFavorite?: boolean;
  error?: string;
}

interface TestResult {
  id: string;
  profile: string;
  panel: string;
  isCustomPanel: boolean;
  date: string;
  time: string;
  labName: string;
  biomarkers: Biomarker[];
  notes: string;
  tags: string[];
}

interface AddResultWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: TestResult) => void;
  draftResult?: Partial<TestResult>;
  onOpenProfileManager?: () => void;
}

// Common panel presets with their typical biomarkers
const PANEL_PRESETS = [
  {
    name: 'Complete Blood Count (CBC)',
    biomarkers: [
      { name: 'White Blood Cells', units: ['K/uL', '10³/uL'], defaultUnit: 'K/uL' },
      { name: 'Red Blood Cells', units: ['M/uL', '10⁶/uL'], defaultUnit: 'M/uL' },
      { name: 'Hemoglobin', units: ['g/dL', 'g/L'], defaultUnit: 'g/dL' },
      { name: 'Hematocrit', units: ['%'], defaultUnit: '%' },
      { name: 'Platelets', units: ['K/uL', '10³/uL'], defaultUnit: 'K/uL' }
    ]
  },
  {
    name: 'Comprehensive Metabolic Panel (CMP)',
    biomarkers: [
      { name: 'Glucose', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' },
      { name: 'Sodium', units: ['mEq/L', 'mmol/L'], defaultUnit: 'mEq/L' },
      { name: 'Potassium', units: ['mEq/L', 'mmol/L'], defaultUnit: 'mEq/L' },
      { name: 'Chloride', units: ['mEq/L', 'mmol/L'], defaultUnit: 'mEq/L' },
      { name: 'BUN', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' },
      { name: 'Creatinine', units: ['mg/dL', 'umol/L'], defaultUnit: 'mg/dL' }
    ]
  },
  {
    name: 'Lipid Panel',
    biomarkers: [
      { name: 'Total Cholesterol', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' },
      { name: 'HDL Cholesterol', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' },
      { name: 'LDL Cholesterol', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' },
      { name: 'Triglycerides', units: ['mg/dL', 'mmol/L'], defaultUnit: 'mg/dL' }
    ]
  },
  {
    name: 'Hemoglobin A1c',
    biomarkers: [
      { name: 'HbA1c', units: ['%', 'mmol/mol'], defaultUnit: '%' }
    ]
  },
  {
    name: 'Thyroid Function',
    biomarkers: [
      { name: 'TSH', units: ['mIU/L', 'uIU/mL'], defaultUnit: 'mIU/L' },
      { name: 'Free T4', units: ['ng/dL', 'pmol/L'], defaultUnit: 'ng/dL' },
      { name: 'Free T3', units: ['pg/mL', 'pmol/L'], defaultUnit: 'pg/mL' }
    ]
  },
  {
    name: 'Vitamin D',
    biomarkers: [
      { name: 'Vitamin D, 25-OH', units: ['ng/mL', 'nmol/L'], defaultUnit: 'ng/mL' }
    ]
  },
  {
    name: 'Iron Studies',
    biomarkers: [
      { name: 'Iron', units: ['ug/dL', 'umol/L'], defaultUnit: 'ug/dL' },
      { name: 'TIBC', units: ['ug/dL', 'umol/L'], defaultUnit: 'ug/dL' },
      { name: 'Ferritin', units: ['ng/mL', 'ug/L'], defaultUnit: 'ng/mL' },
      { name: 'Iron Saturation', units: ['%'], defaultUnit: '%' }
    ]
  },
  {
    name: 'C-Reactive Protein',
    biomarkers: [
      { name: 'CRP', units: ['mg/L', 'mg/dL'], defaultUnit: 'mg/L' }
    ]
  }
];

export function AddResultWizard({ isOpen, onClose, onSave, draftResult, onOpenProfileManager }: AddResultWizardProps) {
  const { showAlert, AlertComponent } = useAlert();
  const [currentStep, setCurrentStep] = useState<WizardStep>('profile');
  const [result, setResult] = useState<Partial<TestResult>>({
    profile: 'default',
    panel: '',
    isCustomPanel: false,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    labName: '',
    biomarkers: [],
    notes: '',
    tags: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Reset wizard state when modal opens and load profiles
  useEffect(() => {
    if (isOpen) {
      // Load profiles
      try {
        const savedProfiles = localStorage.getItem('biomarkr-profiles');
        if (savedProfiles) {
          const loadedProfiles = JSON.parse(savedProfiles);
          setProfiles(loadedProfiles);
          // Set default profile as the initial selection
          const defaultProfile = loadedProfiles.find((p: Profile) => p.isDefault);
          setResult({
            profile: defaultProfile?.id || 'default',
            panel: '',
            isCustomPanel: false,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            labName: '',
            biomarkers: [],
            notes: '',
            tags: []
          });
        } else {
          // Create default profile if none exist
          const defaultProfile: Profile = {
            id: 'default',
            name: 'Default Profile',
            relationship: 'self',
            createdAt: new Date().toISOString(),
            isDefault: true
          };
          setProfiles([defaultProfile]);
          localStorage.setItem('biomarkr-profiles', JSON.stringify([defaultProfile]));
          setResult({
            profile: 'default',
            panel: '',
            isCustomPanel: false,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            labName: '',
            biomarkers: [],
            notes: '',
            tags: []
          });
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
      
      setCurrentStep('profile');
      setErrors({});
      setSearchQuery('');
      setShowCustomPanel(false);
    }
  }, [isOpen]);

  // Auto-save draft functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (result.panel || result.biomarkers?.length) {
        localStorage.setItem('biomarkr-draft', JSON.stringify(result));
      }
    }, 5000);
    
    return () => clearInterval(saveInterval);
  }, [result]);

  // Load draft on mount
  useEffect(() => {
    if (draftResult) {
      setResult(draftResult);
    } else {
      const savedDraft = localStorage.getItem('labtracker-draft');
      if (savedDraft) {
        setResult(JSON.parse(savedDraft));
      }
    }
  }, [draftResult]);

  if (!isOpen) return null;

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'profile':
        if (!result.profile) newErrors.profile = 'Please select a profile';
        break;
      case 'panel':
        if (!result.panel) newErrors.panel = 'Please select or enter a panel name';
        break;
      case 'datetime':
        if (!result.date) newErrors.date = 'Please select a date';
        if (!result.time) newErrors.time = 'Please select a time';
        break;
      case 'lab':
        if (!result.labName?.trim()) newErrors.labName = 'Please enter the lab name';
        break;
      case 'biomarkers':
        if (!result.biomarkers?.length) {
          newErrors.biomarkers = 'Please add at least one biomarker';
        } else {
          result.biomarkers.forEach((biomarker, index) => {
            if (!biomarker.name.trim()) newErrors[`biomarker-${index}-name`] = 'Biomarker name is required';
            if (!biomarker.value.trim()) newErrors[`biomarker-${index}-value`] = 'Value is required';
            if (biomarker.value && isNaN(Number(biomarker.value))) {
              newErrors[`biomarker-${index}-value`] = 'Please enter a valid number';
            }
          });
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const steps: WizardStep[] = ['profile', 'panel', 'datetime', 'lab', 'biomarkers', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['profile', 'panel', 'datetime', 'lab', 'biomarkers', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    if (validateStep('biomarkers')) {
      const finalResult: TestResult = {
        id: Date.now().toString(),
        profile: result.profile || 'default',
        panel: result.panel || '',
        isCustomPanel: result.isCustomPanel || false,
        date: result.date || '',
        time: result.time || '',
        labName: result.labName || '',
        biomarkers: result.biomarkers || [],
        notes: result.notes || '',
        tags: result.tags || []
      };
      onSave(finalResult);
      localStorage.removeItem('labtracker-draft');
      onClose();
    }
  };

  const addBiomarker = () => {
    const newBiomarker: Biomarker = {
      id: Date.now().toString(),
      name: '',
      value: '',
      unit: '',
      availableUnits: ['mg/dL', 'g/L', 'mmol/L', 'mEq/L', '%', 'K/uL', 'M/uL']
    };
    
    setResult(prev => ({
      ...prev,
      biomarkers: [...(prev.biomarkers || []), newBiomarker]
    }));
  };

  const updateBiomarker = (index: number, updates: Partial<Biomarker>) => {
    setResult(prev => ({
      ...prev,
      biomarkers: prev.biomarkers?.map((b, i) => i === index ? { ...b, ...updates } : b) || []
    }));
  };

  const removeBiomarker = (index: number) => {
    setResult(prev => ({
      ...prev,
      biomarkers: prev.biomarkers?.filter((_, i) => i !== index) || []
    }));
  };

  const loadPanelPreset = (preset: typeof PANEL_PRESETS[0]) => {
    const biomarkers: Biomarker[] = preset.biomarkers.map((b, index) => ({
      id: `${Date.now()}-${index}`,
      name: b.name,
      value: '',
      unit: b.defaultUnit,
      availableUnits: b.units
    }));
    
    setResult(prev => ({
      ...prev,
      panel: preset.name,
      isCustomPanel: false,
      biomarkers
    }));
    setShowCustomPanel(false);
  };

  const renderProgressBar = () => {
    const steps = ['profile', 'panel', 'datetime', 'lab', 'biomarkers', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              index <= currentIndex 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 rounded ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose which profile these results belong to.
              </p>
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <label 
                    key={profile.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      result.profile === profile.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="profile"
                      value={profile.id}
                      checked={result.profile === profile.id}
                      onChange={(e) => setResult(prev => ({ ...prev, profile: e.target.value }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">{profile.name}</span>
                      {profile.relationship && (
                        <span className="text-xs text-gray-500 block capitalize">
                          {profile.relationship === 'self' ? 'Primary' : profile.relationship}
                        </span>
                      )}
                      {profile.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">
                  Need to add a new family member?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenProfileManager) {
                      onClose(); // Close the wizard
                      onOpenProfileManager(); // Open profile manager
                    } else {
                      // Fallback: provide guidance
                      showAlert({
                        title: 'Manage Profiles',
                        message: 'Please go to Settings > Profiles & Family to manage profiles first, then return to add results.',
                        type: 'info'
                      });
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Manage Profiles
                </button>
              </div>
              
              {errors.profile && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.profile}
                </p>
              )}
            </div>
          </div>
        );

      case 'panel':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Test Panel</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a common panel or create a custom one.
              </p>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search panels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {PANEL_PRESETS
                  .filter(preset => preset.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => loadPanelPreset(preset)}
                      className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 ${
                        result.panel === preset.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{preset.name}</div>
                      <div className="text-sm text-gray-600">
                        {preset.biomarkers.length} biomarkers
                      </div>
                    </button>
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowCustomPanel(!showCustomPanel)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Panel
                </button>
                
                {showCustomPanel && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Enter custom panel name"
                      value={result.isCustomPanel ? result.panel : ''}
                      onChange={(e) => setResult(prev => ({
                        ...prev,
                        panel: e.target.value,
                        isCustomPanel: true,
                        biomarkers: []
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              
              {errors.panel && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.panel}
                </p>
              )}
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Date & Time</h3>
              <p className="text-sm text-gray-600 mb-6">
                When were these tests taken?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={result.date}
                    onChange={(e) => setResult(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Test Time
                  </label>
                  <input
                    type="time"
                    value={result.time}
                    onChange={(e) => setResult(prev => ({ ...prev, time: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'lab':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Laboratory Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter the name of the laboratory or clinic where the tests were performed.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Lab Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. LabCorp, Quest Diagnostics, Hospital Lab"
                  value={result.labName}
                  onChange={(e) => setResult(prev => ({ ...prev, labName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.labName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.labName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.labName}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'biomarkers':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Biomarkers & Values</h3>
                  <p className="text-sm text-gray-600">
                    Enter the test results for {result.panel}
                  </p>
                </div>
                <button
                  onClick={addBiomarker}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Biomarker
                </button>
              </div>

              {result.biomarkers?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No biomarkers added yet</p>
                  <button
                    onClick={addBiomarker}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Add Your First Biomarker
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result.biomarkers?.map((biomarker, index) => (
                    <BiomarkerEntry
                      key={biomarker.id}
                      biomarker={biomarker}
                      index={index}
                      onUpdate={(updates) => updateBiomarker(index, updates)}
                      onRemove={() => removeBiomarker(index)}
                      errors={errors}
                    />
                  ))}
                </div>
              )}

              {errors.biomarkers && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.biomarkers}
                </p>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Save</h3>
              <p className="text-sm text-gray-600 mb-6">
                Review your test results before saving. You can add notes and tags below.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Panel:</span>
                    <p className="text-gray-900">{result.panel}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{result.date} at {result.time}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Lab:</span>
                    <p className="text-gray-900">{result.labName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Biomarkers:</span>
                    <p className="text-gray-900">{result.biomarkers?.length || 0} values</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Test Values</h4>
                  <div className="space-y-2">
                    {result.biomarkers?.map((biomarker, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{biomarker.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {biomarker.value} {biomarker.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any notes about this test..."
                    value={result.notes}
                    onChange={(e) => setResult(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fasting, morning, follow-up (comma separated)"
                    value={result.tags?.join(', ') || ''}
                    onChange={(e) => setResult(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Test Results</h2>
            <p className="text-sm text-gray-600">
              Step {['profile', 'panel', 'datetime', 'lab', 'biomarkers', 'review'].indexOf(currentStep) + 1} of 6
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {renderProgressBar()}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-4">
            {localStorage.getItem('labtracker-draft') && (
              <div className="flex items-center text-sm text-gray-600">
                <Save className="w-4 h-4 mr-1" />
                Draft saved
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentStep !== 'profile' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            
            {currentStep === 'review' ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Results
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
      <AlertComponent />
    </div>
  );
}

function BiomarkerEntry({ 
  biomarker, 
  index, 
  onUpdate, 
  onRemove, 
  errors 
}: { 
  biomarker: Biomarker;
  index: number;
  onUpdate: (updates: Partial<Biomarker>) => void;
  onRemove: () => void;
  errors: Record<string, string>;
}) {
  const [showReferenceRange, setShowReferenceRange] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Biomarker name"
              value={biomarker.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors[`biomarker-${index}-name`] ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors[`biomarker-${index}-name`] && (
              <p className="mt-1 text-xs text-red-600">{errors[`biomarker-${index}-name`]}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onUpdate({ isFavorite: !biomarker.isFavorite })}
            className="p-1 text-gray-400 hover:text-yellow-500"
          >
            {biomarker.isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>
          <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input
            type="text"
            placeholder="0.00"
            value={biomarker.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`biomarker-${index}-value`] ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors[`biomarker-${index}-value`] && (
            <p className="mt-1 text-xs text-red-600">{errors[`biomarker-${index}-value`]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select
            value={biomarker.unit}
            onChange={(e) => onUpdate({ unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select unit</option>
            {biomarker.availableUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowReferenceRange(!showReferenceRange)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <Info className="w-4 h-4 mr-1" />
          {biomarker.referenceRange ? 'Edit Reference Range' : 'Add Reference Range'}
        </button>
      </div>

      {showReferenceRange && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Low</label>
              <input
                type="text"
                placeholder="0.0"
                value={biomarker.referenceRange?.low || ''}
                onChange={(e) => onUpdate({
                  referenceRange: { ...biomarker.referenceRange, low: e.target.value, unit: biomarker.unit }
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">High</label>
              <input
                type="text"
                placeholder="0.0"
                value={biomarker.referenceRange?.high || ''}
                onChange={(e) => onUpdate({
                  referenceRange: { ...biomarker.referenceRange, high: e.target.value, unit: biomarker.unit }
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={biomarker.referenceRange?.unit || biomarker.unit}
                onChange={(e) => onUpdate({
                  referenceRange: { ...biomarker.referenceRange, unit: e.target.value }
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Lab Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. LabCorp reference range"
              value={biomarker.referenceRange?.labName || ''}
              onChange={(e) => onUpdate({
                referenceRange: { ...biomarker.referenceRange, labName: e.target.value }
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Calendar,
  Users,
  Heart,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAlert } from './AlertModal';

export interface Profile {
  id: string;
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  relationship?: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  notes?: string;
  createdAt: string;
  isDefault: boolean;
}

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile?: (profile: Profile) => void;
  selectedProfileId?: string;
}

export function ProfileManager({ isOpen, onClose, onSelectProfile, selectedProfileId }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const { showAlert, AlertComponent } = useAlert();

  // Load profiles from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  const loadProfiles = () => {
    try {
      const saved = localStorage.getItem('biomarkr-profiles');
      if (saved) {
        setProfiles(JSON.parse(saved));
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
        saveProfiles([defaultProfile]);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const saveProfiles = (updatedProfiles: Profile[]) => {
    try {
      localStorage.setItem('biomarkr-profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  };

  const handleAddProfile = (profileData: Omit<Profile, 'id' | 'createdAt' | 'isDefault'>) => {
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isDefault: false
    };

    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);
    setShowAddForm(false);
  };

  const handleEditProfile = (profile: Profile, updates: Partial<Profile>) => {
    const updatedProfiles = profiles.map(p => 
      p.id === profile.id ? { ...p, ...updates } : p
    );
    saveProfiles(updatedProfiles);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.find(p => p.id === profileId)?.isDefault) {
      showAlert({
        title: 'Cannot Delete',
        message: 'Cannot delete the default profile.',
        type: 'warning'
      });
      return;
    }

    showAlert({
      title: 'Delete Profile',
      message: 'Are you sure you want to delete this profile? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        saveProfiles(updatedProfiles);
      }
    });
  };

  const getRelationshipIcon = (relationship?: string) => {
    switch (relationship) {
      case 'self': return <UserCheck className="w-4 h-4" />;
      case 'spouse': return <Heart className="w-4 h-4" />;
      case 'child': return <Users className="w-4 h-4" />;
      case 'parent': return <Activity className="w-4 h-4" />;
      case 'sibling': return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getAgeFromBirthDate = (dateOfBirth?: string): string => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${age - 1} years`;
    }
    return `${age} years`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Family & Profile Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {!showAddForm && !editingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Manage profiles for family members to track their health data separately.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      selectedProfileId === profile.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-gray-100 mr-3">
                          {getRelationshipIcon(profile.relationship)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{profile.name}</h3>
                          {profile.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingProfile(profile)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!profile.isDefault && (
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {profile.relationship && (
                        <p className="capitalize">Relationship: {profile.relationship}</p>
                      )}
                      {profile.gender && (
                        <p className="capitalize">Gender: {profile.gender}</p>
                      )}
                      {profile.dateOfBirth && (
                        <p>Age: {getAgeFromBirthDate(profile.dateOfBirth)}</p>
                      )}
                    </div>

                    {onSelectProfile && (
                      <button
                        onClick={() => {
                          onSelectProfile(profile);
                          onClose();
                        }}
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium"
                      >
                        Select Profile
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showAddForm && (
            <ProfileForm
              onSave={handleAddProfile}
              onCancel={() => setShowAddForm(false)}
              title="Add New Profile"
            />
          )}

          {editingProfile && (
            <ProfileForm
              profile={editingProfile}
              onSave={(data) => handleEditProfile(editingProfile, data)}
              onCancel={() => setEditingProfile(null)}
              title="Edit Profile"
            />
          )}
        </div>
      </div>
      <AlertComponent />
    </div>
  );
}

interface ProfileFormProps {
  profile?: Profile;
  onSave: (data: Omit<Profile, 'id' | 'createdAt' | 'isDefault'>) => void;
  onCancel: () => void;
  title: string;
}

function ProfileForm({ profile, onSave, onCancel, title }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    dateOfBirth: profile?.dateOfBirth || '',
    gender: profile?.gender || '',
    relationship: profile?.relationship || 'self',
    notes: profile?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showAlert({
        title: 'Name Required',
        message: 'Name is required.',
        type: 'warning'
      });
      return;
    }

    onSave({
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: (formData.gender as any) || undefined,
      relationship: (formData.relationship as any) || 'self',
      notes: formData.notes.trim() || undefined
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="self">Self</option>
            <option value="spouse">Spouse/Partner</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any additional notes about this profile..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
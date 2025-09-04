import React, { useState, useEffect } from 'react';
import { useConfirm } from './ConfirmModal';
import {
  AlertCircle,
  Clock,
  FileText,
  RotateCcw,
  Trash2,
  X,
  Save,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDraftManager, DraftData } from '../utils/draftManager';

interface DraftRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (draft: DraftData) => void;
  type?: DraftData['type'];
}

export function DraftRecovery({ isOpen, onClose, onRecover, type }: DraftRecoveryProps) {
  const { getAllDrafts, getDraftsByType, deleteDraft, getDraftAge } = useDraftManager();
  const { showConfirm, ConfirmComponent } = useConfirm();
  const [selectedDraft, setSelectedDraft] = useState<DraftData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const drafts = type ? getDraftsByType(type) : getAllDrafts();

  const handleRecover = (draft: DraftData) => {
    onRecover(draft);
    deleteDraft(draft.id);
    onClose();
  };

  const handleDelete = (draft: DraftData, event: React.MouseEvent) => {
    event.stopPropagation();
    showConfirm({
      title: 'Delete Draft',
      message: 'Are you sure you want to delete this draft? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        deleteDraft(draft.id);
        if (selectedDraft?.id === draft.id) {
          setSelectedDraft(null);
        }
      }
    });
  };

  const getDraftTypeLabel = (type: DraftData['type']) => {
    switch (type) {
      case 'test-result':
        return 'Test Result';
      case 'reference-range':
        return 'Reference Range';
      case 'reminder':
        return 'Reminder';
      default:
        return type;
    }
  };

  const getDraftDescription = (draft: DraftData): string => {
    try {
      switch (draft.type) {
        case 'test-result':
          const panel = draft.data.panel || 'Untitled Panel';
          const biomarkerCount = draft.data.biomarkers?.length || 0;
          return `${panel} (${biomarkerCount} biomarkers)`;
        case 'reference-range':
          return `${draft.data.biomarkerName || 'Unknown Biomarker'} range`;
        case 'reminder':
          return draft.data.title || 'Untitled Reminder';
        default:
          return 'Draft data';
      }
    } catch {
      return 'Corrupted draft data';
    }
  };

  const renderDraftPreview = (draft: DraftData) => {
    try {
      switch (draft.type) {
        case 'test-result':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Panel</label>
                  <p className="text-gray-900">{draft.data.panel || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{draft.data.date || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lab</label>
                  <p className="text-gray-900">{draft.data.labName || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Step</label>
                  <p className="text-gray-900">{draft.step || 'Unknown'}</p>
                </div>
              </div>
              
              {draft.data.biomarkers && draft.data.biomarkers.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Biomarkers ({draft.data.biomarkers.length})
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {draft.data.biomarkers.slice(0, 5).map((biomarker: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{biomarker.name || 'Unnamed'}</span>
                        <span>{biomarker.value || '--'} {biomarker.unit || ''}</span>
                      </div>
                    ))}
                    {draft.data.biomarkers.length > 5 && (
                      <p className="text-sm text-gray-500 italic">
                        +{draft.data.biomarkers.length - 5} more biomarkers...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {draft.data.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">
                    {draft.data.notes}
                  </p>
                </div>
              )}
            </div>
          );

        case 'reference-range':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Biomarker</label>
                  <p className="text-gray-900">{draft.data.biomarkerName || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Unit</label>
                  <p className="text-gray-900">{draft.data.unit || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Low Range</label>
                  <p className="text-gray-900">{draft.data.low || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">High Range</label>
                  <p className="text-gray-900">{draft.data.high || 'Not specified'}</p>
                </div>
              </div>
              
              {draft.data.labName && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Lab/Source</label>
                  <p className="text-gray-900">{draft.data.labName}</p>
                </div>
              )}
            </div>
          );

        default:
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 overflow-auto max-h-40">
                {JSON.stringify(draft.data, null, 2)}
              </pre>
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Corrupted Draft Data</p>
              <p className="text-red-700 text-sm mt-1">
                This draft contains invalid data and cannot be previewed properly.
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Drafts List */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recover Drafts</h3>
                <p className="text-sm text-gray-600">
                  {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} found
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(90vh - 140px)' }}>
            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Drafts Found</h4>
                <p className="text-gray-600">
                  {type 
                    ? `No ${getDraftTypeLabel(type).toLowerCase()} drafts available to recover.`
                    : 'No drafts available to recover.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDraft?.id === draft.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDraft(draft)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {getDraftTypeLabel(draft.type)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            v{draft.version}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {getDraftDescription(draft)}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getDraftAge(draft.id)}
                          </div>
                          {draft.step && (
                            <div>Step: {draft.step}</div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDelete(draft, e)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">
              {selectedDraft ? 'Draft Preview' : 'Select a Draft'}
            </h4>
            {selectedDraft && (
              <p className="text-sm text-gray-600 mt-1">
                Last modified: {getDraftAge(selectedDraft.id)}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedDraft ? (
              <div>
                {renderDraftPreview(selectedDraft)}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a draft from the list to preview its contents</p>
              </div>
            )}
          </div>

          {selectedDraft && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleRecover(selectedDraft)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recover Draft
                </button>
                
                <button
                  onClick={(e) => handleDelete(selectedDraft, e)}
                  className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
              
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">
                    Recovering this draft will restore your work and delete the saved draft. 
                    Make sure this is the version you want to continue with.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmComponent />
    </div>
  );
}

export function DraftAlert({ 
  draftCount, 
  onShowDrafts 
}: { 
  draftCount: number;
  onShowDrafts: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (draftCount === 0 || dismissed) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Save className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              {draftCount} unsaved {draftCount === 1 ? 'draft' : 'drafts'} found
            </p>
            <p className="text-xs text-blue-800 mt-1">
              You have work in progress that can be recovered.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onShowDrafts}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Recover
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Lightbulb,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  ArrowRightLeft,
  Save,
  Trash2
} from 'lucide-react';
import {
  convertValue,
  getAvailableConversions,
  suggestReferenceRange,
  canConvert,
  getReferenceRanges
} from '../utils/unitConversion';

interface ReferenceRange {
  low: string;
  high: string;
  unit: string;
  labName?: string;
}

interface ReferenceRangeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkerName: string;
  currentUnit: string;
  currentRange?: ReferenceRange;
  onSave: (range: ReferenceRange) => void;
  onRemove?: () => void;
  value?: string; // Current test value for context
}

export function ReferenceRangeManager({
  isOpen,
  onClose,
  biomarkerName,
  currentUnit,
  currentRange,
  onSave,
  onRemove,
  value
}: ReferenceRangeManagerProps) {
  const [range, setRange] = useState<ReferenceRange>({
    low: currentRange?.low || '',
    high: currentRange?.high || '',
    unit: currentRange?.unit || currentUnit,
    labName: currentRange?.labName || ''
  });

  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [conversionPreview, setConversionPreview] = useState<{
    unit: string;
    low: string;
    high: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{
    low: number;
    high: number;
    source: string;
  }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Load suggestions when the modal opens
      const referenceData = getReferenceRanges(biomarkerName, currentUnit);
      if (referenceData) {
        setSuggestions(referenceData.references.map(ref => ({
          low: ref.low,
          high: ref.high,
          source: ref.source
        })));
      }

      // Auto-suggest if no current range exists
      if (!currentRange) {
        const suggestion = suggestReferenceRange(biomarkerName, currentUnit);
        if (suggestion) {
          setRange(prev => ({
            ...prev,
            low: suggestion.low.toString(),
            high: suggestion.high.toString(),
            unit: currentUnit
          }));
        }
      }
    }
  }, [isOpen, biomarkerName, currentUnit, currentRange]);

  const availableUnits = getAvailableConversions(currentUnit);

  const handleUnitChange = (newUnit: string) => {
    if (range.low && range.high) {
      const convertedLow = convertValue(parseFloat(range.low), range.unit, newUnit);
      const convertedHigh = convertValue(parseFloat(range.high), range.unit, newUnit);
      
      if (convertedLow !== null && convertedHigh !== null) {
        setRange({
          ...range,
          low: convertedLow.toString(),
          high: convertedHigh.toString(),
          unit: newUnit
        });
      }
    } else {
      setRange(prev => ({ ...prev, unit: newUnit }));
    }
    setConversionPreview(null);
  };

  const previewUnitConversion = (newUnit: string) => {
    if (range.low && range.high && canConvert(range.unit, newUnit)) {
      const convertedLow = convertValue(parseFloat(range.low), range.unit, newUnit);
      const convertedHigh = convertValue(parseFloat(range.high), range.unit, newUnit);
      
      if (convertedLow !== null && convertedHigh !== null) {
        setConversionPreview({
          unit: newUnit,
          low: convertedLow.toString(),
          high: convertedHigh.toString()
        });
      }
    }
  };

  const applySuggestion = (suggestion: { low: number; high: number; source: string }) => {
    setRange(prev => ({
      ...prev,
      low: suggestion.low.toString(),
      high: suggestion.high.toString(),
      labName: suggestion.source
    }));
  };

  const handleSave = () => {
    if (range.low && range.high && range.unit) {
      onSave(range);
      onClose();
    }
  };

  const getValueStatus = () => {
    if (!value || !range.low || !range.high) return null;
    
    const numValue = parseFloat(value);
    const numLow = parseFloat(range.low);
    const numHigh = parseFloat(range.high);
    
    if (isNaN(numValue) || isNaN(numLow) || isNaN(numHigh)) return null;
    
    if (numValue < numLow) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (numValue > numHigh) return { status: 'high', color: 'text-red-600', bg: 'bg-red-50' };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const valueStatus = getValueStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reference Range</h3>
            <p className="text-sm text-gray-600">{biomarkerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Value Context */}
          {value && (
            <div className={`p-4 rounded-lg border ${valueStatus ? valueStatus.bg : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Test Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {value} {currentUnit}
                  </p>
                </div>
                {valueStatus && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${valueStatus.color} ${valueStatus.bg.replace('50', '100')}`}>
                    {valueStatus.status === 'low' ? 'Below Range' : 
                     valueStatus.status === 'high' ? 'Above Range' : 'Within Range'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reference Range Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reference Range
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Low</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={range.low}
                  onChange={(e) => setRange(prev => ({ ...prev, low: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">High</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={range.high}
                  onChange={(e) => setRange(prev => ({ ...prev, high: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                <select
                  value={range.unit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={currentUnit}>{currentUnit}</option>
                  {availableUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lab Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lab/Source (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. LabCorp, Quest, Mayo Clinic"
              value={range.labName}
              onChange={(e) => setRange(prev => ({ ...prev, labName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Unit Converter */}
          {availableUnits.length > 0 && (
            <div>
              <button
                onClick={() => setShowUnitConverter(!showUnitConverter)}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Unit Converter
              </button>
              
              {showUnitConverter && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Convert to different units:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableUnits.map(unit => (
                      <div
                        key={unit}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-white transition-colors cursor-pointer"
                        onMouseEnter={() => previewUnitConversion(unit)}
                        onMouseLeave={() => setConversionPreview(null)}
                        onClick={() => handleUnitChange(unit)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{unit}</span>
                          <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        </div>
                        {conversionPreview?.unit === unit && (
                          <div className="mt-2 text-sm text-gray-600">
                            {conversionPreview.low} - {conversionPreview.high} {unit}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center text-yellow-600 mb-3">
                <Lightbulb className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Suggested Reference Ranges</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {suggestion.low} - {suggestion.high} {range.unit}
                      </div>
                      <div className="text-sm text-gray-600">{suggestion.source}</div>
                    </div>
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Messages */}
          {range.low && range.high && (
            <div className="space-y-2">
              {parseFloat(range.low) >= parseFloat(range.high) && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Low value must be less than high value
                </div>
              )}
              {parseFloat(range.low) < 0 && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Negative values are unusual for most lab tests
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Reference Ranges</p>
                <ul className="space-y-1 text-xs">
                  <li>• Reference ranges vary by lab, age, gender, and population</li>
                  <li>• Always use the ranges provided by your specific laboratory when available</li>
                  <li>• Consult your healthcare provider for interpretation of results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {currentRange && onRemove && (
              <button
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove Range
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!range.low || !range.high || parseFloat(range.low) >= parseFloat(range.high)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
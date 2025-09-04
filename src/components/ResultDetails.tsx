import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Edit2,
  Tag,
  StickyNote,
  Info,
  X,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

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
  historicalValues?: Array<{
    value: number;
    date: string;
    unit: string;
  }>;
}

interface ResultDetailsProps {
  result: TestResult;
  onClose: () => void;
  onEdit: (result: TestResult) => void;
  onAddReferenceRange: (biomarkerId: string) => void;
  historicalData?: TestResult[];
}

export function ResultDetails({
  result,
  onClose,
  onEdit,
  onAddReferenceRange,
  historicalData = []
}: ResultDetailsProps) {
  const { formatDate } = useSettings();
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'history'>('overview');
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);

  const getRangeBadge = (biomarker: Biomarker) => {
    if (!biomarker.referenceRange || !biomarker.value) {
      return {
        status: 'missing',
        icon: MinusCircle,
        color: 'gray',
        text: 'No Range',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600'
      };
    }

    const value = parseFloat(biomarker.value);
    const low = parseFloat(biomarker.referenceRange.low);
    const high = parseFloat(biomarker.referenceRange.high);

    if (isNaN(value) || isNaN(low) || isNaN(high)) {
      return {
        status: 'missing',
        icon: MinusCircle,
        color: 'gray',
        text: 'No Range',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600'
      };
    }

    if (value < low) {
      return {
        status: 'low',
        icon: ArrowDownCircle,
        color: 'blue',
        text: 'Low',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700'
      };
    }

    if (value > high) {
      return {
        status: 'high',
        icon: ArrowUpCircle,
        color: 'red',
        text: 'High',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700'
      };
    }

    return {
      status: 'normal',
      icon: CheckCircle,
      color: 'green',
      text: 'Normal',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    };
  };

  const generateSparklineData = (biomarker: Biomarker): Array<{ value: number; date: string }> => {
    // Get historical data for this biomarker from historicalData
    const historicalValues = historicalData
      .filter(result => result.date <= result.date)
      .flatMap(result => 
        result.biomarkers
          .filter(b => b.name === biomarker.name)
          .map(b => ({
            value: parseFloat(b.value),
            date: result.date,
            unit: b.unit
          }))
      )
      .filter(v => !isNaN(v.value))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Add current value if not already included
    const currentValue = parseFloat(biomarker.value);
    if (!isNaN(currentValue)) {
      const existingIndex = historicalValues.findIndex(v => v.date === result.date);
      if (existingIndex === -1) {
        historicalValues.push({
          value: currentValue,
          date: result.date,
          unit: biomarker.unit
        });
      }
    }

    return historicalValues;
  };

  const renderSparkline = (data: Array<{ value: number; date: string }>) => {
    if (data.length < 2) {
      return (
        <div className="flex items-center justify-center h-8 w-16 text-xs text-gray-400">
          <Minus className="w-3 h-3" />
        </div>
      );
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) {
      return (
        <div className="flex items-center justify-center h-8 w-16 text-xs text-gray-400">
          <Minus className="w-3 h-3" />
        </div>
      );
    }

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 60; // 60px width
      const y = 28 - ((d.value - min) / range) * 24; // 28px height, 24px usable
      return `${x},${y}`;
    }).join(' ');

    const trend = values[values.length - 1] > values[0] ? 'up' : 
                 values[values.length - 1] < values[0] ? 'down' : 'stable';

    const trendColor = trend === 'up' ? 'text-red-500' : 
                      trend === 'down' ? 'text-blue-500' : 'text-gray-500';

    return (
      <div className="flex items-center">
        <svg width="64" height="32" className="mr-2">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={trendColor}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 60;
            const y = 28 - ((d.value - min) / range) * 24;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="currentColor"
                className={i === data.length - 1 ? trendColor : 'text-gray-400'}
              />
            );
          })}
        </svg>
        <div className={`flex items-center ${trendColor}`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend === 'stable' && <Minus className="w-3 h-3" />}
        </div>
      </div>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `${result.panel} - ${result.date}`,
        text: `Lab results from ${result.labName}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{result.panel}</h2>
              {result.isCustomPanel && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Custom
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(result.date)} at {result.time}
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {result.labName}
              </div>
            </div>

            {result.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {result.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(`${result.panel} - ${result.date}`)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Copy details"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={shareResult}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Share result"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(result)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: CheckCircle },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'history', label: 'History', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['normal', 'high', 'low', 'missing'].map((status) => {
                  const count = result.biomarkers.filter(b => getRangeBadge(b).status === status).length;
                  const config = {
                    normal: { label: 'Normal', color: 'text-green-600', bg: 'bg-green-50' },
                    high: { label: 'High', color: 'text-red-600', bg: 'bg-red-50' },
                    low: { label: 'Low', color: 'text-blue-600', bg: 'bg-blue-50' },
                    missing: { label: 'No Range', color: 'text-gray-600', bg: 'bg-gray-50' }
                  }[status];
                  
                  return (
                    <div key={status} className={`p-4 rounded-lg ${config.bg}`}>
                      <div className={`text-2xl font-bold ${config.color}`}>{count}</div>
                      <div className="text-sm text-gray-600">{config.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Biomarkers List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Test Results</h3>
                  <span className="text-sm text-gray-500">
                    {result.biomarkers.length} biomarkers
                  </span>
                </div>

                <div className="space-y-3">
                  {result.biomarkers.map((biomarker) => {
                    const badge = getRangeBadge(biomarker);
                    const BadgeIcon = badge.icon;
                    const sparklineData = generateSparklineData(biomarker);

                    return (
                      <div
                        key={biomarker.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{biomarker.name}</h4>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.textColor}`}>
                              <BadgeIcon className="w-3 h-3 mr-1" />
                              {badge.text}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-baseline space-x-1">
                              <span className="text-lg font-semibold text-gray-900">
                                {biomarker.value}
                              </span>
                              <span className="text-sm text-gray-600">{biomarker.unit}</span>
                            </div>
                            
                            {biomarker.referenceRange && (
                              <div className="text-sm text-gray-500">
                                Range: {biomarker.referenceRange.low}-{biomarker.referenceRange.high} {biomarker.referenceRange.unit}
                                {biomarker.referenceRange.labName && (
                                  <span className="ml-1 text-xs">({biomarker.referenceRange.labName})</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Sparkline */}
                          <div className="hidden md:block">
                            {renderSparkline(sparklineData)}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            {!biomarker.referenceRange && (
                              <button
                                onClick={() => onAddReferenceRange(biomarker.id)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Range
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedBiomarker(
                                selectedBiomarker === biomarker.id ? null : biomarker.id
                              )}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedBiomarker === biomarker.id && (
                          <div className="absolute left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Current Result</h5>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div>Value: <span className="font-medium">{biomarker.value} {biomarker.unit}</span></div>
                                  {biomarker.referenceRange && (
                                    <div>
                                      Reference: {biomarker.referenceRange.low}-{biomarker.referenceRange.high} {biomarker.referenceRange.unit}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Trend</h5>
                                {sparklineData.length > 1 ? (
                                  <div className="space-y-2">
                                    <div className="text-sm text-gray-600">
                                      {sparklineData.length} measurements since {sparklineData[0].date}
                                    </div>
                                    <div>
                                      {renderSparkline(sparklineData)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Not enough data for trend analysis
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {result.notes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <StickyNote className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Notes</h4>
                      <p className="text-blue-800 text-sm">{result.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Trends Analysis</h3>
                <p className="mb-6">Detailed trend analysis will be displayed here when historical data is available.</p>
                <p className="text-sm">Add more test results to see biomarker trends over time.</p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Historical Data</h3>
                <p className="mb-6">Previous test results for comparison will be shown here.</p>
                <p className="text-sm">This feature helps track changes in your biomarkers over time.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(new Date())}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <StickyNote className="w-4 h-4 mr-1" />
              {showNotes ? 'Hide Notes' : 'Show Notes'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
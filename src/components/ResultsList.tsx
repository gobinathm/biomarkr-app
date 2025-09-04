import React, { useState, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  Search,
  Filter,
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  MinusCircle,
  SortAsc,
  SortDesc,
  Grid3x3,
  List,
  FileText,
  Tag,
  AlertCircle,
  X,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  Download
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
}

interface ResultsListProps {
  results: TestResult[];
  onResultClick: (result: TestResult) => void;
  onEditResult: (result: TestResult) => void;
  onDeleteResult: (resultId: string) => void;
  onExportResults: (results: TestResult[]) => void;
}

type ViewMode = 'list' | 'grid';
type SortField = 'date' | 'panel' | 'lab' | 'flags';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  profile: string;
  panel: string[];
  lab: string[];
  dateRange: {
    start: string;
    end: string;
  };
  flags: ('high' | 'low' | 'normal' | 'missing')[];
  tags: string[];
  customPanelsOnly: boolean;
}

export function ResultsList({
  results,
  onResultClick,
  onEditResult,
  onDeleteResult,
  onExportResults
}: ResultsListProps) {
  const { formatDate } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    profile: '',
    panel: [],
    lab: [],
    dateRange: { start: '', end: '' },
    flags: [],
    tags: [],
    customPanelsOnly: false
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const profiles = [...new Set(results.map(r => r.profile))];
    const panels = [...new Set(results.map(r => r.panel))];
    const labs = [...new Set(results.map(r => r.labName))];
    const tags = [...new Set(results.flatMap(r => r.tags))];
    
    return { profiles, panels, labs, tags };
  }, [results]);

  // Helper function to determine flag status for a result
  const getResultFlags = (result: TestResult) => {
    const flags = new Set<'high' | 'low' | 'normal' | 'missing'>();
    
    result.biomarkers.forEach(biomarker => {
      if (!biomarker.referenceRange || !biomarker.value) {
        flags.add('missing');
        return;
      }

      const value = parseFloat(biomarker.value);
      const low = parseFloat(biomarker.referenceRange.low);
      const high = parseFloat(biomarker.referenceRange.high);

      if (isNaN(value) || isNaN(low) || isNaN(high)) {
        flags.add('missing');
      } else if (value < low) {
        flags.add('low');
      } else if (value > high) {
        flags.add('high');
      } else {
        flags.add('normal');
      }
    });

    return Array.from(flags);
  };

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter(result => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          result.panel,
          result.labName,
          result.notes,
          ...result.tags,
          ...result.biomarkers.map(b => b.name)
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }

      // Profile filter
      if (filters.profile && result.profile !== filters.profile) return false;

      // Panel filter
      if (filters.panel.length && !filters.panel.includes(result.panel)) return false;

      // Lab filter
      if (filters.lab.length && !filters.lab.includes(result.labName)) return false;

      // Custom panels filter
      if (filters.customPanelsOnly && !result.isCustomPanel) return false;

      // Date range filter
      if (filters.dateRange.start && result.date < filters.dateRange.start) return false;
      if (filters.dateRange.end && result.date > filters.dateRange.end) return false;

      // Tags filter
      if (filters.tags.length) {
        const hasTag = filters.tags.some(tag => result.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Flags filter
      if (filters.flags.length) {
        const resultFlags = getResultFlags(result);
        const hasFlag = filters.flags.some(flag => resultFlags.includes(flag));
        if (!hasFlag) return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
          break;
        case 'panel':
          comparison = a.panel.localeCompare(b.panel);
          break;
        case 'lab':
          comparison = a.labName.localeCompare(b.labName);
          break;
        case 'flags':
          const aFlags = getResultFlags(a);
          const bFlags = getResultFlags(b);
          const flagPriority = { high: 3, low: 2, normal: 1, missing: 0 };
          const aMaxFlag = Math.max(...aFlags.map(f => flagPriority[f]));
          const bMaxFlag = Math.max(...bFlags.map(f => flagPriority[f]));
          comparison = aMaxFlag - bMaxFlag;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [results, searchQuery, filters, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      profile: '',
      panel: [],
      lab: [],
      dateRange: { start: '', end: '' },
      flags: [],
      tags: [],
      customPanelsOnly: false
    });
    setSearchQuery('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.profile) count++;
    if (filters.panel.length) count++;
    if (filters.lab.length) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.flags.length) count++;
    if (filters.tags.length) count++;
    if (filters.customPanelsOnly) count++;
    return count;
  }, [filters]);

  const renderResultCard = (result: TestResult) => {
    const resultFlags = getResultFlags(result);
    const flagCounts = {
      high: result.biomarkers.filter(b => {
        if (!b.referenceRange || !b.value) return false;
        const value = parseFloat(b.value);
        const high = parseFloat(b.referenceRange.high);
        return !isNaN(value) && !isNaN(high) && value > high;
      }).length,
      low: result.biomarkers.filter(b => {
        if (!b.referenceRange || !b.value) return false;
        const value = parseFloat(b.value);
        const low = parseFloat(b.referenceRange.low);
        return !isNaN(value) && !isNaN(low) && value < low;
      }).length,
      normal: result.biomarkers.filter(b => {
        if (!b.referenceRange || !b.value) return false;
        const value = parseFloat(b.value);
        const low = parseFloat(b.referenceRange.low);
        const high = parseFloat(b.referenceRange.high);
        return !isNaN(value) && !isNaN(low) && !isNaN(high) && value >= low && value <= high;
      }).length,
      missing: result.biomarkers.filter(b => !b.referenceRange || !b.value).length
    };

    return (
      <div
        key={result.id}
        className={`bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow ${
          viewMode === 'grid' ? 'p-4' : 'p-6'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{result.panel}</h3>
              {result.isCustomPanel && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                  Custom
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(result.date)}
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {result.labName}
              </div>
            </div>

            {result.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-3 h-3 text-gray-400" />
                {result.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {result.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{result.tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResultClick(result);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditResult(result);
              }}
              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
              title="Edit result"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteResult(result.id);
              }}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              title="Delete result"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Biomarkers Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { key: 'high', label: 'High', count: flagCounts.high, color: 'text-red-600', bg: 'bg-red-50', icon: ArrowUpCircle },
            { key: 'low', label: 'Low', count: flagCounts.low, color: 'text-blue-600', bg: 'bg-blue-50', icon: ArrowDownCircle },
            { key: 'normal', label: 'Normal', count: flagCounts.normal, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
            { key: 'missing', label: 'No Range', count: flagCounts.missing, color: 'text-gray-600', bg: 'bg-gray-50', icon: MinusCircle }
          ].map(({ key, label, count, color, bg, icon: Icon }) => (
            <div key={key} className={`text-center p-2 rounded-lg ${bg}`}>
              <div className={`text-lg font-semibold ${color}`}>{count}</div>
              <div className="text-xs text-gray-600 flex items-center justify-center">
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Sample Biomarkers */}
        {viewMode === 'list' && result.biomarkers.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Sample Results ({result.biomarkers.length} total)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {result.biomarkers.slice(0, 6).map((biomarker) => (
                <div key={biomarker.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate">{biomarker.name}</span>
                  <span className="font-medium text-gray-900">
                    {biomarker.value} {biomarker.unit}
                  </span>
                </div>
              ))}
              {result.biomarkers.length > 6 && (
                <div className="text-sm text-gray-500 italic">
                  +{result.biomarkers.length - 6} more...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {result.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-2">{result.notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search panels, biomarkers, labs, dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="panel-asc">Panel A-Z</option>
              <option value="panel-desc">Panel Z-A</option>
              <option value="lab-asc">Lab A-Z</option>
              <option value="lab-desc">Lab Z-A</option>
              <option value="flags-desc">Most Flagged</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative px-4 py-2 border rounded-lg font-medium flex items-center transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Export */}
          <button
            onClick={() => onExportResults(filteredAndSortedResults)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile</label>
              <select
                value={filters.profile}
                onChange={(e) => setFilters(prev => ({ ...prev, profile: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Profiles</option>
                {filterOptions.profiles.map(profile => (
                  <option key={profile} value={profile}>{profile}</option>
                ))}
              </select>
            </div>

            {/* Panel Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Panels</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.panels.map(panel => (
                  <label key={panel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.panel.includes(panel)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, panel: [...prev.panel, panel] }));
                        } else {
                          setFilters(prev => ({ ...prev, panel: prev.panel.filter(p => p !== panel) }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{panel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lab Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labs</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.labs.map(lab => (
                  <label key={lab} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.lab.includes(lab)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, lab: [...prev.lab, lab] }));
                        } else {
                          setFilters(prev => ({ ...prev, lab: prev.lab.filter(l => l !== lab) }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{lab}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Flags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Result Flags</label>
              <div className="space-y-2">
                {[
                  { key: 'high', label: 'High Values', color: 'text-red-600' },
                  { key: 'low', label: 'Low Values', color: 'text-blue-600' },
                  { key: 'normal', label: 'Normal Values', color: 'text-green-600' },
                  { key: 'missing', label: 'Missing Ranges', color: 'text-gray-600' }
                ].map(({ key, label, color }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.flags.includes(key as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, flags: [...prev.flags, key as any] }));
                        } else {
                          setFilters(prev => ({ ...prev, flags: prev.flags.filter(f => f !== key) }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className={`ml-2 text-sm ${color}`}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.tags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                        } else {
                          setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.customPanelsOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, customPanelsOnly: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Custom panels only</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedResults.length} of {results.length} results
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Results */}
      {filteredAndSortedResults.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          {results.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test results yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your health by adding your first lab result</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Add First Result
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching results</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedResults.map(renderResultCard)}
        </div>
      )}
    </div>
  );
}
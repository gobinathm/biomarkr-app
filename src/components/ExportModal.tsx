import React, { useState } from 'react';
import { X, Download, FileText, Database, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: '1' | '2' | '3') => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'1' | '2' | '3'>('1');

  if (!isOpen) return null;

  const formats = [
    {
      id: '1' as const,
      title: 'JSON Format',
      description: 'Complete data export including all test results, settings, profiles, and custom panels',
      icon: Database,
      pros: ['Complete backup', 'Importable', 'All data preserved'],
      recommended: true
    },
    {
      id: '2' as const,
      title: 'CSV Format',
      description: 'Test results only in spreadsheet format',
      icon: FileSpreadsheet,
      pros: ['Excel compatible', 'Easy analysis', 'Lightweight'],
      recommended: false
    },
    {
      id: '3' as const,
      title: 'HTML Report',
      description: 'Formatted summary report for printing or sharing',
      icon: FileText,
      pros: ['Print friendly', 'Shareable', 'Professional layout'],
      recommended: false
    }
  ];

  const handleExport = () => {
    onExport(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Choose the export format that best suits your needs:
          </p>

          <div className="space-y-4">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <label
                  key={format.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="export-format"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={(e) => setSelectedFormat(e.target.value as '1' | '2' | '3')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="font-medium text-gray-900">{format.title}</h4>
                        {format.recommended && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {format.pros.map((pro) => (
                          <span
                            key={pro}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Export Notes</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• All exports include only data stored locally on your device</li>
                  <li>• No personal data is sent to external servers</li>
                  <li>• JSON exports can be imported back into Biomarkr</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
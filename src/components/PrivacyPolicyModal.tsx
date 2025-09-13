import React from 'react';
import { X, Shield, Lock, Eye, Database, Globe, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Intro */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                <strong>Privacy-First by Design:</strong> Biomarkr is built with your privacy as the foundation. 
                Your health data never leaves your device and we never collect, store, or transmit your personal information.
              </p>
            </div>

            {/* Core Principles */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-600" />
                Core Privacy Principles
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">100% Local Storage</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All your health data is stored locally on your device using browser storage. 
                    No data is ever transmitted to external servers.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Data Collection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We don't collect analytics, usage data, or any personal information. 
                    We don't even know you're using the application.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Tracking</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No cookies for tracking, no third-party analytics, no behavioral tracking. 
                    Your browsing and usage patterns remain private.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Accounts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No registration, no personal information required. 
                    Start using immediately without providing any details.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Storage */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Data Storage & Security
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Local Browser Storage</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Your health data is stored using your browser's localStorage and IndexedDB APIs. 
                    This data remains on your device and is not accessible to other websites.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Optional Encryption</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Enable vault protection to encrypt your data locally with a passphrase. 
                    This adds an extra layer of security using client-side encryption.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cloud Backup (Optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    If you choose to use cloud backup, your encrypted data is stored in your personal cloud storage 
                    (Google Drive, Dropbox, or OneDrive). We only facilitate the connection - the data goes directly 
                    from your device to your cloud storage.
                  </p>
                </div>
              </div>
            </section>

            {/* Open Source */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Transparency & Open Source
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Biomarkr is open source software. You can inspect our code, verify our privacy claims, 
                and even run your own instance. The source code is available on GitHub for complete transparency.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  <strong>Audit & Verify:</strong> Don't just take our word for it. Our open source nature 
                  allows security researchers and developers to audit our code and confirm our privacy practices.
                </p>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Policy Updates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This privacy policy may be updated to reflect changes in our practices or for legal compliance. 
                Any updates will be posted in the application and on our GitHub repository.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Version:</strong> 1.0</p>
              </div>
            </section>

            {/* Medical Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Medical Disclaimer</h4>
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    Biomarkr is a personal health tracking tool and is not intended to diagnose, treat, cure, 
                    or prevent any disease. Always consult with qualified healthcare professionals for medical advice. 
                    This software is provided for informational purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
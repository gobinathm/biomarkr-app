import React from 'react';
import { X, Scale, AlertCircle, Shield, Code, Heart, FileText } from 'lucide-react';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfUseModal({ isOpen, onClose }: TermsOfUseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Use</h2>
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                <strong>Welcome to Biomarkr:</strong> By using this application, you agree to these terms of use. 
                Biomarkr is provided as open source software for personal health data management.
              </p>
            </div>

            {/* Acceptance */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Acceptance of Terms
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By accessing and using Biomarkr, you accept and agree to be bound by these terms and conditions. 
                  If you do not agree with any part of these terms, you should not use this application.
                </p>
              </div>
            </section>

            {/* License */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-green-600" />
                Open Source License
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">MIT License</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Biomarkr is licensed under the MIT License, which permits you to use, copy, modify, 
                    merge, publish, distribute, sublicense, and/or sell copies of the software.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rights and Permissions</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Use the software for personal and commercial purposes</li>
                    <li>• Modify and customize the software for your needs</li>
                    <li>• Distribute copies of the original or modified software</li>
                    <li>• Create derivative works based on the software</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                User Responsibilities
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Security</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You are responsible for protecting your health data, managing backups, 
                    and securing access to your devices.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Accurate Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ensure the health data you enter is accurate and complete. 
                    Biomarkr relies on the quality of data you provide.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lawful Use</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the software in compliance with applicable laws and regulations 
                    in your jurisdiction.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Professional Advice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Always consult healthcare professionals for medical advice. 
                    Do not rely solely on this software for health decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Disclaimer of Warranties
              </h3>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                  <strong>AS IS BASIS:</strong> This software is provided "as is" without warranty of any kind. 
                  We make no representations or warranties regarding the accuracy, reliability, or suitability 
                  of the software for any particular purpose.
                </p>
              </div>
            </section>

            {/* Medical Disclaimer */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Medical Disclaimer
              </h3>
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Not Medical Advice</h4>
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    Biomarkr is not intended to diagnose, treat, cure, or prevent any disease. 
                    The information provided by this software should not be used as a substitute 
                    for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Professional Consultation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Always seek the advice of your physician or other qualified health provider 
                    with any questions you may have regarding a medical condition. Never disregard 
                    professional medical advice or delay in seeking it because of something you 
                    have read or seen in this application.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Limitation of Liability</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  To the maximum extent permitted by law, the developers and contributors of Biomarkr 
                  shall not be liable for any direct, indirect, incidental, special, consequential, 
                  or punitive damages arising out of your use of this software.
                </p>
              </div>
            </section>

            {/* Platform Availability */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Availability</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Biomarkr is available on multiple platforms:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• Web browsers (Chrome, Firefox, Safari, Edge)</li>
                  <li>• Desktop applications (Windows, macOS, Linux)</li>
                  <li>• Mobile applications (iOS, Android via PWA)</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform-specific features may vary. We make no guarantee that all features 
                  will be available on all platforms.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Changes to Terms</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  We reserve the right to modify these terms at any time. Updates will be posted 
                  in the application and on our GitHub repository. Your continued use of the software 
                  after such modifications constitutes acceptance of the updated terms.
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded mt-4">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Version:</strong> 1.0</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
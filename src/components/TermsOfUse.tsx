import React from 'react';
import { 
  ArrowLeft,
  FileText,
  AlertCircle,
  Shield,
  Scale,
  Users,
  Code,
  Heart,
  Gavel,
  UserX,
  RefreshCw,
  Globe,
  Lock,
  Smartphone
} from 'lucide-react';

interface TermsOfUseProps {
  onBack: () => void;
}

export function TermsOfUse({ onBack }: TermsOfUseProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Homepage</span>
            </button>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Legal Terms</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Use
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Legal terms and conditions for using Biomarkr
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Acceptance */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                By using Biomarkr ("the Application"), you agree to be bound by these Terms of Use. 
                If you do not agree to these terms, please do not use the Application.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                These terms constitute a legal agreement between you and the developers of Biomarkr 
                regarding your use of the Application and its features.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Description of Service</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Biomarkr is a personal health data management application that allows users to:
              </p>
              
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-6">
                <li>• Track and store personal biomarker test results</li>
                <li>• Analyze health data trends over time</li>
                <li>• Manage multiple health profiles (family members)</li>
                <li>• Export health data in various formats</li>
                <li>• Optionally backup data to cloud storage services</li>
              </ul>
              
              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Privacy-First Design</h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  The Application operates primarily as a client-side tool, storing data locally on your device. 
                  No health data is transmitted to external servers without your explicit consent.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Responsibilities</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Appropriate Use</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">You agree to:</p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                  <li>• Use the Application for personal health tracking purposes only</li>
                  <li>• Provide accurate health information for meaningful analysis</li>
                  <li>• Keep your device and application secure</li>
                  <li>• Respect the privacy of others when managing family profiles</li>
                  <li>• Comply with all applicable local laws and regulations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prohibited Uses</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">You agree NOT to:</p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                  <li>• Use the Application for commercial medical practice</li>
                  <li>• Share or distribute others' health information without consent</li>
                  <li>• Attempt to reverse engineer or modify the Application</li>
                  <li>• Use the Application to store illegal or harmful content</li>
                  <li>• Interfere with the Application's security features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Medical Disclaimer */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Disclaimer</h2>
            </div>
            
            <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-6 rounded-r-lg">
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                  Important Medical Information
                </h3>
                <div className="text-amber-700 dark:text-amber-400 space-y-2">
                  <p>
                    <strong>Biomarkr is NOT a medical device or diagnostic tool.</strong> The Application 
                    is designed for personal health data organization and tracking only.
                  </p>
                  <p>
                    The Application does not:
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li>• Provide medical advice or diagnosis</li>
                    <li>• Replace professional medical consultation</li>
                    <li>• Analyze or interpret health data medically</li>
                    <li>• Make health recommendations</li>
                  </ul>
                  <p>
                    <strong>Always consult qualified healthcare professionals</strong> for medical advice, 
                    diagnosis, or treatment decisions. Never disregard professional medical advice based 
                    on information from this Application.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Open Source License */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Open Source License</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Biomarkr is released under the MIT License, which grants you the following rights:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Permissions</h3>
                  <ul className="text-green-700 dark:text-green-400 space-y-1 text-sm">
                    <li>• Use for any purpose</li>
                    <li>• Modify the source code</li>
                    <li>• Distribute copies</li>
                    <li>• Create derivative works</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Conditions</h3>
                  <ul className="text-red-700 dark:text-red-400 space-y-1 text-sm">
                    <li>• Include original license</li>
                    <li>• Include copyright notice</li>
                    <li>• No warranty implied</li>
                    <li>• Authors not liable</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Limitation of Liability</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                To the fullest extent permitted by law, the developers of Biomarkr shall not be liable for:
              </p>
              
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-6">
                <li>• Any direct, indirect, incidental, or consequential damages</li>
                <li>• Loss of data, even if backed up to cloud storage</li>
                <li>• Medical decisions made based on Application usage</li>
                <li>• Technical malfunctions or data corruption</li>
                <li>• Third-party cloud storage service failures</li>
                <li>• Any health outcomes related to Application use</li>
              </ul>
              
              <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">"AS IS" Provision</h3>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  The Application is provided "as is" without warranties of any kind, either express or implied. 
                  Use at your own risk and always maintain backups of important health data.
                </p>
              </div>
            </div>
          </section>

          {/* Data and Privacy */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data and Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Data Rights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You retain full ownership and control over all health data entered into the Application. 
                  Our Privacy Policy details how your data is handled and protected.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Security</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  While we implement security measures, you are responsible for maintaining the security 
                  of your device and any passphrases used for data encryption.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cloud Storage</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  If you choose to use cloud backup features, your relationship with the cloud storage 
                  provider (Google, Dropbox, Microsoft) is governed by their respective terms of service.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Availability */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Availability</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Web App</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modern browsers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Monitor className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Desktop</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Windows, macOS, Linux</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Smartphone className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Mobile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">iOS, Android (PWA)</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                We strive to maintain compatibility across platforms but cannot guarantee identical 
                functionality or availability on all devices or operating systems.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <UserX className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Termination</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                You may stop using Biomarkr at any time. Since the Application stores data locally, 
                simply removing the Application or clearing your browser data will terminate your use.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                These terms remain in effect until terminated. Sections regarding liability, 
                disclaimers, and intellectual property survive termination.
              </p>
              
              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Data Retention</h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  Your data remains under your control. Remember to securely delete any cloud backups 
                  if you wish to completely remove all traces of your health data.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <RefreshCw className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Changes to Terms</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We may update these Terms of Use from time to time. When we make changes:
              </p>
              
              <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                <li>• The updated date at the top of this page will be modified</li>
                <li>• Significant changes will be communicated through the Application</li>
                <li>• Changes will be posted on our GitHub repository</li>
                <li>• Continued use constitutes acceptance of new terms</li>
              </ul>
              
              <p className="text-gray-600 dark:text-gray-400">
                We encourage you to review these terms periodically to stay informed of any updates.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Gavel className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Governing Law</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                These Terms of Use are governed by and construed in accordance with applicable 
                international laws regarding open source software and data privacy.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                As an open source project, Biomarkr is designed to comply with global privacy 
                regulations including GDPR, CCPA, and other applicable data protection laws.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Questions and Contact</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                If you have questions about these Terms of Use, you can:
              </p>
              
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-6">
                <li>• Review our open source code for technical details</li>
                <li>• Open an issue on our GitHub repository</li>
                <li>• Participate in community discussions</li>
                <li>• Contact us through our official support channels</li>
              </ul>
              
              <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Open Source Community</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  As an open source project, we encourage community involvement in improving these terms 
                  and the overall user experience. Your feedback is valuable to us.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Final Notice */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-8 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You for Using Biomarkr</h2>
            <p className="opacity-90 max-w-2xl mx-auto">
              By using Biomarkr, you're taking control of your health data with a privacy-first, 
              open source solution. We're committed to maintaining your trust through transparency 
              and user empowerment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
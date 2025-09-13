import React from 'react';
import { 
  ArrowLeft,
  Shield,
  Database,
  Lock,
  Eye,
  Cloud,
  Trash2,
  UserCheck,
  Globe,
  Server,
  Key,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Privacy-First</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">Our Privacy Principles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Database className="w-5 h-5" />, text: "Local-First Storage" },
              { icon: <Lock className="w-5 h-5" />, text: "End-to-End Encryption" },
              { icon: <Eye className="w-5 h-5" />, text: "No Data Collection" },
              { icon: <UserCheck className="w-5 h-5" />, text: "No Account Required" }
            ].map((principle, index) => (
              <div key={index} className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                {principle.icon}
                <span className="font-medium">{principle.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Data Collection */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Collection</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>What We DON'T Collect</span>
                </h3>
                <ul className="text-green-700 dark:text-green-400 space-y-1">
                  <li>• Personal health information or biomarker data</li>
                  <li>• User accounts, emails, or personal identifiers</li>
                  <li>• Usage analytics or tracking data</li>
                  <li>• Device information or browser fingerprints</li>
                  <li>• Location data or IP addresses</li>
                  <li>• Any form of behavioral data</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Data Processing</h3>
                <p className="text-blue-700 dark:text-blue-400">
                  Biomarkr operates as a client-side application. All health data processing occurs entirely 
                  within your browser or local device. No health information is transmitted to external servers.
                </p>
              </div>
            </div>
          </section>

          {/* Data Storage */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Server className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Storage</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Local Storage</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Your health data is stored locally on your device using browser localStorage and IndexedDB. 
                  This data never leaves your device unless you explicitly choose to use cloud backup features.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cloud Storage (Optional)</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  If you choose to enable cloud backup, your data is encrypted client-side before being 
                  uploaded to your chosen cloud provider (Google Drive, Dropbox, or OneDrive).
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• Encryption occurs on your device using your passphrase</li>
                  <li>• Only encrypted data is stored in the cloud</li>
                  <li>• We cannot access or decrypt your cloud-stored data</li>
                  <li>• You control which cloud provider to use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Encryption */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Encryption & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vault Protection</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Biomarkr offers optional vault protection where your health data can be encrypted with 
                  a passphrase of your choice using industry-standard encryption.
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• AES-256 encryption for sensitive data</li>
                  <li>• Client-side encryption only</li>
                  <li>• Your passphrase is never stored or transmitted</li>
                  <li>• Auto-lock functionality for additional security</li>
                </ul>
              </div>

              <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-r-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Important Notice</h4>
                    <p className="text-amber-700 dark:text-amber-400 text-sm">
                      If you forget your vault passphrase, your encrypted data cannot be recovered. 
                      We recommend keeping a secure backup of your passphrase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cloud Storage Providers</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  When you use cloud backup features, your encrypted data is stored with your chosen provider:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• <strong>Google Drive:</strong> Subject to Google's privacy policy</li>
                  <li>• <strong>Dropbox:</strong> Subject to Dropbox's privacy policy</li>
                  <li>• <strong>OneDrive:</strong> Subject to Microsoft's privacy policy</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Analytics or Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Biomarkr does not use any analytics services, tracking pixels, or third-party scripts 
                  that could compromise your privacy.
                </p>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights & Control</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Ownership</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• You own all your health data</li>
                  <li>• Export data in multiple formats</li>
                  <li>• Move data between devices</li>
                  <li>• Complete data portability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Control</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Delete data at any time</li>
                  <li>• Control cloud backup settings</li>
                  <li>• Manage encryption settings</li>
                  <li>• No vendor lock-in</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Deletion */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Deletion</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Since all data is stored locally on your device, you have complete control over data deletion:
              </p>
              
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                <li>• Clear browser data to remove all local information</li>
                <li>• Use the app's built-in data management tools</li>
                <li>• Uninstall the application to remove all traces</li>
                <li>• Manually delete cloud backup files from your storage provider</li>
              </ul>

              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Complete Removal</h4>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  To completely remove all data, clear your browser storage and delete any cloud backup 
                  files from your chosen cloud provider.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact & Updates</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy Questions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have questions about this privacy policy or our data practices, you can:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-2">
                  <li>• Review our open-source code for transparency</li>
                  <li>• Open an issue on our GitHub repository</li>
                  <li>• Contact us through our community forums</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Policy Updates</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  Any significant changes will be communicated through the application and our GitHub repository.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg mt-8">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Medical Disclaimer</h3>
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
  );
}
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Download,
  Terminal,
  Globe,
  Monitor,
  Smartphone,
  Github,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Folder,
  PlayCircle,
  Settings,
  Cloud,
  Lock
} from 'lucide-react';

interface InstallationGuideProps {
  onBack: () => void;
}

export function InstallationGuide({ onBack }: InstallationGuideProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'web' | 'desktop' | 'mobile'>('web');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string, commandId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(commandId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const CodeBlock = ({ code, commandId }: { code: string; commandId: string }) => (
    <div className="bg-gray-900 rounded-lg p-4 relative group">
      <button
        onClick={() => copyToClipboard(code, commandId)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700 rounded"
      >
        {copiedCommand === commandId ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="text-green-400 text-sm overflow-x-auto pr-10">
        <code>{code}</code>
      </pre>
    </div>
  );

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
              <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Open Source</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Download className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Installation Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Set up Biomarkr on your own infrastructure for complete data control and privacy
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          {[
            { id: 'web', icon: Globe, label: 'Web Application' },
            { id: 'desktop', icon: Monitor, label: 'Desktop App' },
            { id: 'mobile', icon: Smartphone, label: 'Mobile App' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSelectedPlatform(id as any)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
                selectedPlatform === id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Web Application Setup */}
        {selectedPlatform === 'web' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Web Application Setup</h2>
              </div>

              <div className="space-y-6">
                {/* Prerequisites */}
                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Prerequisites</h3>
                  <ul className="text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Node.js 18+ installed</li>
                    <li>• Git (for cloning the repository)</li>
                    <li>• A web server (nginx, Apache, or similar)</li>
                  </ul>
                </div>

                {/* Step 1 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Clone the Repository</span>
                  </h3>
                  <CodeBlock 
                    code="git clone https://github.com/yourusername/biomarkr-app.git
cd biomarkr-app"
                    commandId="clone"
                  />
                </div>

                {/* Step 2 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Install Dependencies</span>
                  </h3>
                  <CodeBlock 
                    code="npm install"
                    commandId="install"
                  />
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Build for Production</span>
                  </h3>
                  <CodeBlock 
                    code="npm run build"
                    commandId="build"
                  />
                </div>

                {/* Step 4 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Serve the Application</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Copy the contents of the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">dist/</code> folder to your web server directory:
                  </p>
                  <CodeBlock 
                    code="# Example with nginx
sudo cp -r dist/* /var/www/html/biomarkr/

# Or serve locally for testing
npm run preview"
                    commandId="serve"
                  />
                </div>

                {/* Security Notice */}
                <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">HTTPS Recommended</h4>
                      <p className="text-amber-700 dark:text-amber-400 text-sm">
                        For security, especially when using cloud storage features, serve your application over HTTPS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Application Setup */}
        {selectedPlatform === 'desktop' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Monitor className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Desktop Application Setup</h2>
              </div>

              <div className="space-y-6">
                {/* Prerequisites */}
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Prerequisites</h3>
                  <ul className="text-green-700 dark:text-green-400 space-y-1">
                    <li>• Node.js 18+ installed</li>
                    <li>• Git (for cloning the repository)</li>
                    <li>• Platform-specific build tools</li>
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Clone and Install</span>
                  </h3>
                  <CodeBlock 
                    code="git clone https://github.com/yourusername/biomarkr-app.git
cd biomarkr-app
npm install"
                    commandId="desktop-clone"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Install Electron Dependencies</span>
                  </h3>
                  <CodeBlock 
                    code="npm install --save-dev electron electron-builder"
                    commandId="electron-deps"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Create Electron Main Process</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Create <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">electron/main.js</code>:</p>
                  <CodeBlock 
                    code={`const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('dist/index.html');
}

app.whenReady(() => {
  createWindow();
});`}
                    commandId="electron-main"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Build Desktop App</span>
                  </h3>
                  <CodeBlock 
                    code="npm run build
npx electron-builder --win --mac --linux"
                    commandId="desktop-build"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Application Setup */}
        {selectedPlatform === 'mobile' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile Application Setup</h2>
              </div>

              <div className="space-y-6">
                {/* Prerequisites */}
                <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Prerequisites</h3>
                  <ul className="text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• Node.js 18+ and npm</li>
                    <li>• Android Studio (for Android)</li>
                    <li>• Xcode (for iOS, macOS only)</li>
                    <li>• Capacitor CLI</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Install Capacitor</span>
                  </h3>
                  <CodeBlock 
                    code="npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios"
                    commandId="capacitor-install"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Initialize Capacitor</span>
                  </h3>
                  <CodeBlock 
                    code="npx cap init biomarkr com.yourcompany.biomarkr"
                    commandId="capacitor-init"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Build and Sync</span>
                  </h3>
                  <CodeBlock 
                    code="npm run build
npx cap sync"
                    commandId="capacitor-sync"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Open in Native IDE</span>
                  </h3>
                  <CodeBlock 
                    code="# For Android
npx cap open android

# For iOS (macOS only)
npx cap open ios"
                    commandId="capacitor-open"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Configuration */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Environment Variables */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Environment Configuration</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create a <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env</code> file for optional cloud storage configuration:
            </p>
            <CodeBlock 
              code={`# Optional: Cloud Storage API Keys
VITE_GOOGLE_DRIVE_CLIENT_ID=your_client_id
VITE_DROPBOX_APP_KEY=your_app_key
VITE_ONEDRIVE_CLIENT_ID=your_client_id`}
              commandId="env-config"
            />
          </div>

          {/* Security Considerations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security Best Practices</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Use HTTPS in production</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Keep dependencies updated</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Enable Content Security Policy</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Regular security audits</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="mb-6 opacity-90">
              Having trouble with the installation? Check out our resources or get community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/yourusername/biomarkr-app/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Issues</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/yourusername/biomarkr-app/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
              >
                <span>Community Discussions</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
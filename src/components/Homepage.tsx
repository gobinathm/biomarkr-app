import React from 'react';
import { 
  Heart, 
  Shield, 
  TrendingUp, 
  Users, 
  Cloud, 
  Download,
  ChevronRight,
  Activity,
  FileText,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Github,
  Book,
  User
} from 'lucide-react';

interface HomepageProps {
  onGetStarted: () => void;
  onInstallationGuide: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfUse: () => void;
}

export function Homepage({ onGetStarted, onInstallationGuide, onPrivacyPolicy, onTermsOfUse }: HomepageProps) {
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Comprehensive Health Tracking",
      description: "Track 70+ biomarkers across 17+ test panel types covering all major health systems including cardiovascular, metabolic, hormonal, and nutritional markers.",
      color: "text-red-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy-First Architecture",
      description: "Your data never leaves your device. 100% local storage with optional vault protection using client-side encryption. No accounts required.",
      color: "text-green-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Interactive charts, trend analysis, and pattern recognition help you understand your health journey over time.",
      color: "text-blue-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Profile Support",
      description: "Manage health data for your entire family with separate profiles for each member, including children and adults.",
      color: "text-purple-500"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Optional Cloud Backup",
      description: "Secure encrypted backups to Google Drive, Dropbox, or OneDrive. Your choice, your control.",
      color: "text-cyan-500"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Data Export & Portability",
      description: "Export your data to PDF, CSV, or JSON formats. Your data belongs to you, take it anywhere.",
      color: "text-orange-500"
    }
  ];

  const platforms = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Web Application",
      description: "Access from any modern browser"
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      title: "Desktop App",
      description: "Native apps for Windows, macOS, Linux"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Mobile App",
      description: "Progressive Web App for iOS & Android"
    }
  ];

  const highlights = [
    "17+ Test Panel Types",
    "70+ Biomarkers Supported",
    "Multi-Profile Family Management",
    "Trend Analysis & Charts",
    "Reference Range Management",
    "Smart Reminders",
    "Demo Mode Available",
    "Open Source"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-10 w-10 text-blue-600 drop-shadow-sm" />
              <div>
                <h1 className="text-2xl font-display font-bold bg-logo-gradient dark:bg-logo-gradient-dark bg-clip-text text-transparent">Biomarkr</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personal Health Data Tracker</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onInstallationGuide}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
              >
                <Book className="w-4 h-4" />
                <span className="hidden sm:inline">Install Guide</span>
              </button>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Activity className="h-20 w-20 text-blue-600 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Take Control of Your
              <span className="bg-logo-gradient dark:bg-logo-gradient-dark bg-clip-text text-transparent"> Health Data</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive, privacy-first personal health data management application for tracking, 
              analyzing, and understanding your biomarker test results over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>Start Tracking Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={onInstallationGuide}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Self-Install</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Complete Health Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to track, analyze, and understand your health data in one secure application
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className={`${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-white">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Available on All Your Devices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Access your health data wherever you are
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-blue-600 dark:text-blue-400">
                    {platform.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {platform.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="flex justify-center mb-6">
              <Activity className="h-16 w-16 text-blue-600 drop-shadow-lg" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of users who trust Biomarkr to manage their personal health data securely and privately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
              >
                <User className="w-5 h-5" />
                <span>Start Now - No Account Needed</span>
              </button>
              <button
                onClick={onInstallationGuide}
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>Self-Host Guide</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="h-10 w-10 text-blue-400 drop-shadow-sm" />
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Biomarkr</h3>
                  <p className="text-sm text-gray-400">Personal Health Data Tracker</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Open source, privacy-first health data management for everyone. 
                Your data, your control, your health journey.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Application</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={onGetStarted}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Get Started
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onInstallationGuide}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Installation Guide
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={onPrivacyPolicy}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onTermsOfUse}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Use
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Biomarkr. Open source software licensed under MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
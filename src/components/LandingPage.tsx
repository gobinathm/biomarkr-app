import React, { useState } from 'react';
import { 
  Activity, 
  Shield, 
  TrendingUp, 
  Users, 
  Cloud, 
  Download,
  Heart,
  Lock,
  Globe,
  Database,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Github,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  X,
  Sparkles,
  Zap,
  Code,
  Smartphone,
  Monitor,
  AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onStartDemo: () => void;
  onDismiss?: () => void;
}

export function LandingPage({ onGetStarted, onStartDemo, onDismiss }: LandingPageProps) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [showDataPolicy, setShowDataPolicy] = useState(false);

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Comprehensive Health Tracking",
      description: "Track 70+ biomarkers across 17+ test panel types covering cardiovascular, metabolic, hormonal, and nutritional markers.",
      color: "text-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy-First Architecture",
      description: "Your data never leaves your device. 100% local storage with optional vault protection using client-side encryption.",
      color: "text-green-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Interactive charts, trend analysis, and pattern recognition to understand your health journey over time.",
      color: "text-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Profile Support",
      description: "Manage health data for your entire family with separate profiles for each member, including children and adults.",
      color: "text-purple-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Optional Cloud Backup",
      description: "Secure encrypted backups to Google Drive, Dropbox, or OneDrive. Your choice, your control.",
      color: "text-cyan-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Data Export & Portability",
      description: "Export your data to PDF, CSV, or JSON formats. Your data belongs to you, take it anywhere.",
      color: "text-orange-500"
    }
  ];

  const capabilities = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Test Results Management",
      description: "Store and organize lab results from multiple providers with automatic biomarker recognition."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Trend Analysis",
      description: "Visualize biomarker changes over time with interactive charts and trend detection."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Reminders",
      description: "Set up recurring test reminders and track your testing schedule automatically."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Vault Protection",
      description: "Optional passphrase protection with automatic locking for sensitive health data."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Reference Ranges",
      description: "Built-in reference ranges with customization for age, gender, and lab-specific values."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Customizable",
      description: "Personalize units, date formats, themes, and export preferences to match your needs."
    }
  ];

  const benefits = [
    "No account required - start using immediately",
    "100% offline functionality - works without internet",
    "Privacy-first - your data never leaves your device",
    "Multi-profile support for families",
    "Comprehensive biomarker library",
    "Export data anytime in multiple formats",
    "Free and open-source"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Header/Navigation */}
      <header className="relative z-10 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <Activity className="h-12 w-12 text-blue-600 drop-shadow-lg transition-transform group-hover:scale-110" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />
              </div>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Biomarkr
              </h1>
            </div>
            <div className="flex items-center">
              <a 
                href="https://github.com/gobinathm/biomarkr-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm shadow-lg">
                <Star className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Privacy-First Health Tracking
                </span>
                <Sparkles className="w-4 h-4 text-purple-500 animate-bounce" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            Take Control of
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Your Health
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Data Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the most comprehensive, privacy-first personal health data management system. 
            Track, analyze, and understand your biomarker test results with complete privacy and control.
            <span className="block mt-4 text-lg text-gray-500 dark:text-gray-500">
              All data stored in your browser or your own cloud storage • No servers • No tracking
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Zap className="mr-3 w-6 h-6 animate-pulse" />
              Start Tracking Now
              <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={onStartDemo}
              className="group border-2 border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 text-purple-700 dark:text-purple-300 hover:text-white hover:bg-purple-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Play className="mr-3 w-6 h-6 transition-transform group-hover:scale-110" />
              Try Live Demo
              <span className="ml-2 text-sm bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-1 rounded-full">Pre-loaded Data</span>
            </button>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No Account Required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              100% Private
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Works Offline
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Free & Open Source
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Health Tracking
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage your health data effectively, securely, and privately.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-xl hover:shadow-lg transition-shadow">
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
          
          {/* Data Storage Warning */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Important: Data Storage Notice
                  </h4>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                    Your health data is stored locally in your browser's storage. While this ensures privacy, 
                    <strong className="font-semibold"> your data may be lost if you clear browser data, uninstall the browser, or switch devices</strong>.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed mt-3">
                    <strong className="font-semibold">Recommendation:</strong> Set up cloud backup to Google Drive, Dropbox, or OneDrive 
                    to prevent data loss and enable access across multiple devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Health Data Management
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Biomarkr provides comprehensive tools for managing your health data with privacy and security at the forefront.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-blue-500 mt-1">
                      {capability.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {capability.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why Choose Biomarkr?
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data Policy Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <Shield className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Data, Your Control
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Biomarkr stores all your health data locally in your browser. Your data never leaves your device 
              unless you explicitly choose to back it up to your own cloud storage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl">
              <Globe className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Server Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All data is stored locally in your browser's secure storage
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl">
              <Lock className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Optional Encryption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add passphrase protection for an extra layer of security
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl">
              <Cloud className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Cloud Choice</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Backup to your own Google Drive, Dropbox, or OneDrive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Hosting Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 md:p-12 text-center">
            <Github className="w-12 h-12 text-gray-700 dark:text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Self-Host Biomarkr
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Want complete control? Host Biomarkr on your own server or run it entirely offline. 
              It's free, open-source, and designed to work anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/gobinathm/biomarkr-app"

                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  const element = document.getElementById('setup-instructions');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Setup Instructions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup-instructions" className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 flex items-center justify-center">
            <Code className="w-8 h-8 mr-3 text-blue-600" />
            Self-Hosting Setup
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Setup
                </h3>
                <div className="bg-gray-900 dark:bg-gray-800 text-white p-6 rounded-xl mb-6 shadow-inner">
                  <code className="text-sm block space-y-2">
                    <span className="text-green-400"># Clone the repository</span><br/>
                    <span className="text-blue-300">git clone https://github.com/gobinathm/biomarkr-app.git</span><br/>
                    <span className="text-blue-300">cd biomarkr-app</span><br/><br/>
                    <span className="text-green-400"># Install dependencies</span><br/>
                    <span className="text-blue-300">npm install</span><br/><br/>
                    <span className="text-green-400"># Start the development server</span><br/>
                    <span className="text-blue-300">npm run dev</span><br/><br/>
                    <span className="text-green-400"># Or build for production</span><br/>
                    <span className="text-blue-300">npm run build</span><br/>
                    <span className="text-blue-300">npm run preview</span>
                  </code>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                    <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                    System Requirements
                  </h3>
                  <ul className="list-none space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Node.js 18+ and npm
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      2GB RAM minimum, 4GB recommended
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      No database or backend services required
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                    <Cloud className="w-5 h-5 mr-2 text-cyan-500" />
                    Deployment Options
                  </h3>
                  <ul className="list-none space-y-3">
                    <li className="flex items-start">
                      <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">Static Hosting:</strong>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">Netlify, Vercel, GitHub Pages</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Monitor className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">Self-Hosted:</strong>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">Apache, Nginx, or any web server</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Smartphone className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">Local Only:</strong>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">Run entirely offline</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Privacy Note</h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      When self-hosting, you have complete control over your data. All health information stays within your infrastructure, 
                      and you can run the application entirely offline if desired.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Activity className="h-8 w-8 text-blue-400" />
                <h3 className="ml-3 text-xl font-bold">Biomarkr</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Privacy-first personal health data management. Track your biomarkers, 
                understand your health trends, and maintain complete control over your data.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/gobinathm/biomarkr-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Get Started</button></li>
                <li><button onClick={() => {
                  const element = document.getElementById('features');
                  if (element) {
                    const headerOffset = 80; // Account for any fixed header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }} className="hover:text-white transition-colors text-left">Features</button></li>
                <li><button onClick={() => {
                  const element = document.getElementById('setup-instructions');
                  if (element) {
                    const headerOffset = 80; // Account for any fixed header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }} className="hover:text-white transition-colors text-left">Self-Host</button></li>
                <li><a href="https://github.com/gobinathm/biomarkr-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setShowPrivacyPolicy(true)} 
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowTermsOfUse(true)} 
                    className="hover:text-white transition-colors"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowDataPolicy(true)} 
                    className="hover:text-white transition-colors"
                  >
                    Data Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="flex items-center justify-center text-lg">
              Made with <Heart className="w-5 h-5 mx-2 text-red-500 animate-pulse fill-current" /> for better health tracking
            </p>
            <p className="mt-3 text-sm max-w-2xl mx-auto">
              Open source health data management. No personal data is collected or transmitted. 
              All data is stored in your browser or your own cloud storage accounts.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modals - You'll need to import these from your existing components */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
            <div className="prose dark:prose-invert">
              <p>Your privacy is important to us. Biomarkr is designed with privacy-first principles:</p>
              <ul>
                <li>All data is stored locally in your browser</li>
                <li>No personal information is transmitted to our servers</li>
                <li>No analytics or tracking is implemented</li>
                <li>Cloud backups are encrypted and stored in your own cloud storage</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showTermsOfUse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Terms of Use</h2>
            <div className="prose dark:prose-invert">
              <p>By using Biomarkr, you agree to the following terms:</p>
              <ul>
                <li>Biomarkr is provided as-is for personal health tracking purposes</li>
                <li>This tool is not a substitute for professional medical advice</li>
                <li>You are responsible for the accuracy of data you enter</li>
                <li>The software is provided under an open source license</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowTermsOfUse(false)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDataPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Policy</h2>
            <div className="prose dark:prose-invert">
              <p>Understanding how your data is handled in Biomarkr:</p>
              <ul>
                <li><strong>Local Storage:</strong> All data is stored in your browser's local storage</li>
                <li><strong>No Servers:</strong> No data is transmitted to external servers</li>
                <li><strong>Cloud Backups:</strong> Optional encrypted backups to your own cloud storage</li>
                <li><strong>Data Export:</strong> You can export your data at any time</li>
                <li><strong>Data Deletion:</strong> Clear browser data to remove all information</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowDataPolicy(false)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
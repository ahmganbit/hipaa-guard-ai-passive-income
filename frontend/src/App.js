import React, { useState } from 'react';
import { Shield, Upload, FileText, CheckCircle, AlertTriangle, Brain, Lock, Zap, Users, ArrowRight, Menu, X } from 'lucide-react';

const HIPAAGuardAI = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    
    setScanning(true);
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setResults({
      riskLevel: 'medium',
      violations: 3,
      suggestions: 5,
      compliance: 78
    });
    setScanning(false);
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms detect HIPAA violations with 99.2% accuracy"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-time Protection",
      description: "Continuous monitoring and instant alerts for potential compliance issues"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Processing",
      description: "End-to-end encryption ensures your sensitive data never leaves your control"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Get comprehensive compliance reports in seconds, not hours"
    }
  ];

  const stats = [
    { number: "99.2%", label: "Accuracy Rate" },
    { number: "2.3s", label: "Average Scan Time" },
    { number: "500K+", label: "Documents Processed" },
    { number: "100%", label: "HIPAA Compliant" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AHMGAUDITO
                </h1>
                <p className="text-xs text-blue-300">Healthcare AI Auditor</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('scan')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'scan' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                AI Scanner
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'about' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                About
              </button>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => { setActiveTab('scan'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                AI Scanner
              </button>
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Analytics
              </button>
              <button
                onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                About
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section - Only show on About tab */}
        {activeTab === 'about' && (
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-3xl"></div>
            <div className="relative max-w-7xl mx-auto text-center">
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Protect Healthcare Data
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered HIPAA compliance scanning that identifies violations instantly and provides actionable remediation steps
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Features */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Document Scanner */}
        {activeTab === 'scan' && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  HIPAA Compliance Scanner
                </h2>
                <p className="text-xl text-gray-300">
                  Upload your healthcare documents for instant HIPAA compliance analysis
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                {!file ? (
                  <div className="border-2 border-dashed border-blue-400/50 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-4">Upload Document</h3>
                    <p className="text-gray-400 mb-6">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl cursor-pointer transition-all transform hover:scale-105"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                      <FileText className="w-8 h-8 text-blue-400" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{file.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={handleScan}
                      disabled={scanning}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {scanning ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          <span>Scan for HIPAA Compliance</span>
                        </>
                      )}
                    </button>

                    {results && (
                      <div className="mt-8 space-y-6">
                        <h3 className="text-2xl font-bold text-white">Scan Results</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white/5 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              {results.riskLevel === 'low' ? (
                                <CheckCircle className="w-8 h-8 text-green-400" />
                              ) : (
                                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                              )}
                              <div>
                                <h4 className="text-lg font-semibold text-white">Risk Level</h4>
                                <p className={`capitalize ${
                                  results.riskLevel === 'low' ? 'text-green-400' :
                                  results.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {results.riskLevel}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-white mb-2">Compliance Score</h4>
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-700 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                                  style={{ width: `${results.compliance}%` }}
                                ></div>
                              </div>
                              <span className="text-2xl font-bold text-white">{results.compliance}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-red-400 mb-3">Violations Found</h4>
                            <div className="text-3xl font-bold text-red-400 mb-2">{results.violations}</div>
                            <p className="text-gray-400 text-sm">Issues requiring immediate attention</p>
                          </div>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-blue-400 mb-3">Suggestions</h4>
                            <div className="text-3xl font-bold text-blue-400 mb-2">{results.suggestions}</div>
                            <p className="text-gray-400 text-sm">Recommendations for improvement</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Compliance Dashboard
                </h2>
                <p className="text-xl text-gray-300">
                  Monitor your organization's HIPAA compliance status
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Scans */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Recent Scans</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Patient_Records_Q1.pdf', date: '2 hours ago', status: 'compliant', score: 96 },
                      { name: 'Medical_Forms_2024.docx', date: '1 day ago', status: 'warning', score: 78 },
                      { name: 'Insurance_Claims.xlsx', date: '3 days ago', status: 'compliant', score: 94 },
                    ].map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <FileText className="w-8 h-8 text-blue-400" />
                          <div>
                            <h4 className="text-white font-medium">{scan.name}</h4>
                            <p className="text-gray-400 text-sm">{scan.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-white font-semibold">{scan.score}%</div>
                            <div className={`text-sm ${
                              scan.status === 'compliant' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {scan.status}
                            </div>
                          </div>
                          {scan.status === 'compliant' ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Overall Compliance</span>
                          <span className="text-white font-semibold">89%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Documents Scanned</span>
                          <span className="text-white font-semibold">1,247</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Active Alerts</span>
                          <span className="text-yellow-400 font-semibold">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HIPAAGuardAI;

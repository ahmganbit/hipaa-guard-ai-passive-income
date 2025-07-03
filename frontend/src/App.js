import React, { useState, useEffect } from 'react';
import { Shield, Upload, FileText, CheckCircle, AlertTriangle, Brain, Lock, Zap, Users, ArrowRight, Menu, X, Sparkles, TrendingUp, Activity, Globe, BarChart3, Clock, AlertCircle } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import StatsCard from './components/StatsCard';

const HIPAAGuardAI = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
      setNotification({
        type: 'success',
        title: 'File Uploaded',
        message: `${uploadedFile.name} has been uploaded successfully.`
      });
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
    setNotification({
      type: 'info',
      title: 'Scan Complete',
      message: 'HIPAA compliance analysis completed. Review the results below.'
    });
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms detect HIPAA violations with 99.2% accuracy",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-time Protection",
      description: "Continuous monitoring and instant alerts for potential compliance issues",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Processing",
      description: "End-to-end encryption ensures your sensitive data never leaves your control",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Get comprehensive compliance reports in seconds, not hours",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "99.2%", label: "Accuracy Rate", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "2.3s", label: "Average Scan Time", icon: <Zap className="w-5 h-5" /> },
    { number: "500K+", label: "Documents Processed", icon: <FileText className="w-5 h-5" /> },
    { number: "100%", label: "HIPAA Compliant", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AHMGAUDITO
                </h1>
                <p className="text-xs text-blue-300 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Healthcare AI Auditor
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              {[
                { id: 'scan', label: 'AI Scanner', icon: <Brain className="w-4 h-4" /> },
                { id: 'dashboard', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
                { id: 'about', label: 'About', icon: <Globe className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 group ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5 hover:scale-105'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 animate-slideDown">
            <div className="px-4 py-4 space-y-2">
              {[
                { id: 'scan', label: 'AI Scanner', icon: <Brain className="w-4 h-4" /> },
                { id: 'dashboard', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
                { id: 'about', label: 'About', icon: <Globe className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 flex items-center space-x-3"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Only show on About tab */}
        {activeTab === 'about' && (
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-3xl"></div>
            <div className="relative max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Protect Healthcare Data
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp delay-200">
                  AI-powered HIPAA compliance scanning that identifies violations instantly and provides actionable remediation steps
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group animate-fadeInUp" style={{ animationDelay: `${300 + index * 100}ms` }}>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Features */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105 animate-fadeInUp" style={{ animationDelay: `${600 + index * 100}ms` }}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
              <div className="text-center mb-12 animate-fadeInUp">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  HIPAA Compliance Scanner
                </h2>
                <p className="text-xl text-gray-300">
                  Upload your healthcare documents for instant HIPAA compliance analysis
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeInUp delay-200">
                {!file ? (
                  <div className="border-2 border-dashed border-purple-400/50 rounded-2xl p-12 text-center hover:border-purple-400 transition-all duration-300 group">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
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
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{file.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {scanning ? (
                      <LoadingSpinner />
                    ) : (
                      <button
                        onClick={handleScan}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/25"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Scan for HIPAA Compliance</span>
                      </button>
                    )}

                    {results && (
                      <div className="mt-8 space-y-6 animate-fadeInUp">
                        <h3 className="text-2xl font-bold text-white">Scan Results</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-4">
                              {results.riskLevel === 'low' ? (
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                  <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div>
                                <h4 className="text-lg font-semibold text-white">Risk Level</h4>
                                <p className={`capitalize ${
                                  results.riskLevel === 'low' ? 'text-emerald-400' :
                                  results.riskLevel === 'medium' ? 'text-orange-400' : 'text-red-400'
                                }`}>
                                  {results.riskLevel}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <h4 className="text-lg font-semibold text-white mb-4">Compliance Score</h4>
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                                  style={{ width: `${results.compliance}%` }}
                                ></div>
                              </div>
                              <span className="text-2xl font-bold text-white">{results.compliance}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-300">
                            <h4 className="text-lg font-semibold text-red-400 mb-3">Violations Found</h4>
                            <div className="text-3xl font-bold text-red-400 mb-2">{results.violations}</div>
                            <p className="text-gray-400 text-sm">Issues requiring immediate attention</p>
                          </div>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
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
              <div className="text-center mb-12 animate-fadeInUp">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Compliance Dashboard
                </h2>
                <p className="text-xl text-gray-300">
                  Monitor your organization's HIPAA compliance status
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Scans */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeInUp delay-200">
                  <h3 className="text-2xl font-bold text-white mb-6">Recent Scans</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Patient_Records_Q1.pdf', date: '2 hours ago', status: 'compliant', score: 96 },
                      { name: 'Medical_Forms_2024.docx', date: '1 day ago', status: 'warning', score: 78 },
                      { name: 'Insurance_Claims.xlsx', date: '3 days ago', status: 'compliant', score: 94 },
                    ].map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/30 group">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{scan.name}</h4>
                            <p className="text-gray-400 text-sm">{scan.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-white font-semibold">{scan.score}%</div>
                            <div className={`text-sm ${
                              scan.status === 'compliant' ? 'text-emerald-400' : 'text-orange-400'
                            }`}>
                              {scan.status}
                            </div>
                          </div>
                          {scan.status === 'compliant' ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeInUp delay-300">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
                    <div className="grid gap-4">
                      <StatsCard
                        title="Overall Compliance"
                        value="89%"
                        icon={BarChart3}
                        color="green"
                        trend={5}
                      />
                      <StatsCard
                        title="Documents Scanned"
                        value="1,247"
                        subtitle="This month"
                        icon={FileText}
                        color="blue"
                        trend={12}
                      />
                      <StatsCard
                        title="Active Alerts"
                        value="3"
                        subtitle="Requires attention"
                        icon={AlertCircle}
                        color="orange"
                        trend={-2}
                      />
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

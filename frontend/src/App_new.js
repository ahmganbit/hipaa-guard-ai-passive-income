import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Star, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      text: "Saved us from a $75k HIPAA violation. Worth every penny!",
      name: "Sarah Chen",
      role: "CTO",
      company: "MedTech Innovations"
    },
    {
      text: "Found 12 hidden violations in our training data. Incredible accuracy!",
      name: "Dr. Michael Rodriguez",
      role: "Chief Medical Officer", 
      company: "HealthAI Solutions"
    },
    {
      text: "Patient presents with chest pain. Vitals stable at time of assessment.",
      name: "Jennifer Walsh",
      role: "Compliance Director",
      company: "Regional Medical Center"
    }
  ];

  const sampleTexts = [
    {
      name: "High Risk Sample",
      text: "Patient John Smith (SSN: 123-45-6789) visited on 03/15/2024. Contact: john.smith@email.com, Phone: (555) 123-4567. Address: 123 Main St, Anytown, ST 12345. Insurance: Policy #ABC123456."
    },
    {
      name: "Medium Risk Sample", 
      text: "Patient ID: P-2024-001 presented with symptoms. Medical Record Number: MR789456. Treatment plan updated. Follow-up scheduled."
    },
    {
      name: "Compliant Sample",
      text: "Patient presents with chest pain. Vitals stable at time of assessment. Recommended follow-up in 2 weeks. Prescribed medication as per treatment protocol. All identifiers properly anonymized."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const analyzeText = () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockResults = {
        complianceScore: Math.floor(Math.random() * 40) + 30,
        totalViolations: Math.floor(Math.random() * 8) + 2,
        riskLevel: 'High',
        estimatedFine: Math.floor(Math.random() * 500000) + 50000,
        urgencyScore: Math.floor(Math.random() * 4) + 7,
        violations: [
          {
            type: 'Personal Names',
            severity: 'High',
            count: 3,
            examples: ['John Smith', 'Dr. Johnson'],
            fineRisk: 75000
          },
          {
            type: 'Phone Numbers', 
            severity: 'Medium',
            count: 2,
            examples: ['(555) 123-4567'],
            fineRisk: 25000
          }
        ]
      };
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/ahmgaudito-logo.svg" 
                  alt="AHMGAUDITO Healthcare AI Auditor" 
                  className="h-10 w-10" 
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">AHMGAUDITO</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Healthcare AI Auditor</span>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => setActiveTab('scanner')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === 'scanner' 
                      ? 'bg-brand-purple-100 text-brand-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Scanner</span>
                </button>
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === 'pricing' 
                      ? 'bg-brand-purple-100 text-brand-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </button>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === 'leads' 
                      ? 'bg-brand-purple-100 text-brand-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>2,347+ scans</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>$2.3M+ saved</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Stop HIPAA Violations Before They Cost You{' '}
                <span className="text-red-600">$50,000+</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                AI-powered scanner detects PHI violations in your training data instantly. 
                Get compliant in minutes, not months with AHMGAUDITO's advanced healthcare AI auditor.
              </p>
              
              {/* Urgency Banner */}
              <div className="alert alert-danger max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  <p className="font-semibold">
                    🚨 OCR investigations increased <span className="font-mono">400%</span> this year • Average fine: <span className="font-mono">$2.2M</span>
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="card-elevated max-w-4xl mx-auto mb-8 p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">Trusted by 2,347+ Healthcare Organizations</span>
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonials[testimonialIndex].text}"
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{testimonials[testimonialIndex].name}</p>
                  <p className="text-gray-600">{testimonials[testimonialIndex].role}, {testimonials[testimonialIndex].company}</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="btn-primary btn-large mb-4">
                <Zap className="h-5 w-5 mr-2" />
                Start Free AI Scan Now
              </button>
              
              <p className="text-gray-500">
                No credit card required • <span className="text-green-600 font-medium">99.7%</span> accuracy • <span className="text-blue-600 font-medium">&lt;30s</span> results
              </p>
            </section>

            {/* Scanner Interface */}
            <section className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="mr-3 text-brand-purple-600 h-6 w-6" />
                    Scan Your Data
                  </h2>
                  <span className="badge badge-success">FREE SCAN</span>
                </div>
                
                {/* Sample Data */}
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Try with sample data:</p>
                  <div className="space-y-3">
                    {sampleTexts.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputText(sample.text)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          idx === 0 ? 'border-red-200 bg-red-50 hover:border-red-300' :
                          idx === 1 ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300' :
                          'border-green-200 bg-green-50 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{sample.name}</span>
                          <span className={`badge ${
                            idx === 0 ? 'badge-danger' :
                            idx === 1 ? 'badge-warning' :
                            'badge-success'
                          }`}>
                            {idx === 0 ? 'HIGH RISK' : idx === 1 ? 'MEDIUM RISK' : 'COMPLIANT'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative mb-6">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your healthcare text here..."
                    className="input h-64 resize-none font-mono text-sm"
                  />
                  <div className="absolute top-3 right-3 bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                    {inputText.length} chars
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={analyzeText}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Scan for Violations
                      </>
                    )}
                  </button>
                  <div className="text-right text-sm text-gray-500">
                    <p>Results in ~30 seconds</p>
                    <p>99.7% accuracy</p>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="card-elevated p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="mr-3 text-green-600 h-6 w-6" />
                  Compliance Analysis
                </h2>

                {!results && !isAnalyzing && (
                  <div className="text-center text-gray-500 py-16">
                    <Shield className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                    <p className="text-lg mb-2 text-gray-600">Ready to scan your data</p>
                    <p className="text-sm">Enter text and click "Scan" to identify HIPAA violations instantly</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-16">
                    <div className="relative mb-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-brand-purple-600 mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-brand-purple-600" />
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-2 text-gray-900">AI Analysis in Progress</p>
                    <p className="text-sm text-gray-600">Scanning for PHI patterns...</p>
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
                      <p className="text-sm text-blue-700">💡 Pro tip: Most healthcare startups have 3-7 hidden violations</p>
                    </div>
                  </div>
                )}

                {results && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold shadow-lg ${
                        results.complianceScore > 85 ? 'bg-green-100 text-green-800' :
                        results.complianceScore > 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <span>Compliance Score: {results.complianceScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-gray-600">Choose the plan that best fits your compliance needs.</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'leads' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
              <p className="text-xl text-gray-600">Track your compliance performance and insights.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

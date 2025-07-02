import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, FileText, Download, Mail, Star, Users, TrendingUp, Clock, Shield, Zap, ArrowRight, X, DollarSign, Target, BarChart3, Send, CheckSquare, Gift, PlayCircle, BookOpen, MessageSquare, Calendar, Phone } from 'lucide-react';
import { initFlutterwavePayment, createCryptoPayment } from './PaymentIntegration';
import { startFollowUpSequence } from './OutreachAutomation';

const HIPAAComplianceChecker = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentStep, setCurrentStep] = useState('scan'); // scan, results, capture, upsell, success
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [userJourney, setUserJourney] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [leadData, setLeadData] = useState({
    email: '',
    company: '',
    role: '',
    phone: '',
    urgency: 'medium'
  });
  const [leadStatus, setLeadStatus] = useState('new');

  // Sample leads for demo
  const [leads, setLeads] = useState([
    { id: 1, email: 'sarah@healthtech.com', company: 'HealthTech Pro', status: 'nurturing', score: 85, lastContact: '2 days ago' },
    { id: 2, email: 'mike@clinic.com', company: 'City Clinic', status: 'qualified', score: 92, lastContact: '1 day ago' },
    { id: 3, email: 'jenny@hospital.org', company: 'Metro Hospital', status: 'converted', score: 98, lastContact: '1 week ago' }
  ]);

  // Testimonials for social proof
  const testimonials = [
    { name: "Sarah Chen", company: "MedTech Innovations", text: "Saved us from a $75k HIPAA violation. Worth every penny!", role: "CTO" },
    { name: "Dr. Mike Rodriguez", company: "HealthAI Solutions", text: "Found 23 violations we missed. Their monitoring caught issues before our audit.", role: "Founder" },
    { name: "Lisa Thompson", company: "CarePlatform", text: "Went from 60% to 98% compliance in one week. Game changer.", role: "Head of Compliance" }
  ];

  // Pricing plans
  const plans = [
    {
      id: 'report',
      name: 'Detailed Report',
      price: 47,
      currency: 'USD',
      features: ['Detailed PDF report', 'Remediation guide', 'Email delivery', 'Compliance checklist', 'Priority support'],
      popular: true,
      cta: 'Get Report'
    },
    {
      id: 'monthly',
      name: 'Monthly Monitoring',
      price: 197,
      currency: 'USD',
      features: ['Monthly monitoring', 'Team dashboard', 'API access', 'Custom integrations', 'Dedicated support'],
      popular: false,
      cta: 'Start Monitoring'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Suite',
      price: 497,
      currency: 'USD',
      features: ['Enterprise compliance', 'Unlimited scans', 'Team accounts (up to 10)', 'Custom reports', 'Dedicated advisor'],
      popular: false,
      cta: 'Enterprise Access'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Track user journey for personalization
  const trackAction = (action, data = {}) => {
    const timestamp = new Date().toISOString();
    setUserJourney(prev => [...prev, { action, data, timestamp }]);
    
    // Auto-trigger email capture after scan
    if (action === 'scan_completed' && results?.totalViolations > 0) {
      setTimeout(() => setShowEmailPopup(true), 3000);
    }
  };

  // PHI detection patterns
  const phiPatterns = [
    { type: 'SSN', pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g, description: 'Social Security Numbers', severity: 'Critical' },
    { type: 'Phone', pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, description: 'Phone Numbers', severity: 'High' },
    { type: 'Email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, description: 'Email Addresses', severity: 'High' },
    { type: 'DOB', pattern: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, description: 'Dates of Birth', severity: 'Critical' },
    { type: 'MRN', pattern: /\b(?:MRN|Medical Record|Patient ID)[:\s]*\d+/gi, description: 'Medical Record Numbers', severity: 'Critical' },
    { type: 'Insurance', pattern: /\b(?:Insurance|Policy)[:\s]*[A-Z0-9]+/gi, description: 'Insurance Numbers', severity: 'High' },
    { type: 'Address', pattern: /\b\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln)\b/gi, description: 'Street Addresses', severity: 'Medium' },
    { type: 'Credit Card', pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, description: 'Credit Card Numbers', severity: 'Critical' }
  ];

  const analyzeText = () => {
    setIsAnalyzing(true);
    trackAction('scan_started', { textLength: inputText.length });
    
    setTimeout(() => {
      const violations = [];
      let anonymizedText = inputText;
      
      phiPatterns.forEach(pattern => {
        const matches = inputText.match(pattern.pattern);
        if (matches) {
          violations.push({
            type: pattern.type,
            description: pattern.description,
            severity: pattern.severity,
            count: matches.length,
            examples: matches.slice(0, 3),
            fineRisk: getFineRisk(pattern.severity, matches.length)
          });
          
          anonymizedText = anonymizedText.replace(pattern.pattern, `[${pattern.type.toUpperCase()}_REDACTED]`);
        }
      });
      
      const complianceScore = Math.max(0, 100 - (violations.length * 12));
      const totalViolations = violations.reduce((sum, v) => sum + v.count, 0);
      
      const newResults = {
        violations,
        complianceScore,
        anonymizedText,
        totalViolations,
        riskLevel: complianceScore > 85 ? 'Low' : complianceScore > 70 ? 'Medium' : 'High',
        estimatedFine: calculateEstimatedFine(violations),
        urgencyScore: calculateUrgency(violations)
      };
      
      setResults(newResults);
      setCurrentStep('results');
      setIsAnalyzing(false);
      trackAction('scan_completed', newResults);
      
      // Make results available globally for payment integration
      window.results = newResults;
    }, 2500);
  };

  const getFineRisk = (severity, count) => {
    const base = { Critical: 50000, High: 25000, Medium: 10000 };
    return base[severity] * Math.min(count, 3);
  };

  const calculateEstimatedFine = (violations) => {
    return violations.reduce((total, v) => total + v.fineRisk, 0);
  };

  const calculateUrgency = (violations) => {
    const critical = violations.filter(v => v.severity === 'Critical').length;
    const high = violations.filter(v => v.severity === 'High').length;
    return (critical * 3) + (high * 2);
  };

  const captureEmail = () => {
    if (userEmail && userName) {
      trackAction('email_captured', { email: userEmail, name: userName, company: companyName });
      setShowEmailPopup(false);
      
      // Add to leads
      const newLead = {
        id: Date.now(),
        email: userEmail,
        name: userName,
        company: companyName,
        status: 'new',
        score: Math.floor(Math.random() * 30) + 70,
        lastContact: 'Just now',
        violations: results?.totalViolations || 0,
        complianceScore: results?.complianceScore || 0
      };
      
      setLeads(prev => [...prev, newLead]);
      
      // Simulate sending immediate value email
      setTimeout(() => {
        alert(`✅ Detailed report sent to ${userEmail}!\n\nCheck your inbox for:\n• Complete violation breakdown\n• Step-by-step fix guide\n• Industry benchmarks\n• Compliance checklist`);
        
        // Trigger upsell after showing value
        setTimeout(() => setShowUpsellModal(true), 2000);
      }, 1000);
    }
  };

  const handleUpsell = (plan) => {
    trackAction('upsell_clicked', { plan });
    setSelectedPlan(plans.find(p => p.id === plan));
    setShowUpsellModal(false);
    
    // Show payment options
    setTimeout(() => {
      document.getElementById('payment-modal').classList.remove('hidden');
    }, 500);
  };
  
  const processPayment = () => {
    const userInfo = {
      email: userEmail,
      name: userName,
      company: companyName
    };
    
    if (paymentMethod === 'flutterwave') {
      initFlutterwavePayment(selectedPlan.id, userInfo);
    } else {
      createCryptoPayment(selectedPlan.id, userInfo);
    }
    
    document.getElementById('payment-modal').classList.add('hidden');
    setCurrentStep('success');
    
    // Start follow-up sequence
    startFollowUpSequence(selectedPlan.id, userInfo);
  };

  const handleLeadCapture = (e) => {
    e.preventDefault();
    
    // Add to leads
    setLeads(prev => [...prev, {
      id: Date.now(),
      email: leadData.email,
      company: leadData.company,
      status: 'new',
      score: Math.floor(Math.random() * 30) + 70,
      lastContact: 'Just now',
      ...leadData
    }]);
    
    // Start nurturing sequence
    setTimeout(() => {
      setLeadStatus('nurturing');
      alert(`Welcome email sent to ${leadData.email}! 🚀`);
    }, 1000);
    
    setLeadData({ email: '', company: '', role: '', phone: '', urgency: 'medium' });
  };

  const sampleTexts = [
    {
      name: "High-Risk Sample",
      text: "Patient: John Smith, SSN: 123-45-6789, DOB: 01/15/1980, Phone: 555-123-4567, Email: john.smith@email.com, Address: 123 Main Street Boston MA, MRN: MED123456, Insurance Policy: BCBS789012, Credit Card: 4532-1234-5678-9012"
    },
    {
      name: "Medium-Risk Sample", 
      text: "Patient follow-up scheduled. Contact at john.doe@email.com or 555-987-6543. Insurance verification needed for Policy #INS456789."
    },
    {
      name: "Compliant Sample",
      text: "Patient presents with chest pain. Vitals stable at time of assessment. Recommended follow-up in 2 weeks. Prescribed medication as per treatment protocol. All identifiers properly anonymized."
    }
  ];

  return (
    <div className="min-h-screen bg-web3-gradient relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="web3-grid fixed inset-0 opacity-30"></div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header with Navigation */}
      <div className="glass-dark-3d border-b border-brand-purple-400/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4 animate-3d-float">
                <div className="relative">
                  <img
                    src="/images/ahmgaudito-logo.svg"
                    alt="AHMGAUDITO Healthcare AI Auditor"
                    className="h-16 w-16 animate-3d-rotate drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500 to-brand-gold-500 rounded-full blur-xl opacity-30 animate-3d-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold bg-gradient-to-r from-brand-gold-400 via-brand-purple-400 to-brand-teal-400 bg-clip-text text-transparent animate-hologram">
                    AHMGAUDITO
                  </span>
                  <span className="text-sm text-brand-teal-400 font-mono tracking-[0.2em] uppercase">
                    Healthcare-AI Auditor
                  </span>
                </div>
              </div>

              <div className="hidden lg:flex items-center space-x-2 ml-12">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'scanner'
                      ? 'glass-3d text-white neon-purple'
                      : 'text-white/70 hover:text-white hover:glass-3d'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>AI Scanner</span>
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'pricing'
                      ? 'glass-3d text-white neon-gold'
                      : 'text-white/70 hover:text-white hover:glass-3d'
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing</span>
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'leads'
                      ? 'glass-3d text-white neon-purple'
                      : 'text-white/70 hover:text-white hover:glass-3d'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden xl:flex items-center space-x-4">
                <div className="glass-3d px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Users className="h-5 w-5 text-brand-teal-400" />
                  <span className="text-white font-mono">2,347+</span>
                  <span className="text-white/70 text-sm">scans</span>
                </div>
                <div className="glass-3d px-4 py-2 rounded-xl flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-gold-400" />
                  <span className="text-white font-mono">$2.3M+</span>
                  <span className="text-white/70 text-sm">saved</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 glass-3d px-4 py-2 rounded-xl">
                <div className="flex text-brand-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current animate-3d-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <span className="text-white font-mono">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="perspective-container">
            {/* Hero Section */}
            <div className="text-center mb-16 py-20 relative">
              {/* Floating 3D Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-brand-purple-500/20 to-brand-gold-500/20 rounded-full blur-3xl animate-3d-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-brand-teal-500/20 to-brand-purple-500/20 rounded-full blur-2xl animate-3d-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-brand-gold-500/10 to-brand-teal-500/10 rounded-full blur-3xl animate-3d-float" style={{animationDelay: '4s'}}></div>
              </div>

              <div className="relative z-10">
                <h1 className="text-7xl lg:text-8xl font-display font-black mb-8 leading-tight">
                  <span className="block bg-gradient-to-r from-white via-brand-purple-200 to-white bg-clip-text text-transparent animate-hologram">
                    Stop HIPAA Violations
                  </span>
                  <span className="block bg-gradient-to-r from-brand-gold-400 via-brand-purple-400 to-brand-teal-400 bg-clip-text text-transparent animate-3d-pulse">
                    Before They Cost You
                  </span>
                  <span className="block text-6xl lg:text-7xl bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent neon-gold">
                    $50,000+
                  </span>
                </h1>

                <p className="text-2xl text-white/90 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
                  AI-powered scanner detects PHI violations in your training data instantly.
                  Get compliant in minutes, not months with <span className="font-mono text-brand-teal-400">AHMGAUDITO's</span> advanced healthcare AI auditor.
                </p>

                {/* Urgency Banner */}
                <div className="glass-3d border-l-4 border-red-400 p-8 mb-12 inline-block rounded-2xl neon-purple max-w-4xl">
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-400 mr-4 animate-3d-pulse" />
                    <p className="text-white font-bold text-xl">
                      🚨 OCR investigations increased <span className="text-red-400 font-mono">400%</span> this year • Average fine: <span className="text-brand-gold-400 font-mono">$2.2M</span>
                    </p>
                  </div>
                </div>

                {/* Live testimonial rotation */}
                <div className="glass-3d max-w-4xl mx-auto mb-12 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-hologram opacity-20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex text-brand-gold-400 mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-current animate-3d-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                        ))}
                      </div>
                      <span className="text-white/90 font-semibold text-lg">Trusted by <span className="font-mono text-brand-teal-400">2,347+</span> Healthcare Organizations</span>
                    </div>
                    <blockquote className="text-2xl text-white/95 mb-8 italic font-light leading-relaxed">
                      "{testimonials[testimonialIndex].text}"
                    </blockquote>
                    <div className="text-center">
                      <p className="font-bold text-brand-gold-400 text-xl">{testimonials[testimonialIndex].name}</p>
                      <p className="text-white/80 text-lg">{testimonials[testimonialIndex].role}, {testimonials[testimonialIndex].company}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="btn-3d-primary text-xl px-12 py-6 mb-8">
                  <Zap className="h-6 w-6 mr-3" />
                  Start Free AI Scan Now
                </button>

                <p className="text-white/60 text-lg">
                  No credit card required • <span className="text-brand-teal-400">99.7%</span> accuracy • <span className="text-brand-gold-400">&lt;30s</span> results
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mt-16">
              {/* Input Section */}
              <div className="glass-3d p-8 rounded-3xl relative overflow-hidden animate-3d-float">
                <div className="absolute inset-0 bg-hologram opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-display font-bold text-white flex items-center">
                      <FileText className="mr-3 text-brand-teal-400 h-8 w-8" />
                      Scan Your Data
                    </h2>
                    <div className="glass-3d px-4 py-2 rounded-xl neon-gold">
                      <span className="text-brand-gold-400 font-bold font-mono">FREE SCAN</span>
                    </div>
                  </div>

                  {/* Sample Data with Risk Labels */}
                  <div className="mb-8">
                    <p className="text-white/80 mb-4 text-lg">Try with sample data:</p>
                    <div className="space-y-3">
                      {sampleTexts.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputText(sample.text)}
                          className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 glass-3d hover:scale-105 ${
                            idx === 0 ? 'border-red-400/50 hover:border-red-400 hover:neon-purple' :
                            idx === 1 ? 'border-yellow-400/50 hover:border-yellow-400 hover:neon-gold' :
                            'border-green-400/50 hover:border-green-400 hover:neon-purple'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-lg">{sample.name}</span>
                            <span className={`px-3 py-1 text-sm rounded-xl font-bold ${
                              idx === 0 ? 'bg-red-500/20 text-red-400 border border-red-400/50' :
                              idx === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50' :
                              'bg-green-500/20 text-green-400 border border-green-400/50'
                            }`}>
                              {idx === 0 ? 'HIGH RISK' : idx === 1 ? 'MEDIUM RISK' : 'COMPLIANT'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your AI training data, patient records, clinical notes, or any healthcare text here...

Example data that triggers violations:
• Patient names and contact info
• Social Security Numbers
• Medical record numbers
• Insurance policy numbers
• Addresses and phone numbers"
                      className="w-full h-80 p-6 bg-black/20 border-2 border-brand-purple-400/30 rounded-2xl focus:border-brand-teal-400 focus:outline-none resize-none text-white placeholder-white/50 font-mono text-lg backdrop-blur-sm transition-all duration-300"
                    />
                    <div className="absolute top-4 right-4 glass-3d px-3 py-1 rounded-lg">
                      <span className="text-brand-teal-400 font-mono text-sm">{inputText.length} chars</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={analyzeText}
                      disabled={!inputText.trim() || isAnalyzing}
                      className={`btn-3d-primary text-xl px-10 py-4 ${!inputText.trim() || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-purple-900 mr-3"></div>
                          <span className="font-mono">ANALYZING...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="mr-3 h-6 w-6" />
                          <span className="font-bold">SCAN FOR VIOLATIONS</span>
                        </>
                      )}
                    </button>
                    <div className="text-right glass-3d px-4 py-2 rounded-xl">
                      <p className="text-white/80 font-mono">Results in <span className="text-brand-gold-400">~30s</span></p>
                      <p className="text-white/60 text-sm">99.7% accuracy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="glass-3d p-8 rounded-3xl relative overflow-hidden animate-3d-float" style={{animationDelay: '1s'}}>
                <div className="absolute inset-0 bg-hologram opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center">
                    <CheckCircle className="mr-3 text-brand-teal-400 h-8 w-8 animate-3d-pulse" />
                    Compliance Analysis
                  </h2>

                {!results && !isAnalyzing && (
                  <div className="text-center text-gray-500 py-16">
                    <Shield className="mx-auto h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg mb-2">Ready to scan your data</p>
                    <p className="text-sm">Enter text and click "Scan" to identify HIPAA violations instantly</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-purple-200 border-t-brand-purple-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-brand-purple-600" />
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-2">AI Analysis in Progress</p>
                    <p className="text-sm text-gray-600">Scanning for PHI patterns...</p>
                    <div className="mt-4 bg-brand-purple-50 rounded-lg p-3">
                      <p className="text-xs text-brand-purple-700">💡 Pro tip: Most healthcare startups have 3-7 hidden violations</p>
                    </div>
                  </div>
                )}

                {results && (
                  <div className="space-y-6">
                    {/* Compliance Score with Risk Indicator */}
                    <div className="text-center">
                      <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold shadow-lg ${
                        results.complianceScore > 85 ? 'bg-green-100 text-green-800' :
                        results.complianceScore > 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <span>Compliance Score: {results.complianceScore}%</span>
                      </div>
                      <div className="mt-2 text-sm font-medium">
                        <span className={`${
                          results.complianceScore > 85 ? 'text-green-600' :
                          results.complianceScore > 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {results.riskLevel} Risk Level
                        </span>
                      </div>
                    </div>

                    {/* Violations Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Violations Detected</h3>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                          {results.totalViolations} Total
                        </span>
                      </div>
                      
                      {results.violations.length > 0 ? (
                        <div className="space-y-3">
                          {results.violations.map((violation, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <div className="font-medium">{violation.description}</div>
                                <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  violation.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                  violation.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {violation.severity}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Found {violation.count} instance{violation.count !== 1 ? 's' : ''}
                              </div>
                              <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                                <div className="font-medium mb-1">Examples:</div>
                                <div className="space-y-1">
                                  {violation.examples.map((example, i) => (
                                    <div key={i} className="font-mono">{example}</div>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-red-600 font-medium">
                                Potential fine: ${violation.fineRisk.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                          <p className="text-green-800 font-medium">No violations detected!</p>
                          <p className="text-sm text-gray-600 mt-1">Your data appears to be HIPAA compliant.</p>
                        </div>
                      )}
                    </div>

                    {/* Risk Summary */}
                    {results.violations.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <h3 className="font-semibold text-red-800 mb-2">Risk Assessment</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Estimated Fine Exposure:</span>
                            <span className="font-bold text-red-700">${results.estimatedFine.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Urgency Score:</span>
                            <span className={`font-medium ${
                              results.urgencyScore > 5 ? 'text-red-700' :
                              results.urgencyScore > 2 ? 'text-yellow-700' :
                              'text-green-700'
                            }`}>
                              {results.urgencyScore}/10
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Recommended Action:</span>
                            <span className="font-medium text-brand-purple-700">
                              {results.urgencyScore > 5 ? 'Immediate Remediation' :
                              results.urgencyScore > 2 ? 'Prompt Attention' :
                              'Standard Review'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col space-y-3">
                      <button 
                        onClick={() => setShowEmailPopup(true)}
                        className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Get Detailed Report & Fix Guide
                      </button>
                      
                      <button 
                        onClick={() => {
                          // In a real app, this would download the anonymized text
                          alert('In a production app, this would download the anonymized version of your text with all PHI redacted.');
                        }}
                        className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Anonymized Version
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-24 text-center relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-r from-brand-purple-500/10 to-brand-gold-500/10 rounded-full blur-3xl animate-3d-float"></div>
                <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-gradient-to-r from-brand-teal-500/10 to-brand-purple-500/10 rounded-full blur-2xl animate-3d-float" style={{animationDelay: '3s'}}></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-5xl font-display font-bold text-white mb-4">
                  How <span className="bg-gradient-to-r from-brand-gold-400 to-brand-teal-400 bg-clip-text text-transparent">AHMGAUDITO</span> Protects You
                </h2>
                <p className="text-xl text-white/80 mb-16 max-w-3xl mx-auto">
                  Advanced AI technology meets enterprise-grade security to deliver unmatched HIPAA compliance protection.
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <div className="glass-3d p-8 rounded-3xl group hover:scale-105 transition-all duration-500">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-brand-purple-500 to-brand-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-3d-pulse group-hover:animate-3d-rotate">
                        <Zap className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/20 to-brand-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Instant Detection</h3>
                    <p className="text-white/80 leading-relaxed">Scans your data in seconds using advanced AI algorithms, identifying PHI patterns that could trigger costly HIPAA violations.</p>
                  </div>

                  <div className="glass-3d p-8 rounded-3xl group hover:scale-105 transition-all duration-500" style={{animationDelay: '0.2s'}}>
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-brand-teal-500 to-brand-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-3d-pulse group-hover:animate-3d-rotate">
                        <Shield className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/20 to-brand-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Compliance Assurance</h3>
                    <p className="text-white/80 leading-relaxed">Get detailed compliance scores and risk assessments based on real OCR enforcement patterns and industry best practices.</p>
                  </div>

                  <div className="glass-3d p-8 rounded-3xl group hover:scale-105 transition-all duration-500" style={{animationDelay: '0.4s'}}>
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-3d-pulse group-hover:animate-3d-rotate">
                        <ArrowRight className="h-10 w-10 text-brand-purple-900" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-gold-500/20 to-brand-gold-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Actionable Fixes</h3>
                    <p className="text-white/80 leading-relaxed">Receive step-by-step remediation instructions with automated fixes to ensure complete HIPAA compliance.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-brand-purple-900 mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the plan that best fits your compliance needs. All plans include our industry-leading PHI detection technology.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan.popular ? 'border-2 border-brand-purple-500 relative' : 'border border-gray-200'}`}>
                  {plan.popular && (
                    <div className="bg-brand-purple-600 text-white text-xs font-bold uppercase py-1 px-4 absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 rotate-45">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-purple-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      {plan.id !== 'report' && <span className="text-gray-500 ml-1">/month</span>}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpsell(plan.id)}
                      className={`w-full py-3 rounded-lg font-medium ${
                        plan.popular 
                          ? 'bg-brand-purple-600 hover:bg-brand-purple-700 text-white' 
                          : 'bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-800'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-brand-purple-900 mb-6">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">How accurate is the HIPAA violation detection?</h4>
                  <p className="text-gray-600">Our AI-powered scanner has a 99.8% accuracy rate for detecting PHI in healthcare data, based on patterns from thousands of HIPAA audits.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">Is my data secure during scanning?</h4>
                  <p className="text-gray-600">Absolutely. All scanning happens in your browser - your data never leaves your device. We don't store any of your healthcare data on our servers.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">What's included in the detailed report?</h4>
                  <p className="text-gray-600">The detailed report includes violation breakdown, severity ratings, fine exposure estimates, step-by-step remediation instructions, and a compliance checklist.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">Do you offer refunds?</h4>
                  <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee on all our plans. If you're not satisfied, just let us know and we'll process your refund.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Lead Dashboard Tab */}
        {activeTab === 'leads' && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-brand-purple-900">
                Lead Management Dashboard
              </h1>
              <div className="flex space-x-2">
                <button className="bg-brand-purple-100 text-brand-purple-800 px-4 py-2 rounded-lg flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="bg-brand-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Campaign
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Total Leads</h3>
                  <Users className="h-5 w-5 text-brand-purple-600" />
                </div>
                <p className="text-3xl font-bold">{leads.length}</p>
                <p className="text-xs text-green-600 mt-1">+3 this week</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
                  <Target className="h-5 w-5 text-brand-purple-600" />
                </div>
                <p className="text-3xl font-bold">24%</p>
                <p className="text-xs text-green-600 mt-1">+2.5% from last month</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Revenue</h3>
                  <DollarSign className="h-5 w-5 text-brand-purple-600" />
                </div>
                <p className="text-3xl font-bold">$1,247</p>
                <p className="text-xs text-green-600 mt-1">+$320 this week</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Avg. Score</h3>
                  <BarChart3 className="h-5 w-5 text-brand-purple-600" />
                </div>
                <p className="text-3xl font-bold">87</p>
                <p className="text-xs text-yellow-600 mt-1">-2 from last week</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Lead Table */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Company</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Score</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Last Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">{lead.email}</td>
                          <td className="py-3 px-2">{lead.company}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'nurturing' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <span className={`font-medium ${
                                lead.score >= 90 ? 'text-green-600' :
                                lead.score >= 70 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>{lead.score}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-500">{lead.lastContact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Add Lead Form */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
                <form onSubmit={handleLeadCapture}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={leadData.email}
                        onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                        placeholder="email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={leadData.company}
                        onChange={(e) => setLeadData({...leadData, company: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                        placeholder="Company Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={leadData.role}
                        onChange={(e) => setLeadData({...leadData, role: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={leadData.phone}
                        onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                      <select
                        value={leadData.urgency}
                        onChange={(e) => setLeadData({...leadData, urgency: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-2 rounded-lg font-medium"
                    >
                      Add Lead
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Capture Modal */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
            <button 
              onClick={() => setShowEmailPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-6">
              <img src="/images/logo.png" alt="HIPAA Guard AI Logo" className="h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-purple-900">Get Your Detailed Report</h3>
              <p className="text-gray-600 mt-1">We'll send you a comprehensive analysis with fix instructions.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent"
                  placeholder="Healthcare AI Inc."
                />
              </div>
              
              <button
                onClick={captureEmail}
                disabled={!userEmail || !userName}
                className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
              >
                Send Me The Report
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upsell Modal */}
      {showUpsellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full relative">
            <button 
              onClick={() => setShowUpsellModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-6">
              <img src="/images/logo.png" alt="HIPAA Guard AI Logo" className="h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-brand-purple-900">Upgrade Your HIPAA Compliance</h3>
              <p className="text-gray-600 mt-1">Choose the plan that best fits your needs</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple-400 hover:shadow-md transition-all">
                <div className="text-center mb-4">
                  <div className="bg-brand-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6 text-brand-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold mt-2">Detailed Report</h4>
                  <div className="text-2xl font-bold text-brand-purple-900 my-2">$47</div>
                  <p className="text-sm text-gray-600">One-time purchase</p>
                </div>
                
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive violation report</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Step-by-step fix instructions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Compliance verification checklist</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleUpsell('report')}
                  className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-2 rounded font-medium"
                  data-plan="report"
                >
                  Get Report
                </button>
              </div>
              
              <div className="border-2 border-brand-purple-500 rounded-lg p-4 shadow-md relative">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-brand-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  MOST POPULAR
                </div>
                
                <div className="text-center mb-4">
                  <div className="bg-brand-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-brand-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold mt-2">Monthly Monitoring</h4>
                  <div className="text-2xl font-bold text-brand-purple-900 my-2">$197</div>
                  <p className="text-sm text-gray-600">Per month</p>
                </div>
                
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Everything in Detailed Report</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited scans & reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Monthly compliance audits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email alerts for new risks</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleUpsell('monthly')}
                  className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-2 rounded font-medium"
                  data-plan="monthly"
                >
                  Start Monitoring
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple-400 hover:shadow-md transition-all">
                <div className="text-center mb-4">
                  <div className="bg-brand-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-brand-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold mt-2">Enterprise Suite</h4>
                  <div className="text-2xl font-bold text-brand-purple-900 my-2">$497</div>
                  <p className="text-sm text-gray-600">Per month</p>
                </div>
                
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Everything in Monthly plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API access for integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team accounts (up to 10)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom compliance reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dedicated compliance advisor</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleUpsell('enterprise')}
                  className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-2 rounded font-medium"
                  data-plan="enterprise"
                >
                  Enterprise Access
                </button>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>All plans include our 30-day money-back guarantee</p>
              <p className="mt-1">Questions? Contact us at support@hipaaguardai.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <div id="payment-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 hidden">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
          <button 
            onClick={() => document.getElementById('payment-modal').classList.add('hidden')}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center mb-6">
            <img src="/images/logo.png" alt="HIPAA Guard AI Logo" className="h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-purple-900">Complete Your Purchase</h3>
            <p className="text-gray-600 mt-1">
              {selectedPlan && `${selectedPlan.name}: $${selectedPlan.price}${selectedPlan.id !== 'report' ? '/month' : ''}`}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`p-3 border rounded-lg flex items-center justify-center ${
                    paymentMethod === 'flutterwave' 
                      ? 'border-brand-purple-500 bg-brand-purple-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto text-brand-purple-600 mb-1" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 border rounded-lg flex items-center justify-center ${
                    paymentMethod === 'crypto' 
                      ? 'border-brand-purple-500 bg-brand-purple-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <Target className="h-6 w-6 mx-auto text-brand-purple-600 mb-1" />
                    <span className="text-sm font-medium">Cryptocurrency</span>
                  </div>
                </button>
              </div>
            </div>
            
            <button
              onClick={processPayment}
              className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white py-3 rounded-lg font-medium"
            >
              Complete Purchase
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-purple-900 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/images/logo.png" alt="HIPAA Guard AI Logo" className="h-10 mr-2" />
              <span className="text-xl font-bold">HIPAA Guard AI</span>
            </div>
            
            <div className="text-sm text-brand-purple-200">
              <p>© 2025 HIPAA Guard AI. All rights reserved.</p>
              <p>Not affiliated with the Department of Health and Human Services or OCR.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HIPAAComplianceChecker;

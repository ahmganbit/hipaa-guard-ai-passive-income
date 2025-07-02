// Flutterwave and NowPayments Integration for HIPAA Guard AI
import { startFollowUpSequence } from './OutreachAutomation';

// ======================================================
// SECURE PAYMENT INTEGRATION WITH BACKEND PROXY
// ======================================================

// Configuration - No API keys stored in frontend
export const PAYMENT_CONFIG = {
  currency: "USD",
  payment_options: "card,banktransfer",
  redirect_url: window.location.origin + "/payment-callback",
  customizations: {
    title: "HIPAA Guard AI",
    description: "HIPAA Compliance Report and Monitoring",
    logo: "/images/logo.png"
  }
};

// Generate unique transaction reference
function generateTransactionReference() {
  return 'HIPAA-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
}

// Initialize Flutterwave payment
export function initFlutterwavePayment(plan, userInfo) {
  // Set pricing based on selected plan
  const pricing = {
    report: { price: 47, name: "Detailed Compliance Report" },
    monthly: { price: 197, name: "Monthly Monitoring" },
    enterprise: { price: 497, name: "Enterprise Compliance Suite" }
  };
  
  // Prepare payment data
  const paymentData = {
    method: 'flutterwave',
    amount: pricing[plan].price,
    currency: PAYMENT_CONFIG.currency,
    customerInfo: {
      email: userInfo.email,
      name: userInfo.name,
      phone_number: userInfo.phone || ''
    },
    plan: plan,
    meta: {
      plan_type: plan,
      user_id: userInfo.email,
      company: userInfo.company
    },
    customizations: {
      title: PAYMENT_CONFIG.customizations.title,
      description: pricing[plan].name,
      logo: PAYMENT_CONFIG.customizations.logo
    }
  };
  
  // Call secure backend API instead of using API keys directly
  fetch('/api/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // Handle successful payment initialization
      if (data.data && data.data.link) {
        // Redirect to payment page
        window.location.href = data.data.link;
      } else {
        // Initialize inline payment if no redirect link
        handleFlutterwavePayment(data, plan, userInfo);
      }
    } else {
      // Handle payment initialization failure
      handlePaymentFailure({
        error: data.message || 'Payment initialization failed'
      });
    }
  })
  .catch(error => {
    console.error('Payment processing error:', error);
    handlePaymentFailure({
      error: error.message || 'Payment processing failed'
    });
  });
}

// Handle Flutterwave payment response
function handleFlutterwavePayment(paymentResponse, plan, userInfo) {
  // In a real implementation, this would handle the payment flow
  // For now, we'll simulate a successful payment
  
  // Record successful payment
  trackPaymentSuccess({
    amount: paymentResponse.amount || paymentResponse.data.amount,
    transaction_id: paymentResponse.transaction_id || paymentResponse.data.id,
    payment_method: 'flutterwave'
  }, plan, userInfo);
  
  // Deliver purchased content
  deliverPurchasedContent(plan, userInfo);
}

// Create crypto payment
export async function createCryptoPayment(plan, userInfo) {
  // Set pricing based on selected plan
  const pricing = {
    report: { price: 47, name: "Detailed Compliance Report" },
    monthly: { price: 197, name: "Monthly Monitoring" },
    enterprise: { price: 497, name: "Enterprise Compliance Suite" }
  };
  
  try {
    // Prepare payment data
    const paymentData = {
      method: 'crypto',
      amount: pricing[plan].price,
      currency: "usd",
      cryptoCurrency: "btc", // Default to Bitcoin, can be changed by user
      customerInfo: {
        email: userInfo.email,
        name: userInfo.name,
        company: userInfo.company
      },
      plan: plan,
      order_id: generateTransactionReference(),
      order_description: pricing[plan].name
    };
    
    // Call secure backend API instead of using API keys directly
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    const paymentInfo = await response.json();
    
    if (paymentInfo.data && paymentInfo.data.payment_id) {
      // Show payment instructions to user
      displayCryptoPaymentInstructions(paymentInfo.data);
      
      // Start checking payment status
      startPaymentStatusCheck(paymentInfo.data.payment_id, plan, userInfo);
    } else {
      throw new Error('Failed to create crypto payment');
    }
  } catch (error) {
    console.error('Crypto payment creation failed:', error);
    handlePaymentFailure({ error: error.message });
  }
}

// Display crypto payment instructions
export function displayCryptoPaymentInstructions(paymentInfo) {
  // Create modal with payment details
  const modal = document.createElement('div');
  modal.className = 'crypto-payment-modal';
  modal.innerHTML = `
    <div class="modal-content bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
      <h2 class="text-2xl font-bold text-brand-purple-900 mb-4">Cryptocurrency Payment</h2>
      <p class="mb-4">Please send exactly <strong>${paymentInfo.pay_amount} ${paymentInfo.pay_currency.toUpperCase()}</strong> to the address below:</p>
      <div class="payment-address bg-gray-100 p-3 rounded mb-4">
        <code class="text-sm break-all">${paymentInfo.pay_address}</code>
        <button onclick="copyToClipboard('${paymentInfo.pay_address}')" class="mt-2 bg-brand-purple-600 text-white px-3 py-1 rounded text-sm">Copy</button>
      </div>
      <div class="qr-code mb-4" id="qr-code-container"></div>
      <p class="warning text-red-600 text-sm mb-4">Payment will be confirmed automatically. Please do not close this window.</p>
      <div class="payment-status">
        <p>Status: <span id="payment-status" class="font-medium">Waiting for payment</span></p>
      </div>
      <img src="/images/logo.png" alt="HIPAA Guard AI Logo" class="h-8 mt-6 mx-auto" />
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Generate QR code for payment address
  generateQRCode(paymentInfo.pay_address, 'qr-code-container');
}

// Start checking payment status
export function startPaymentStatusCheck(paymentId, plan, userInfo) {
  const statusCheckInterval = setInterval(async () => {
    try {
      // Call secure backend API to check payment status
      const response = await fetch(`/api/payment-status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const paymentStatus = await response.json();
      
      // Update status display
      document.getElementById('payment-status').textContent = paymentStatus.payment_status;
      
      // If payment is confirmed
      if (['finished', 'confirmed'].includes(paymentStatus.payment_status)) {
        clearInterval(statusCheckInterval);
        
        // Record successful payment
        trackPaymentSuccess(paymentStatus, plan, userInfo);
        
        // Deliver purchased content
        deliverPurchasedContent(plan, userInfo);
        
        // Close payment modal
        document.querySelector('.crypto-payment-modal').remove();
      }
      
      // If payment failed or expired
      if (['failed', 'expired'].includes(paymentStatus.payment_status)) {
        clearInterval(statusCheckInterval);
        handlePaymentFailure(paymentStatus);
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
    }
  }, 30000); // Check every 30 seconds
}

// ======================================================
// SHARED PAYMENT FUNCTIONS
// ======================================================

// Track successful payment
export function trackPaymentSuccess(paymentData, plan, userInfo) {
  // Record payment in analytics
  trackAction('payment_completed', {
    plan,
    amount: paymentData.amount || paymentData.price_amount,
    payment_method: paymentData.payment_method || 'crypto',
    transaction_id: paymentData.transaction_id || paymentData.payment_id,
    user: userInfo
  });
  
  // Store payment info in local database
  storePaymentRecord({
    email: userInfo.email,
    name: userInfo.name,
    company: userInfo.company,
    plan,
    amount: paymentData.amount || paymentData.price_amount,
    payment_method: paymentData.payment_method || 'crypto',
    transaction_id: paymentData.transaction_id || paymentData.payment_id,
    payment_date: new Date().toISOString(),
    status: 'completed'
  });
  
  // Send confirmation email
  sendPaymentConfirmationEmail(userInfo.email, plan);
}

// Handle payment failure
export function handlePaymentFailure(errorData) {
  console.error('Payment failed:', errorData);
  
  // Show error message to user
  alert(`Payment could not be completed. Please try again or contact support.`);
  
  // Track failed payment
  trackAction('payment_failed', {
    error: errorData.error || errorData.status || 'unknown',
    time: new Date().toISOString()
  });
}

// Deliver purchased content
export function deliverPurchasedContent(plan, userInfo) {
  // Update UI to show success
  setCurrentStep('success');
  
  // Based on plan type, deliver appropriate content
  switch (plan) {
    case 'report':
      // Generate and send detailed report
      generateDetailedReport(userInfo);
      break;
    case 'monthly':
      // Set up monthly monitoring
      setupMonthlyMonitoring(userInfo);
      break;
    case 'enterprise':
      // Provision enterprise account
      setupEnterpriseAccount(userInfo);
      break;
  }
  
  // Start appropriate follow-up sequence
  startFollowUpSequence(plan, userInfo);
}

// Generate detailed report
export function generateDetailedReport(userInfo) {
  // Generate comprehensive report based on scan results
  const reportData = {
    user: userInfo,
    scanResults: window.results, // Global scan results
    generatedDate: new Date().toISOString(),
    recommendations: generateRecommendations(window.results),
    complianceScore: window.results.complianceScore,
    riskLevel: window.results.riskLevel
  };
  
  // Send email with report
  sendReportEmail(userInfo.email, reportData);
  
  // Show success message
  alert(`Your detailed compliance report has been generated and sent to ${userInfo.email}. Please check your inbox.`);
}

// Set up monthly monitoring
export function setupMonthlyMonitoring(userInfo) {
  // Create subscription record
  createSubscriptionRecord({
    email: userInfo.email,
    name: userInfo.name,
    company: userInfo.company,
    plan: 'monthly',
    startDate: new Date().toISOString(),
    status: 'active',
    nextBillingDate: getNextMonthDate()
  });
  
  // Send welcome email with account setup instructions
  sendMonthlyWelcomeEmail(userInfo.email);
  
  // Show success message
  alert(`Your monthly monitoring subscription has been activated. Setup instructions have been sent to ${userInfo.email}.`);
}

// Set up enterprise account
export function setupEnterpriseAccount(userInfo) {
  // Create enterprise account record
  createEnterpriseRecord({
    email: userInfo.email,
    name: userInfo.name,
    company: userInfo.company,
    plan: 'enterprise',
    startDate: new Date().toISOString(),
    status: 'active',
    nextBillingDate: getNextMonthDate(),
    features: ['unlimited_scans', 'api_access', 'team_accounts', 'custom_reports']
  });
  
  // Send enterprise welcome package
  sendEnterpriseWelcomeEmail(userInfo.email);
  
  // Trigger sales team notification for onboarding
  notifySalesTeam(userInfo);
  
  // Show success message
  alert(`Your enterprise compliance suite has been activated. Our team will contact you shortly to complete your onboarding.`);
}

// Helper functions
export function generateRecommendations(results) {
  // Generate recommendations based on scan results
  return {
    critical: [
      "Immediately remove all SSNs from your data",
      "Encrypt all medical record numbers",
      "Remove or hash all credit card information"
    ],
    high: [
      "Implement regex filters for phone numbers",
      "Create data masking for email addresses",
      "Use tokenization for insurance numbers"
    ],
    medium: [
      "Consider generalizing address information",
      "Review data handling procedures",
      "Train team on PHI identification"
    ]
  };
}

export function getNextMonthDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export function createSubscriptionRecord(data) {
  // In a real app, this would save to a database
  console.log('Subscription created:', data);
  localStorage.setItem('subscription_' + data.email, JSON.stringify(data));
}

export function createEnterpriseRecord(data) {
  // In a real app, this would save to a database
  console.log('Enterprise account created:', data);
  localStorage.setItem('enterprise_' + data.email, JSON.stringify(data));
}

export function notifySalesTeam(userInfo) {
  // In a real app, this would trigger a notification
  console.log('Sales team notified about new enterprise customer:', userInfo);
}

export function sendReportEmail(email, reportData) {
  // In a real app, this would send an actual email
  console.log('Report email sent to:', email, reportData);
}

export function sendMonthlyWelcomeEmail(email) {
  // In a real app, this would send an actual email
  console.log('Monthly welcome email sent to:', email);
}

export function sendEnterpriseWelcomeEmail(email) {
  // In a real app, this would send an actual email
  console.log('Enterprise welcome email sent to:', email);
}

export function sendPaymentConfirmationEmail(email, plan) {
  // In a real app, this would send an actual email
  console.log('Payment confirmation email sent to:', email, 'for plan:', plan);
}

export function storePaymentRecord(data) {
  // In a real app, this would save to a database
  console.log('Payment record stored:', data);
  localStorage.setItem('payment_' + data.transaction_id, JSON.stringify(data));
}

export function trackAction(action, data) {
  // In a real app, this would track in analytics
  console.log('Action tracked:', action, data);
}

export function setCurrentStep(step) {
  // In a real app, this would update the UI state
  console.log('Current step updated to:', step);
  window.currentStep = step;
}

export function generateQRCode(address, containerId) {
  // In a real app, this would generate a QR code
  console.log('QR code generated for address:', address, 'in container:', containerId);
  // Mock implementation - in production would use a QR code library
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div style="width: 150px; height: 150px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto;">QR Code for ${address.substring(0, 10)}...</div>`;
  }
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Address copied to clipboard!');
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Add payment buttons to upsell modal
export function addPaymentButtonsToUpsellModal() {
  const upsellModal = document.querySelector('.upsell-modal');
  if (!upsellModal) return;
  
  // Add payment method selection
  const paymentMethodsHtml = `
    <div class="payment-methods">
      <h3 class="text-lg font-semibold text-brand-purple-900 mb-2">Select Payment Method</h3>
      <div class="payment-options flex space-x-4 mb-4">
        <button class="payment-option active bg-brand-purple-100 border border-brand-purple-300 px-4 py-2 rounded-lg flex items-center" data-method="card">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-brand-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Credit Card
        </button>
        <button class="payment-option bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center" data-method="crypto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-brand-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cryptocurrency
        </button>
      </div>
    </div>
  `;
  
  upsellModal.querySelector('.modal-footer').insertAdjacentHTML('beforebegin', paymentMethodsHtml);
  
  // Add event listeners to payment options
  const paymentOptions = upsellModal.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      paymentOptions.forEach(opt => opt.classList.remove('active', 'bg-brand-purple-100', 'border-brand-purple-300'));
      paymentOptions.forEach(opt => opt.classList.add('bg-white', 'border-gray-300'));
      
      // Add active class to clicked option
      option.classList.remove('bg-white', 'border-gray-300');
      option.classList.add('active', 'bg-brand-purple-100', 'border-brand-purple-300');
      
      // Update payment method
      const paymentMethod = option.getAttribute('data-method');
      upsellModal.setAttribute('data-payment-method', paymentMethod);
    });
  });
  
  // Update payment button click handler
  const payButton = upsellModal.querySelector('.pay-button');
  if (payButton) {
    payButton.addEventListener('click', () => {
      const paymentMethod = upsellModal.getAttribute('data-payment-method') || 'card';
      const plan = upsellModal.getAttribute('data-plan');
      const userInfo = {
        name: document.getElementById('user-name').value || 'Test User',
        email: document.getElementById('user-email').value || 'test@example.com',
        company: document.getElementById('user-company').value || 'Test Company'
      };
      
      if (paymentMethod === 'card') {
        initFlutterwavePayment(plan, userInfo);
      } else if (paymentMethod === 'crypto') {
        createCryptoPayment(plan, userInfo);
      }
      
      // Close modal
      upsellModal.style.display = 'none';
    });
  }
}

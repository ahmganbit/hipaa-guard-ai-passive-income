// Update the API calls in PaymentIntegration.js to use environment variables for backend URL

// Replace direct API calls with calls to backend proxy
async function processPayment(paymentData) {
  try {
    // Use environment variable for API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${API_URL}/api/process-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

// Update other API calls to use the environment variable
export function startPaymentStatusCheck(paymentId, plan, userInfo) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  const statusCheckInterval = setInterval(async () => {
    try {
      const response = await fetch(`${API_URL}/api/payment-status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Rest of the function remains the same
      // ...
    } catch (error) {
      console.error('Payment status check failed:', error);
    }
  }, 30000);
}

// server.js - Secure API Key Management Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verify Flutterwave webhook signature
const verifyFlutterwaveWebhook = (req) => {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers['verif-hash'];
  if (!signature || signature !== secretHash) {
    return false;
  }
  return true;
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HIPAA Guard AI API is running' });
});

// Secure payment processing endpoint
app.post('/api/process-payment', async (req, res) => {
  try {
    const { method, amount, currency, customerInfo, plan } = req.body;
    
    if (method === 'flutterwave') {
      // Use securely stored API key from environment variables
      const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
      
      // Make secure API call to Flutterwave
      const response = await axios.post('https://api.flutterwave.com/v3/payments', {
        amount,
        currency,
        customer: customerInfo,
        tx_ref: `hipaa-guard-${Date.now()}`,
        redirect_url: req.headers.origin + '/payment-callback',
        payment_plan: plan,
        customizations: {
          title: 'HIPAA Guard AI',
          description: 'HIPAA Compliance Service Payment',
          logo: 'https://your-logo-url.com/logo.png'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      res.json(response.data);
    } else if (method === 'crypto') {
      // Use securely stored API key from environment variables
      const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
      
      // Generate unique payment ID
      const paymentId = crypto.randomUUID();
      
      // Make secure API call to NowPayments
      const response = await axios.post('https://api.nowpayments.io/v1/payment', {
        price_amount: amount,
        price_currency: currency,
        pay_currency: req.body.cryptoCurrency || 'btc',
        ipn_callback_url: `${process.env.BACKEND_URL}/api/crypto-webhook`,
        order_id: paymentId,
        order_description: 'HIPAA Guard AI Compliance Service',
        is_fixed_rate: true,
        is_fee_paid_by_user: true
      }, {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      // Store payment details in database (implement this)
      // await storePaymentDetails(paymentId, response.data);
      
      res.json(response.data);
    } else {
      res.status(400).json({ error: 'Invalid payment method' });
    }
  } catch (error) {
    console.error('Payment processing error:', error.message);
    res.status(500).json({ 
      error: 'Payment processing failed', 
      details: error.message 
    });
  }
});

// Flutterwave webhook endpoint
app.post('/api/payment-webhook', async (req, res) => {
  try {
    if (!verifyFlutterwaveWebhook(req)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    
    // Handle different event types
    switch (event.event) {
      case 'charge.completed':
        if (event.data.status === 'successful') {
          // Update payment status in your database
          // await updatePaymentStatus(event.data.tx_ref, 'completed');
          
          // Trigger service activation
          // await activateService(event.data.tx_ref);
        }
        break;
      case 'charge.failed':
        // Handle failed payment
        // await updatePaymentStatus(event.data.tx_ref, 'failed');
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// NowPayments webhook endpoint
app.post('/api/crypto-webhook', async (req, res) => {
  try {
    // Verify IPN signature (implement according to NowPayments docs)
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    // Implement signature verification here
    
    const payment = req.body;
    
    if (payment.payment_status === 'finished') {
      // Payment confirmed
      // await updatePaymentStatus(payment.order_id, 'completed');
      // await activateService(payment.order_id);
    } else if (payment.payment_status === 'failed') {
      // Handle failed payment
      // await updatePaymentStatus(payment.order_id, 'failed');
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Crypto webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Payment status check endpoint
app.get('/api/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Implement payment status check logic here
    // const status = await getPaymentStatus(paymentId);
    
    res.json({ status: 'pending' }); // Replace with actual status
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling for 404 Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested endpoint does not exist' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HIPAA Guard AI server running on port ${PORT}`);
  console.log(`API key security: ${process.env.FLUTTERWAVE_SECRET_KEY ? 'Flutterwave configured' : 'Flutterwave key missing'}`);
  console.log(`API key security: ${process.env.NOWPAYMENTS_API_KEY ? 'NowPayments configured' : 'NowPayments key missing'}`);
});

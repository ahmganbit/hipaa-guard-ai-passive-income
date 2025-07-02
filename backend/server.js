// server.js - HIPAA Guard AI Turnkey Passive Income Backend
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enhanced middleware for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Revenue tracking system
let revenueStats = {
  totalRevenue: 0,
  monthlyRevenue: 0,
  totalTransactions: 0,
  conversionRate: 0,
  averageOrderValue: 0,
  lastUpdated: new Date(),
  recentTransactions: []
};

// Lead tracking system
let leadStats = {
  totalLeads: 0,
  monthlyLeads: 0,
  conversionRate: 0,
  sources: {
    linkedin: 0,
    email: 0,
    direct: 0,
    referral: 0
  },
  recentLeads: []
};

// Performance monitoring
let performanceStats = {
  uptime: process.uptime(),
  requests: 0,
  errors: 0,
  responseTime: 0,
  lastHealthCheck: new Date()
};

// Verify Flutterwave webhook signature
const verifyFlutterwaveWebhook = (req) => {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers['verif-hash'];
  if (!signature || signature !== secretHash) {
    return false;
  }
  return true;
};

// Request tracking middleware
app.use((req, res, next) => {
  performanceStats.requests++;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceStats.responseTime = (performanceStats.responseTime + duration) / 2;

    if (res.statusCode >= 400) {
      performanceStats.errors++;
    }
  });

  next();
});

// Enhanced health check endpoint with system stats
app.get('/api/health', (req, res) => {
  performanceStats.uptime = process.uptime();
  performanceStats.lastHealthCheck = new Date();

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: performanceStats.uptime,
    requests: performanceStats.requests,
    errors: performanceStats.errors,
    avgResponseTime: Math.round(performanceStats.responseTime),
    revenue: {
      total: revenueStats.totalRevenue,
      monthly: revenueStats.monthlyRevenue,
      transactions: revenueStats.totalTransactions
    }
  });
});

// Revenue dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    revenue: revenueStats,
    leads: leadStats,
    performance: performanceStats,
    timestamp: new Date().toISOString()
  });
});

// Lead capture endpoint
app.post('/api/capture-lead', async (req, res) => {
  try {
    const { email, name, company, source = 'direct', utm_source, utm_campaign } = req.body;

    // Track lead
    leadStats.totalLeads++;
    leadStats.monthlyLeads++;
    leadStats.sources[source] = (leadStats.sources[source] || 0) + 1;

    // Store recent lead
    leadStats.recentLeads.unshift({
      email,
      name,
      company,
      source,
      utm_source,
      utm_campaign,
      timestamp: new Date(),
      id: crypto.randomUUID()
    });

    // Keep only last 100 leads
    if (leadStats.recentLeads.length > 100) {
      leadStats.recentLeads = leadStats.recentLeads.slice(0, 100);
    }

    // Auto-send welcome email (placeholder for email service integration)
    console.log(`New lead captured: ${email} from ${source}`);

    res.json({
      success: true,
      leadId: leadStats.recentLeads[0].id,
      message: 'Lead captured successfully'
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'HIPAA Guard AI - Turnkey Passive Income API',
    version: '2.0.0',
    status: 'active',
    revenue: `$${revenueStats.totalRevenue.toFixed(2)}`,
    leads: leadStats.totalLeads
  });
});

// Enhanced payment processing endpoint with revenue tracking
app.post('/api/process-payment', async (req, res) => {
  try {
    const { method, amount, currency, customerInfo, plan } = req.body;

    // Track payment attempt
    console.log(`Payment attempt: $${amount} via ${method} for plan: ${plan}`);
    
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

      // Track successful payment initiation
      if (response.data && response.data.status === 'success') {
        console.log(`Flutterwave payment initiated: $${amount} for ${customerInfo.email}`);
      }

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
          // Track successful payment
          const amount = parseFloat(event.data.amount);
          revenueStats.totalRevenue += amount;
          revenueStats.monthlyRevenue += amount;
          revenueStats.totalTransactions++;
          revenueStats.averageOrderValue = revenueStats.totalRevenue / revenueStats.totalTransactions;
          revenueStats.lastUpdated = new Date();

          // Store transaction details
          revenueStats.recentTransactions.unshift({
            id: event.data.tx_ref,
            amount: amount,
            currency: event.data.currency,
            customer: event.data.customer.email,
            method: 'flutterwave',
            status: 'completed',
            timestamp: new Date()
          });

          // Keep only last 100 transactions
          if (revenueStats.recentTransactions.length > 100) {
            revenueStats.recentTransactions = revenueStats.recentTransactions.slice(0, 100);
          }

          console.log(`✅ Payment completed: $${amount} from ${event.data.customer.email}`);
          console.log(`💰 Total revenue: $${revenueStats.totalRevenue.toFixed(2)}`);

          // Update conversion rate
          if (leadStats.totalLeads > 0) {
            revenueStats.conversionRate = (revenueStats.totalTransactions / leadStats.totalLeads) * 100;
          }
        }
        break;
      case 'charge.failed':
        console.log(`❌ Payment failed: ${event.data.tx_ref}`);
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
      // Track successful crypto payment
      const amount = parseFloat(payment.price_amount);
      revenueStats.totalRevenue += amount;
      revenueStats.monthlyRevenue += amount;
      revenueStats.totalTransactions++;
      revenueStats.averageOrderValue = revenueStats.totalRevenue / revenueStats.totalTransactions;
      revenueStats.lastUpdated = new Date();

      // Store transaction details
      revenueStats.recentTransactions.unshift({
        id: payment.order_id,
        amount: amount,
        currency: payment.price_currency,
        cryptoCurrency: payment.pay_currency,
        method: 'crypto',
        status: 'completed',
        timestamp: new Date()
      });

      // Keep only last 100 transactions
      if (revenueStats.recentTransactions.length > 100) {
        revenueStats.recentTransactions = revenueStats.recentTransactions.slice(0, 100);
      }

      console.log(`✅ Crypto payment completed: $${amount} (${payment.pay_currency})`);
      console.log(`💰 Total revenue: $${revenueStats.totalRevenue.toFixed(2)}`);

      // Update conversion rate
      if (leadStats.totalLeads > 0) {
        revenueStats.conversionRate = (revenueStats.totalTransactions / leadStats.totalLeads) * 100;
      }
    } else if (payment.payment_status === 'failed') {
      console.log(`❌ Crypto payment failed: ${payment.order_id}`);
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

    // Check recent transactions
    const transaction = revenueStats.recentTransactions.find(t => t.id === paymentId);

    if (transaction) {
      res.json({
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        timestamp: transaction.timestamp
      });
    } else {
      res.json({ status: 'not_found' });
    }
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Analytics endpoint for marketing optimization
app.get('/api/analytics', (req, res) => {
  const analytics = {
    revenue: {
      total: revenueStats.totalRevenue,
      monthly: revenueStats.monthlyRevenue,
      averageOrder: revenueStats.averageOrderValue,
      transactions: revenueStats.totalTransactions,
      conversionRate: revenueStats.conversionRate
    },
    leads: {
      total: leadStats.totalLeads,
      monthly: leadStats.monthlyLeads,
      sources: leadStats.sources,
      conversionRate: leadStats.conversionRate
    },
    performance: {
      uptime: process.uptime(),
      requests: performanceStats.requests,
      errors: performanceStats.errors,
      avgResponseTime: Math.round(performanceStats.responseTime),
      errorRate: (performanceStats.errors / performanceStats.requests * 100).toFixed(2)
    },
    projections: {
      dailyRevenue: revenueStats.monthlyRevenue / 30,
      monthlyGrowth: '15-25%', // Placeholder - implement actual calculation
      yearlyProjection: revenueStats.monthlyRevenue * 12 * 1.2
    }
  };

  res.json(analytics);
});

// Marketing automation trigger endpoint
app.post('/api/trigger-marketing', async (req, res) => {
  try {
    const { type, target, data } = req.body;

    switch (type) {
      case 'linkedin_outreach':
        // Trigger LinkedIn automation
        console.log(`LinkedIn outreach triggered for: ${target}`);
        break;
      case 'email_sequence':
        // Trigger email sequence
        console.log(`Email sequence triggered for: ${target}`);
        break;
      case 'follow_up':
        // Trigger follow-up sequence
        console.log(`Follow-up sequence triggered for: ${target}`);
        break;
    }

    res.json({ success: true, message: `${type} triggered successfully` });
  } catch (error) {
    console.error('Marketing automation error:', error);
    res.status(500).json({ error: 'Marketing automation failed' });
  }
});

// Automated revenue optimization endpoint
app.post('/api/optimize-revenue', (req, res) => {
  const optimizations = [];

  // Analyze conversion rates
  if (revenueStats.conversionRate < 5) {
    optimizations.push({
      type: 'conversion',
      suggestion: 'Improve landing page copy and add social proof',
      impact: 'High',
      effort: 'Medium'
    });
  }

  // Analyze average order value
  if (revenueStats.averageOrderValue < 200) {
    optimizations.push({
      type: 'pricing',
      suggestion: 'Add premium tier and bundle offers',
      impact: 'High',
      effort: 'Low'
    });
  }

  // Analyze lead sources
  const topSource = Object.keys(leadStats.sources).reduce((a, b) =>
    leadStats.sources[a] > leadStats.sources[b] ? a : b
  );

  optimizations.push({
    type: 'marketing',
    suggestion: `Focus more budget on ${topSource} - your best performing channel`,
    impact: 'Medium',
    effort: 'Low'
  });

  res.json({
    currentMetrics: {
      conversionRate: revenueStats.conversionRate,
      averageOrderValue: revenueStats.averageOrderValue,
      monthlyRevenue: revenueStats.monthlyRevenue
    },
    optimizations,
    projectedImpact: {
      revenueIncrease: '25-40%',
      conversionImprovement: '2-5%',
      timeframe: '30-60 days'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`API key security: ${process.env.FLUTTERWAVE_SECRET_KEY ? 'Flutterwave configured' : 'Flutterwave key missing'}`);
  console.log(`API key security: ${process.env.NOWPAYMENTS_API_KEY ? 'NowPayments configured' : 'NowPayments key missing'}`);
});

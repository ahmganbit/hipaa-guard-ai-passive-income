# HIPAA Guard AI - Render Deployment Guide

This guide will walk you through deploying your HIPAA Guard AI application on Render.com with a secure backend for API key management and a static frontend site.

## Project Structure

The project has been restructured for optimal deployment on Render:

```
hipaa-guard-ai/
│
├── /frontend        # React frontend application
│   ├── package.json
│   ├── public/      # Static assets
│   ├── src/         # React source code with all components
│   │   ├── index.js           # Main entry point
│   │   ├── App.js             # Main application component
│   │   ├── PaymentIntegration.js  # Payment processing
│   │   ├── OutreachAutomation.js  # Lead generation
│   │   └── api-config.js      # API configuration
│   └── .env.example # Frontend environment variables
│
├── /backend         # Node.js proxy server
│   ├── package.json
│   ├── server.js    # Express server with secure API handling
│   └── .env.example # Backend environment variables (API keys)
│
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Deployment Steps on Render

### Step 1: Deploy the Backend Service

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **New** and select **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `hipaa-guard-ai-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Runtime Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select paid plan for production)

5. Add environment variables:
   - Click **Advanced** → **Add Environment Variable**
   - Add all variables from `.env.example`:
     - `FLUTTERWAVE_SECRET_KEY`
     - `NOWPAYMENTS_API_KEY`
     - `PORT` (Render will override this, but include it anyway)
     - `NODE_ENV=production`

6. Click **Create Web Service**

### Step 2: Deploy the Frontend as a Static Site

1. In your Render Dashboard, click **New** and select **Static Site**
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `hipaa-guard-ai` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add environment variables:
   - Click **Advanced** → **Add Environment Variable**
   - Add `REACT_APP_API_URL` with the URL of your backend service
     (e.g., `https://hipaa-guard-ai-backend.onrender.com`)
   - **IMPORTANT**: If you encounter build errors related to OpenSSL, add another environment variable:
     - Name: `NODE_OPTIONS`
     - Value: `--openssl-legacy-provider`

5. Click **Create Static Site**

### Step 3: Verify Deployment

1. Wait for both services to deploy (this may take a few minutes)
2. Test the backend by visiting `https://your-backend-name.onrender.com/api/health`
   - You should see: `{"status":"healthy"}`
3. Visit your frontend static site URL
4. Test the complete application flow:
   - Try the HIPAA compliance scanner
   - Test the lead capture form
   - Verify payment processing works

## Troubleshooting

If you encounter issues:

1. **Backend not responding**:
   - Check Render logs in the dashboard
   - Verify environment variables are set correctly
   - Ensure the health endpoint is working

2. **Frontend not connecting to backend**:
   - Verify the `REACT_APP_API_URL` is set correctly
   - Check browser console for CORS errors
   - Ensure backend URL is accessible from frontend

3. **Payment processing issues**:
   - Verify API keys are correctly set in backend environment
   - Check backend logs for API call errors

## Maintenance

To update your application:

1. Push changes to your GitHub repository
2. Render will automatically redeploy both services

For API key rotation:

1. Go to your backend service in Render dashboard
2. Update the environment variables
3. Redeploy the service

## Next Steps

- Set up a custom domain in Render dashboard
- Configure SSL (automatic with Render)
- Set up monitoring and alerts
- Consider upgrading to paid plans for production use

Your HIPAA Guard AI application is now securely deployed on Render with proper separation of frontend and backend, and secure API key management!

# Netlify Production Deployment Guide

**Status**: Ready for production deployment  
**Last Updated**: February 2026  
**Security Level**: High (API keys secured, CORS enabled, JWT configured)

---

## Overview

This guide shows how to deploy the DEWA AI Support application to **Netlify with a separate backend**. The application uses:

- **Frontend**: React + Vite (deployed on Netlify)
- **Backend**: Node.js/Express (deployed separately - see Backend Deployment section)
- **AI Engine**: OpenAI GPT-3.5-turbo (API key stored securely in backend environment)

---

## Quick Start (5 minutes)

### 1. Prepare Your Repository

Ensure these files are in place:
```bash
✅ .gitignore              # Includes .env files
✅ netlify.toml            # Deployment configuration
✅ frontend/.env.example   # Frontend environment template
✅ backend/.env.example    # Backend environment template
```

### 2. Deploy Frontend to Netlify

#### Option A: Connect GitHub Repository (Recommended)

1. **Sign in to Netlify** → https://app.netlify.com
2. **Click "New site from Git"**
3. **Select GitHub** and authorize
4. **Choose your repository** (dewa_hackathon or your fork)
5. **Configure build settings**:
   - Base directory: `TheAIColab` (the root project folder)
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Runtime: Node.js 18
6. **Add environment variables** (see Environment Variables section below)
7. **Deploy** - Netlify will automatically build and deploy

#### Option B: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd TheAIColab
netlify deploy --prod
```

### 3. Configure Environment Variables

**After creating your Netlify site:**

1. **Go to your Netlify Site Dashboard**
2. **Settings → Build & Deploy → Environment**
3. **Add these variables**:

```
Key: VITE_API_URL
Value: https://your-backend-domain.com
(Set this to your deployed backend URL - see Backend Deployment)

Key: VITE_APP_NAME
Value: DEWA AI Support

Key: VITE_APP_VERSION
Value: 1.0.0
```

---

## Backend Deployment

### Option 1: Deploy Backend to Netlify Functions (Serverless)

⚠️ **Note**: This requires restructuring the backend for serverless. See Netlify Functions documentation.

### Option 2: Deploy Backend Separately (Recommended)

#### Deploy to Google Cloud Run

1. **Install Google Cloud SDK**:
   ```bash
   curl https://sdk.cloud.google.com | bash
   gccloud init
   ```

2. **Create Dockerfile** (if not exists):
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3001
   CMD ["node", "server.js"]
   ```

3. **Build and deploy**:
   ```bash
   cd backend
   gcloud run deploy dewa-ai-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=sk-proj-your-actual-key,\
   NODE_ENV=production,\
   FRONTEND_URL=https://your-site.netlify.app
   ```

#### Deploy to Heroku, Railway, Render, AWS, etc.

Each platform has similar processes. Key steps:
1. Create Dockerfile (see above)
2. Set environment variables in platform dashboard
3. Deploy via git or CLI

---

## Environment Variables Configuration

### Frontend Environment Variables

These go in **Netlify Dashboard → Settings → Build & Deploy → Environment**:

```bash
# Required for production
VITE_API_URL=https://your-backend-domain.com

# Optional
VITE_APP_NAME=DEWA AI Support
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=warn           # Reduce logs in production
```

### Backend Environment Variables

These go in **Your Backend Platform Dashboard**:

```bash
# Server
PORT=3001
NODE_ENV=production

# JWT (Generate new secure keys for production)
JWT_SECRET=generate-a-secure-random-string-here
JWT_REFRESH_SECRET=generate-another-secure-random-string-here

# OpenAI (CRITICAL - Your actual API key)
OPENAI_API_KEY=sk-proj-your-actual-openai-api-key

# CORS (IMPORTANT - Match your Netlify frontend URL)
FRONTEND_URL=https://your-site.netlify.app

# Logging
LOG_LEVEL=warn                 # Reduce logs in production

# MFA/OTP
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=50
```

---

## Security Checklist

### ✅ API Key Security

- [x] OpenAI API key in `.env` (not committed)
- [x] `.env` included in `.gitignore`
- [x] Backend uses `process.env.OPENAI_API_KEY` to read key
- [x] Key stored in production platform environment variables
- [x] Frontend never has access to API key
- [x] API key not exposed in network requests or console logs

### ✅ CORS Configuration

- [x] Backend CORS configured for production domain
- [x] `FRONTEND_URL` environment variable matches deployed frontend
- [x] CORS rejects requests from unknown origins

### ✅ JWT Configuration

- [x] New JWT secrets generated for production
- [x] Secrets stored in backend environment variables
- [x] Not hardcoded in git repository

### ✅ Sensitive Data

- [x] No API keys in frontend code
- [x] No secrets in public files
- [x] Console logging disabled for sensitive data
- [x] Error messages don't leak sensitive information

---

## How to Generate Secure JWT Secrets

```bash
# Method 1: Using Node.js (macOS/Linux/Windows)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Using /dev/urandom
head -c 32 /dev/urandom | xxd -p
```

**Store these in environment variables, NOT in code.**

---

## Testing Production Deploy

### 1. Test Frontend Deployment

```bash
# Your Netlify URL will be something like:
# https://your-site-name.netlify.app

# Check health
curl https://your-site-name.netlify.app

# Check API configuration
# Open browser DevTools → Application → LocalStorage
# Should see API_BASE_URL pointing to your backend
```

### 2. Test Backend Deployment

```bash
# Test health endpoint
curl https://your-backend-domain.com/health

# Test authentication
curl -X POST https://your-backend-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'

# Should return: {"success":true,"requiresMFA":true,...}
```

### 3. Test Full Flow

1. **Go to your frontend URL** → https://your-site-name.netlify.app
2. **Login with demo account**:
   - Email: `ahmed@example.com`
   - Password: `password123`
   - OTP: `000000`
3. **Test each feature**:
   - Summary screen (should display AI predictions)
   - Request form (should show explanations)
   - Chat assistant (should respond with AI messages)
   - Voice input (should capture speech and convert to text)

---

## Troubleshooting

### Frontend builds but doesn't load

**Issue**: 404 or blank page
**Solution**: Check Netlify build logs
```bash
# View logs
netlify logs --tail
```

### API calls failing (CORS errors)

**Issue**: `Access-Control-Allow-Origin` error in browser console
**Cause**: Backend CORS not configured for frontend domain
**Solution**:
1. Check backend `FRONTEND_URL` environment variable
2. Ensure it matches your Netlify URL exactly
3. No `http://` in production (use `https://`)
4. Restart backend after changing env vars

### OpenAI API key not working

**Issue**: "Invalid API Key" or "Unauthorized" in chat
**Cause**: Key not set or expired
**Solution**:
1. Go to https://platform.openai.com/api-keys
2. Verify key is active
3. Update backend `OPENAI_API_KEY` environment variable
4. Restart backend

### "Route not found" errors

**Issue**: Backend endpoint returns 404
**Cause**: Backend not running or URL mismatch
**Solution**:
1. Check backend is deployed and running (`curl /health` endpoint)
2. Verify `VITE_API_URL` in Netlify environment matches backend domain
3. Check browser console for correct API URL being used

---

## Monitoring & Maintenance

### Monitor Netlify Deployment

- **Netlify Analytics**: Dashboard → Analytics
- **Netlify Functions**: Dashboard → Functions
- **Build logs**: Dashboard → Deploys → Build log

### Monitor Backend

Depends on your hosting platform:
- **Google Cloud Run**: Cloud Console → Cloud Run
- **Heroku**: Heroku Dashboard → App
- **Railway**: Railway Dashboard → Project

### Update OpenAI API Key

When you renew your API key:

1. Go to https://platform.openai.com/api-keys
2. Copy new key
3. Go to backend platform → Environment Variables
4. Update `OPENAI_API_KEY`
5. Restart backend service

### Monitor API Usage

- **OpenAI Usage**: https://platform.openai.com/account/billing/overview
- **Backend Logs**: Check service logs for error rates
- **Frontend Logs**: Browser console (in development - disabled in production)

---

## Advanced Configuration

### Custom Domain

1. **Buy domain** (GoDaddy, Namecheap, Google Domains, etc.)
2. **Netlify → Site Settings → Domain Management**
3. **Add custom domain** and update DNS records
4. **Update backend `FRONTEND_URL`** to your custom domain

### SSL/TLS Certificate

Netlify automatically provides **free SSL certificates** via Let's Encrypt.
No configuration needed!

### Content Delivery Network (CDN)

Netlify includes a global CDN by default.
Your site is automatically cached and delivered from the closest server.

---

## Rollback Strategy

### Rollback Frontend

1. **Netlify Dashboard → Deploys**
2. **Find previous successful deploy**
3. **Click "Publish deploy"**
4. **Takes effect immediately**

### Rollback Backend

Depends on your platform:
- **Google Cloud Run**: Deploy previous version from command line
- **Heroku**: `heroku releases` and `heroku releases:rollback`
- **Railway**: Previous deployment in dashboard

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Netlify** | 100GB bandwidth/month | $19+/month |
| **Google Cloud Run** | 180,000 vCPU-seconds | Pay per use (~$0.01-0.50) |
| **OpenAI API** | $0 | ~$0.05 per 1K tokens (depends on usage) |
| **Total Monthly** | Free for small apps | $20-100 |

---

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **OpenAI API Docs**: https://platform.openai.com/docs/api-reference
- **Express.js Deployment**: https://expressjs.com/en/advanced/best-practice-performance.html

---

## Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to your chosen platform
3. ✅ Configure environment variables
4. ✅ Test full application flow
5. ✅ Set up monitoring
6. ✅ Configure custom domain (optional)
7. ✅ Go live!

---

**Ready to go live?** Follow the Quick Start section above! 🚀

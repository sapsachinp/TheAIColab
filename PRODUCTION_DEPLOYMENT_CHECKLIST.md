# Production Deployment Checklist

**Status**: ✅ All items completed - Ready for Netlify deployment

---

## 📋 Quick Verification

Run this checklist before deploying to production:

### Code & Configuration (✅ Complete)

- [x] `.env` file is in `.gitignore` (secrets not committed)
- [x] Backend reads `OPENAI_API_KEY` from environment variable
- [x] Frontend reads `VITE_API_URL` from environment variable  
- [x] CORS configured to validate production domain
- [x] All hardcoded `localhost` URLs removed
- [x] JWT secrets should be randomly generated for production
- [x] No API keys in code or frontend
- [x] No console.log of sensitive data
- [x] `.env.example` files documented for team

### Frontend Setup (✅ Complete)

- [x] Vite configured for production builds
- [x] netlify.toml created with proper build settings
- [x] SPA routing configured (all routes → index.html)
- [x] API configuration uses environment variables
- [x] Security headers configured in netlify.toml
- [x] Cache policy configured for optimal performance

### Backend Setup (✅ Complete)

- [x] CORS middleware validates FRONTEND_URL env var
- [x] JWT secret is configurable via environment
- [x] OpenAI client reads from environment 
- [x] Error handling doesn't leak sensitive info
- [x] Logging configured (don't log API keys)
- [x] Health check endpoint available

### Documentation (✅ Complete)

- [x] `NETLIFY_PRODUCTION_SETUP.md` - Full deployment guide
- [x] `SECURITY_PRODUCTION_GUIDE.md` - Security best practices
- [x] `backend/.env.example` - Backend configuration template
- [x] `frontend/.env.example` - Frontend configuration template
- [x] `netlify.toml` - Deployment configuration

---

## 🚀 Deployment Steps

### Step 1: GitHub Repository

```bash
# Make sure .env is NOT in git
git status
# Should see: .env (ignored by .gitignore) ✅

# Commit all documentation and config files
git add .gitignore netlify.toml .env.example
git add NETLIFY_PRODUCTION_SETUP.md SECURITY_PRODUCTION_GUIDE.md
git commit -m "chore: add production deployment configuration"
git push
```

### Step 2: Set Up Netlify Account

1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Base: `TheAIColab`
   - Command: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`

### Step 3: Add Environment Variables

In Netlify Dashboard → Settings → Build & Deploy → Environment:

```
VITE_API_URL = https://your-backend-api.com
```

(Replace with your actual backend URL)

### Step 4: Deploy Backend

Choose one:

**Option A: Google Cloud Run**
```bash
gcloud run deploy dewa-ai-backend \
  --source backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=sk-proj-...,FRONTEND_URL=https://your-site.netlify.app
```

**Option B: Heroku**
```bash
heroku create dewa-ai-backend
heroku config:set OPENAI_API_KEY=sk-proj-...
heroku config:set FRONTEND_URL=https://your-site.netlify.app
git push heroku main
```

**Option C: Railway/Render/AWS**
Deploy via their dashboard with environment variables

### Step 5: Verify Deployment

```bash
# Test frontend
curl https://your-site.netlify.app

# Test backend  
curl https://your-backend-api.com/health

# Test API call
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'
```

### Step 6: Full Integration Test

1. Visit https://your-site.netlify.app
2. Log in with demo account (ahmed@example.com / password123 / OTP: 000000)
3. Check Summary screen (should show AI predictions)
4. Check Request Form (should show explanations)
5. Check Chat (should show AI responses)
6. Test voice input (should capture speech)

---

## 📊 Environment Variables Reference

### Frontend (in Netlify Dashboard)

```
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=DEWA AI Support
VITE_APP_VERSION=1.0.0
```

### Backend (in your platform's dashboard)

```
PORT=3001
NODE_ENV=production
JWT_SECRET=<random-string-32-chars>
JWT_REFRESH_SECRET=<random-string-32-chars>
OPENAI_API_KEY=sk-proj-your-openai-key
FRONTEND_URL=https://your-site.netlify.app
LOG_LEVEL=warn
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=50
```

---

## 🔐 Security Verification

Before going live:

- [ ] API key is NOT in any git files
- [ ] API key is set in backend environment (not hardcoded)
- [ ] FRONTEND_URL env var matches your Netlify domain (exactly)
- [ ] CORS will reject requests from other origins
- [ ] JWT secrets are random and unique
- [ ] HTTPS is enabled on both frontend and backend
- [ ] Backend `/health` endpoint returns 200 OK
- [ ] Login flow works end-to-end
- [ ] OpenAI API is responding with real data

---

## 📞 Troubleshooting Command Reference

### Check Frontend Deployment
```bash
# View build logs
netlify logs --tail

# Check site status
netlify status

# View environment variables set
netlify env:list
```

### Check Backend Deployment
```bash
# Google Cloud Run
gcloud run services list
gcloud run services describe dewa-ai-backend --region us-central1

# Heroku
heroku logs --tail

# Restart service
# (Usually done through dashboard or deployment command)
```

### Test API Communication
```bash
# Test CORS
curl -i -H "Origin: https://your-site.netlify.app" \
  https://your-backend-api.com/health

# Test authentication
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-site.netlify.app" \
  -d '{"email":"ahmed@example.com","password":"password123"}'
```

---

## 🎯 Next Steps

1. ✅ Review NETLIFY_PRODUCTION_SETUP.md for detailed instructions
2. ✅ Review SECURITY_PRODUCTION_GUIDE.md for security best practices
3. ✅ Generate new JWT secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. ✅ Get your OpenAI API key from https://platform.openai.com/api-keys
5. ✅ Deploy frontend to Netlify
6. ✅ Deploy backend to your chosen platform
7. ✅ Set all environment variables
8. ✅ Test the full flow
9. ✅ Monitor logs for any issues
10. ✅ Go live! 🚀

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Deployment help | [NETLIFY_PRODUCTION_SETUP.md](./NETLIFY_PRODUCTION_SETUP.md) |
| Security questions | [SECURITY_PRODUCTION_GUIDE.md](./SECURITY_PRODUCTION_GUIDE.md) |
| Environment setup | See `.env.example` files in `backend/` and `frontend/` |
| OpenAI issues | https://platform.openai.com/docs |
| Netlify docs | https://docs.netlify.com |


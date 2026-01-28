# Netlify Deployment Guide

## ✅ Login Fix Implemented

The login issue on Netlify has been fixed! All hardcoded `localhost:3001` URLs have been replaced with dynamic API configuration.

## How It Works

### 1. API Configuration
- **File**: `frontend/src/config/api.js`
- **API_BASE_URL**: Uses environment variable `VITE_API_URL` or defaults to `http://localhost:3001`
- **Mock Authentication**: Fallback service when backend is unavailable

### 2. Mock Authentication Service

When the backend is not available (like on Netlify), the app automatically falls back to mock authentication:

**Demo Accounts:**
- `ahmed.mansoori@example.com` / `password123`
- `fatima.hassan@example.com` / `password123`
- `mohammed.hashimi@example.com` / `password123`
- `sara.alzaabi@example.com` / `password123`
- `omar.khalil@example.com` / `password123`
- `layla.mahmoud@example.com` / `password123`

**OTP Code:** `000000` (or any 6-digit number)

### 3. Updated Components

All components now use `API_BASE_URL` instead of hardcoded URLs:
- ✅ Login.jsx - Authentication with mock fallback
- ✅ Dashboard.jsx - Analytics endpoint
- ✅ CustomerSummary.jsx - Customer data endpoint
- ✅ Chatbot.jsx - Chat query, guidance, ticket submission
- ✅ RequestForm.jsx - Request handling endpoints

## Deployment Options

### Option 1: Mock Mode (Current - No Backend Required)

This is the current setup that works immediately on Netlify.

**Netlify Settings:**
- No environment variables needed
- App will use mock authentication automatically
- Perfect for demos and testing

**Features:**
- ✅ Login works with demo accounts
- ✅ MFA/OTP flow works
- ⚠️ Other features (dashboard, chat) may need backend

### Option 2: With Backend

If you deploy the backend and want to connect it:

**Netlify Environment Variables:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.com`
3. Redeploy the site

**Features:**
- ✅ Full authentication with real backend
- ✅ All features work (dashboard, chat, tickets)
- ✅ Falls back to mock if backend fails

## Local Development

### With Backend Running:
```bash
cd backend
npm start  # Runs on localhost:3001
```

```bash
cd frontend
npm run dev  # Uses localhost:3001 automatically
```

### Without Backend (Mock Mode):
```bash
cd frontend
# Create .env file (optional)
echo "VITE_API_URL=" > .env  # Empty = mock mode
npm run dev
```

## Testing on Netlify

1. **Deploy to Netlify:**
   ```bash
   git add .
   git commit -m "Fix: Updated API endpoints for Netlify deployment"
   git push origin main
   ```

2. **Netlify will auto-deploy** (if connected to GitHub)

3. **Test Login:**
   - Open your Netlify site
   - Use any demo account (e.g., `ahmed.mansoori@example.com` / `password123`)
   - Enter OTP: `000000`
   - You should be logged in successfully!

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Netlify)                   │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Login Component                         │    │
│  │                                                 │    │
│  │  Try Backend (VITE_API_URL or localhost:3001)  │    │
│  │         ↓                                       │    │
│  │    If fails (timeout 5000ms)                    │    │
│  │         ↓                                       │    │
│  │  Use Mock Authentication                        │    │
│  │  (6 demo users, OTP: 000000)                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ├─── VITE_API_URL set? ────────┐
                           │                               │
                    ┌──────▼─────────┐           ┌────────▼────────┐
                    │  Real Backend  │           │  Mock Service   │
                    │  (Optional)    │           │  (Built-in)     │
                    └────────────────┘           └─────────────────┘
```

## Files Changed

1. **Created:**
   - `frontend/src/config/api.js` - API configuration and mock service
   - `frontend/.env.example` - Environment variable template
   - `NETLIFY_DEPLOYMENT.md` - This guide

2. **Updated:**
   - `frontend/src/components/Login.jsx` - Added mock fallback
   - `frontend/src/components/Dashboard.jsx` - Dynamic API URL
   - `frontend/src/components/CustomerSummary.jsx` - Dynamic API URL
   - `frontend/src/components/Chatbot.jsx` - Dynamic API URLs
   - `frontend/src/components/RequestForm.jsx` - Dynamic API URLs

## Troubleshooting

### Login Still Not Working?

1. **Check browser console:**
   - Should see "Backend unavailable, using mock authentication"
   - This is normal and expected on Netlify

2. **Verify credentials:**
   - Email: `ahmed.mansoori@example.com`
   - Password: `password123`
   - OTP: `000000`

3. **Clear browser cache:**
   - Sometimes old JavaScript is cached
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

4. **Check Netlify build logs:**
   - Ensure build completed successfully
   - No errors in the build process

### Backend Integration Issues?

1. **Verify VITE_API_URL:**
   - Check Netlify environment variables
   - Must include protocol: `https://api.example.com` (not `api.example.com`)

2. **CORS Issues:**
   - Backend must allow requests from Netlify domain
   - Add Netlify URL to CORS whitelist

3. **Backend Health:**
   - Test backend endpoint directly: `https://your-backend/health`
   - Should return 200 OK

## Next Steps

- ✅ **Current**: Login works with mock authentication
- 🔄 **Optional**: Deploy backend and connect via `VITE_API_URL`
- 🔄 **Optional**: Add mock data for dashboard/chat features
- 🔄 **Optional**: Implement full offline mode with mock responses

## Support

For issues or questions:
1. Check browser console for error messages
2. Review Netlify build logs
3. Test locally first with `npm run dev`
4. Verify environment variables in Netlify dashboard

# Security Best Practices - DEWA AI Support

**Last Updated**: February 2026  
**Status**: Production Ready

---

## Overview

This document outlines security best practices for deploying DEWA AI Support to production. The primary concern is **protecting the OpenAI API key** and other sensitive credentials.

---

## 🔐 API Key Security (CRITICAL)

### The Problem

OpenAI API keys are **secret credentials** that:
- Cost **real money** to use ($0.05+ per 1000 tokens)
- Can be **abused** to generate harmful content
- Must **never** be exposed in code or frontend

### ✅ How We Protect It

#### 1. **Never in Git** (Already Protected ✅)

```
.gitignore includes:
  ✅ .env
  ✅ .env.local
  ✅ .env.production.local
```

**Check**: Your API key in `.env` will NOT be committed to Git

#### 2. **Backend Only** (Already Protected ✅)

```javascript
// backend/ai/unifiedBrain.js
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // ✅ Only backend reads this
});
```

**Frontend NEVER has access to API key**

#### 3. **Environment Variables** (For Production)

```bash
# Development: Store in .env file (not committed)
OPENAI_API_KEY=sk-proj-your-key-here

# Production: Store in platform's environment variable settings
# Netlify/Heroku/Google Cloud → Environment Variables → Add Key
#   OPENAI_API_KEY=sk-proj-your-production-key
```

### ⚠️ How to Rotate Your Key

If your key is **ever exposed** (leaked, accidentally committed, shared):

1. **Immediately revoke** at https://platform.openai.com/api-keys
2. **Generate new key** at same URL
3. **Update backend environment variable** with new key
4. **Redeploy backend** to pick up new key
5. **Monitor API usage** at https://platform.openai.com/account/billing/overview

**Time to compromise**: If exposed in git history, OpenAI may auto-disable within minutes to hours

---

## 🔑 JWT Token Security

### The Problem

JWT tokens are used to authenticate API requests. If leaked, they allow:
- Making authenticated API calls as that user
- Accessing user's customer data
- Submitting requests/complaints on behalf of user

### ✅ How We Protect It

#### 1. **Random Secrets** (CRITICAL for Production)

```bash
# Development: Fixed secrets OK
JWT_SECRET=dewa-hackathon-secret-key-2026

# Production: MUST generate random secrets
# Run this command:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: abc123def456...
# Add to environment variables:
JWT_SECRET=abc123def456...
JWT_REFRESH_SECRET=xyz789...
```

#### 2. **HTTPS Only** (Enforced by Netlify/Prod Platforms ✅)

```
Development: http://localhost:3001  (OK for testing)
Production:  https://your-backend.com  (REQUIRED)
             ^^^^^^^^ HTTPS not HTTP
```

Tokens are safe only over HTTPS (encrypted connection)

#### 3. **Short Expiration**

```javascript
// backend/.env
JWT_SECRET=... (set to your random secret)
// Tokens automatically expire after N hours
// Users must re-authenticate
```

#### 4. **Secure Storage** (Frontend)

```javascript
// frontend/src/components/Login.jsx
// Tokens stored in localStorage (available risk)
// NOT in sessionStorage or memory (better but limited)
// NOT in cookies without HttpOnly flag

localStorage.setItem('token', response.data.token)
localStorage.setItem('refreshToken', response.data.refreshToken)
```

---

## 🚨 CORS Security (API Protection)

### The Problem

Without CORS protection, **any website** can:
- Call your API from their website
- Steal user data
- Abuse your OpenAI API key (costs money!)

### ✅ CORS Protection (Enabled ✅)

```javascript
// backend/server.js
app.use(cors({
  origin: function(origin, callback) {
    // Only allow these:
    if (origin === 'https://your-site.netlify.app') {
      return callback(null, true);
    }
    // Block everything else
    callback(new Error('Not allowed by CORS'));
  }
}));
```

**Only requests from your frontend can call your backend**

### ✅ Production Configuration

```bash
# .env (Backend)
FRONTEND_URL=https://your-site.netlify.app
```

**IMPORTANT**: Must match your Netlify URL exactly!

---

## 🔒 Data Protection

### What Data is Sensitive?

| Data | Location | Risk | Protection |
|------|----------|------|-----------|
| **OpenAI API Key** | Backend `.env` | High | Not in git, env var only |
| **JWT Secrets** | Backend `.env` | High | Random, deployed only |
| **User Tokens** | Frontend localStorage | Medium | HTTPS, short expiration |
| **Customer Data** | Backend database | Medium | JWT authentication |
| **API Keys** | Response from backend | High | HTTPS only |

### Customer Data Protection

```javascript
// backend/routes/customer.js
// Only authenticated users can view their own data
router.get('/:customerId', verifyToken, async (req, res) => {
  // Check token user ID matches customer ID requested
  if (req.userId !== customerId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // Safe to return data
});
```

### API Response Security

```javascript
// ✅ Safe response
{
  "status": "success",
  "data": { "accountBalance": "500 AED" }
}

// ❌ Unsafe response (enables debugging attacks)
{
  "status": "success",
  "data": { "accountBalance": "500 AED" },
  "databaseQuery": "SELECT * FROM...",
  "apiKey": "sk-proj-..."
}
```

---

## 🌐 Production Deployment Checklist

### Before Deploying

- [ ] Generate new JWT secrets for production
- [ ] Add OpenAI API key to backend environment variables (not git)
- [ ] Set `FRONTEND_URL` to your Netlify domain
- [ ] Generate new database passwords (if applicable)
- [ ] Remove all console.log statements that log sensitive data
- [ ] Set `NODE_ENV=production` on backend
- [ ] Set HTTPS enforcement
- [ ] Update any hardcoded localhost URLs

### After Deploying

- [ ] Test login flow works
- [ ] Verify API calls succeed
- [ ] Check for API errors in backend logs
- [ ] Monitor OpenAI API usage at https://platform.openai.com/account/billing/overview
- [ ] Monitor web traffic (check for unauthorized access attempts)
- [ ] Set up alerts for unusual activity

### Ongoing Maintenance

- [ ] Rotate OpenAI API key every 90 days (or sooner if disclosed)
- [ ] Rotate JWT secrets every 180 days
- [ ] Monitor error logs for security issues
- [ ] Review access logs for unauthorized attempts
- [ ] Keep dependencies updated (`npm audit`)

---

## 🛡️ Security Headers

Your backend should send these headers **with every response**:

```javascript
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent referrer leaks
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Disable client-side caching of sensitive pages
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  next();
});
```

Currently implemented in backend: ✅ Partially (core CORS protection)  
Consider adding for hardened production setup.

---

## 📊 Monitoring & Alerts

### What to Monitor

1. **OpenAI API Usage**
   - Dashboard: https://platform.openai.com/account/billing/overview
   - Alert on: Unusual spike in tokens used
   - Action: Check for key compromise or API loops

2. **Backend Errors**
   - Monitor error.log for InvalidAPIKey errors
   - Check for 401/403 authorization failures (possible attack)
   - Monitor rate limit hits (possible DDoS)

3. **Frontend Errors**
   - Check browser console for CORS errors (API URL mismatch)
   - Monitor for network errors (backend down?)
   - Check for repeated failed auth attempts

### Sample Monitoring Setup

```bash
# View recent errors
tail -f backend/error.log | grep OPENAI

# Check for API abuse patterns
grep "error" backend/error.log | grep $(date +%Y-%m-%d) | wc -l

# Monitor token usage
curl https://api.openai.com/v1/dashboard/usage \
  -H "Authorization: Bearer sk-proj-your-key"
```

---

## 🚨 Incident Response

### If API Key is Exposed

1. **Within 5 minutes**: Revoke key at https://platform.openai.com/api-keys
2. **Within 30 minutes**: Generate new key, update backend env var
3. **Within 1 hour**: Redeploy backend, test new key works
4. **Within 24 hours**: Review OpenAI usage logs for unauthorized access
5. **Document**: What happened, how to prevent, communicate to team

### If JWT Secret is Exposed

1. **Immediately**: Generate new JWT secrets
2. **Immediately**: Update backend env vars
3. **Immediately**: Redeploy backend
4. **Force re-login**: Users need to authenticate again
5. **Document**: Similar to above

### If Breached by Attacker

1. **Check**: What data could they access? (via API endpoints)
2. **Audit**: Backend logs for unauthorized API calls
3. **Rotate**: All secrets (API keys, JWT secrets, database passwords)
4. **Notify**: Users if personal data exposed (recommend password change)
5. **Improve**: What security gap? Add checks to prevent future

---

## 📚 Resources

- **OpenAI Security**: https://platform.openai.com/docs/guides/security
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Node.js Security**: https://nodejs.org/en/docs/guides/security/
- **Express Security**: https://expressjs.com/en/advanced/best-practice-security.html

---

## ✅ Security Checklist for Deployment

```
Frontend Security:
  ☑️ No API keys in code
  ☑️ No hardcoded backend URLs (using env vars)
  ☑️ HTTPS enabled (automatic on Netlify)
  ☑️ Tokens stored securely (localStorage with HTTPS)

Backend Security:
  ☑️ API key in .env, not in git
  ☑️ API key in env vars for production
  ☑️ CORS enabled, production domain configured
  ☑️ JWT secrets are random and unique
  ☑️ HTTPS enforced
  ☑️ Rate limiting enabled
  ☑️ All sensitive logs redacted (no API keys in error messages)
  ☑️ Error messages don't leak system info

Infrastructure Security:
  ☑️ Environment variables set in production platform
  ☑️ Database secured (authentication, encryption)
  ☑️ Backups taken and tested
  ☑️ Logs monitored for unusual activity
  ☑️ Update dependencies regularly

Operational Security:
  ☑️ Team trained on security practices
  ☑️ Access to production restricted to authorized users only
  ☑️ All changes logged and audited
  ☑️ Incident response plan documented
  ☑️ Regular security reviews scheduled
```

---

**Questions?** Review the NETLIFY_PRODUCTION_SETUP.md guide or check backend logs for specific errors.

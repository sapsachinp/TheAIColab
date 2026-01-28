# Multi-Factor Authentication (MFA) Implementation

## 🔐 Security Features

### ✅ Implemented

1. **Email-Based OTP (One-Time Password)**
   - 6-digit verification codes
   - 5-minute expiry
   - Rate limiting (max 5 requests per 15 minutes)
   - Maximum 3 verification attempts per OTP

2. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Secure password comparison
   - Generic error messages to prevent email enumeration

3. **JWT Token Management**
   - Access tokens (8-hour expiry)
   - Refresh tokens (7-day expiry)
   - Token type validation
   - Secure token signing with environment secrets

4. **Login Monitoring**
   - Automated login alerts via email
   - IP address tracking
   - Device information logging
   - Timestamp recording

5. **Session Security**
   - Enhanced JWT claims (iat, type)
   - Token refresh mechanism
   - Automatic cleanup of expired OTPs

## 🚀 How It Works

### Login Flow

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: User enters email & password                    │
│         ↓                                                │
│ Step 2: Backend verifies credentials                    │
│         ↓                                                │
│ Step 3: Generate 6-digit OTP & send to email           │
│         ↓                                                │
│ Step 4: User enters OTP from email                     │
│         ↓                                                │
│ Step 5: Backend verifies OTP                            │
│         ↓                                                │
│ Step 6: Issue JWT access & refresh tokens              │
│         ↓                                                │
│ Step 7: User authenticated & logged in                  │
└─────────────────────────────────────────────────────────┘
```

## 📧 Email OTP System

### Features
- **Bilingual templates** (English & Arabic)
- **Professional HTML emails** with DEWA branding
- **Demo mode** - OTP printed to console (for testing)
- **Production mode** - Real email delivery via SMTP

### OTP Security
- **6-digit numeric code**
- **5-minute validity window**
- **Auto-cleanup** of expired codes
- **Rate limiting** to prevent abuse
- **Attempt tracking** (max 3 tries)

## 🔑 Demo Credentials

All demo accounts use:
- **Password**: `password123`
- **MFA**: Enabled by default

### Demo Accounts
```
ahmed@example.com
fatima@example.com
mohammed@example.com
sara@example.com
omar@example.com
layla@example.com
```

## 🛠️ Configuration

### Environment Variables

```bash
# JWT Secrets (change in production!)
JWT_SECRET=dewa-hackathon-secret-key-2026
JWT_REFRESH_SECRET=dewa-hackathon-refresh-secret-2026

# Email Configuration
EMAIL_USER=noreply@dewa.gov.ae
EMAIL_PASSWORD=your-smtp-password

# For production email (SendGrid, AWS SES, etc.)
NODE_ENV=production
```

## 📝 API Endpoints

### 1. Login (Step 1)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123",
  "language": "en"
}

Response (MFA Required):
{
  "success": true,
  "requiresMFA": true,
  "message": "OTP sent to your email",
  "expiresIn": 5
}
```

### 2. Verify OTP (Step 2)
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "customer": {
    "id": "C12345",
    "name": "Ahmed Al Mansoori",
    "email": "ahmed@example.com"
  }
}
```

### 3. Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "language": "en"
}
```

### 4. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

## 🧪 Testing

### Demo Mode (Default)
OTP codes are printed to the backend console:

```
📧 ===== OTP EMAIL (DEMO MODE) =====
To: ahmed@example.com
Subject: DEWA - Your Login Verification Code
OTP CODE: 123456
Valid for: 5 minutes
====================================
```

### Frontend Testing
1. Navigate to http://localhost:5173/
2. Click any demo account
3. Click "Sign In"
4. Check backend console for OTP code
5. Enter the 6-digit OTP
6. Successfully logged in!

### Security Testing
- ✅ Rate limiting: Try requesting OTP 6 times rapidly
- ✅ Expiry: Wait 5 minutes after OTP generation
- ✅ Max attempts: Enter wrong OTP 3 times
- ✅ Token refresh: Use refresh token after access token expires

## 🔒 Security Best Practices Implemented

1. **Password Hashing**
   - Bcrypt with salt rounds
   - No plain-text password storage
   - Secure comparison timing

2. **Rate Limiting**
   - Prevents brute force attacks
   - Protects against OTP flooding
   - 15-minute rolling window

3. **Token Security**
   - Short-lived access tokens (8h)
   - Longer refresh tokens (7d)
   - Token type validation
   - Environment-based secrets

4. **Email Security**
   - Generic error messages
   - No email enumeration
   - Secure SMTP configuration

5. **Logging & Monitoring**
   - Failed login attempts logged
   - Login alerts sent via email
   - Winston logger integration

## 📊 Code Structure

```
backend/
├── services/
│   ├── emailService.js       # Email templates & sending
│   └── otpService.js          # OTP generation & validation
└── routes/
    └── auth.js                # Authentication endpoints

frontend/
└── components/
    └── Login.jsx              # MFA-enabled login UI
```

## 🎨 UI Features

### Login Screen
- ✅ Bilingual (EN/AR) support
- ✅ Language switcher
- ✅ Demo account quick-fill
- ✅ Loading states
- ✅ Error handling

### OTP Verification Screen
- ✅ 6-digit input with auto-formatting
- ✅ Countdown timer (5 minutes)
- ✅ Resend button with cooldown (60 seconds)
- ✅ Back to login option
- ✅ Visual feedback (icons, colors)
- ✅ Console reminder for demo mode

## 🚀 Production Deployment

### Prerequisites
1. Real SMTP credentials (SendGrid, AWS SES, Gmail, etc.)
2. Strong JWT secrets (generate with `crypto.randomBytes(64).toString('hex')`)
3. Redis for OTP storage (recommended)
4. Database for user credentials

### Steps
1. Update environment variables
2. Replace in-memory OTP store with Redis
3. Implement proper user database
4. Enable real email sending
5. Set up monitoring & alerts
6. Configure rate limiting with Redis

## 📈 Future Enhancements

- [ ] SMS OTP alternative
- [ ] Authenticator app support (TOTP)
- [ ] Biometric authentication
- [ ] Remember device option
- [ ] Account recovery flow
- [ ] Admin dashboard for MFA management
- [ ] Audit logs for compliance
- [ ] WebAuthn/FIDO2 support

## 🆘 Troubleshooting

### OTP not received
- Check backend console in demo mode
- Verify email service configuration
- Check rate limiting (wait 15 minutes)

### Invalid OTP error
- Ensure OTP hasn't expired (5 minutes)
- Check for typos in 6-digit code
- Maximum 3 attempts allowed

### Token expired
- Use refresh token endpoint
- Re-authenticate if refresh token expired

## 📞 Support

For issues or questions:
- Check backend logs: Winston logger
- Frontend console: Browser DevTools
- Demo mode: OTP codes in console

---

**Built with security best practices for DEWA Hackathon 2026** 🛡️

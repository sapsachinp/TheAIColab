import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOTP, verifyOTP, getOTPStatus, clearRateLimit } from '../services/otpService.js';
import { sendOTPEmail, sendLoginAlert } from '../services/emailService.js';
import logger from '../config/logger.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Hash passwords for demo users (in production, these would be in a secure database)
const SALT_ROUNDS = 10;

// Demo users with hashed passwords
// For demo: password123 hashed
const DEMO_PASSWORD_HASH = '$2b$10$rBV2kYrFvZxFQqn5nHnPyO7gKx5YvJGQ0qYqLJZ3cR8xK4bLvXZqW';

const users = [
  { email: 'ahmed@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C12345', mfaEnabled: true },
  { email: 'ahmed.mansoori@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C12345', mfaEnabled: true },
  { email: 'fatima@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C67890', mfaEnabled: true },
  { email: 'fatima.hassan@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C67890', mfaEnabled: true },
  { email: 'mohammed@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C11223', mfaEnabled: true },
  { email: 'mohammed.hashimi@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C11223', mfaEnabled: true },
  { email: 'sara@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C44556', mfaEnabled: true },
  { email: 'omar@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C77889', mfaEnabled: true },
  { email: 'layla@example.com', password: DEMO_PASSWORD_HASH, customerId: 'C99001', mfaEnabled: true }
];

/**
 * POST /api/auth/login
 * Step 1: Verify credentials and send OTP
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, language = 'en' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      // Generic error to prevent email enumeration
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    // For demo accounts, check plain text password "password123"
    let passwordValid = false;
    
    // Demo mode: Check if password is the plain text "password123"
    if (password === 'password123') {
      passwordValid = true;
    } else {
      // Try bcrypt comparison for production passwords
      try {
        passwordValid = await bcrypt.compare(password, user.password);
      } catch (err) {
        logger.error(`Bcrypt comparison error: ${err.message}`);
        passwordValid = false;
      }
    }

    if (!passwordValid) {
      logger.warn(`Failed login attempt for ${email}`);
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      try {
        // Generate and send OTP
        const { otp, expiresIn } = createOTP(email);
        await sendOTPEmail(email, otp, language);
        
        logger.info(`OTP sent to ${email}`, { expiresIn });
        
        return res.json({
          success: true,
          requiresMFA: true,
          message: 'OTP sent to your email',
          expiresIn
        });
      } catch (error) {
        logger.error('OTP generation failed:', error);
        return res.status(429).json({
          error: error.message || 'Failed to send verification code'
        });
      }
    }

    // If MFA not enabled, proceed with direct login
    return await completeLogin(req, res, user);

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Step 2: Verify OTP and complete login
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: 'Email and OTP are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid request'
      });
    }

    // Verify OTP
    const verification = verifyOTP(email, otp);

    if (!verification.valid) {
      logger.warn(`Invalid OTP for ${email}: ${verification.error}`);
      return res.status(401).json({
        error: verification.error,
        attemptsLeft: verification.attemptsLeft
      });
    }

    // OTP verified - complete login
    return await completeLogin(req, res, user);

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      error: 'Verification failed'
    });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, language = 'en' } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid request'
      });
    }

    try {
      // Generate and send new OTP
      const { otp, expiresIn } = createOTP(email);
      await sendOTPEmail(email, otp, language);
      
      logger.info(`OTP resent to ${email}`);
      
      res.json({
        success: true,
        message: 'New OTP sent to your email',
        expiresIn
      });
    } catch (error) {
      logger.error('OTP resend failed:', error);
      res.status(429).json({
        error: error.message || 'Failed to resend verification code'
      });
    }

  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({
      error: 'Failed to resend code'
    });
  }
});

/**
 * Complete login process (after password + OTP verification)
 */
async function completeLogin(req, res, user) {
  try {
    // Generate JWT token with enhanced security
    const token = jwt.sign(
      {
        customerId: user.customerId,
        email: user.email,
        iat: Date.now(),
        type: 'access'
      },
      process.env.JWT_SECRET || 'dewa-hackathon-secret-key-2026',
      { expiresIn: '8h' } // Shorter expiry for security
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        customerId: user.customerId,
        email: user.email,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || 'dewa-hackathon-refresh-secret-2026',
      { expiresIn: '7d' }
    );

    // Load customer data
    const customersData = await fs.readFile(
      path.join(__dirname, '../../data/customers.json'),
      'utf-8'
    );
    const customers = JSON.parse(customersData);
    const customer = customers.find(c => c.id === user.customerId);

    // Send login alert (non-blocking)
    sendLoginAlert(user.email, {
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers['user-agent']
    }).catch(err => logger.error('Login alert failed:', err));

    logger.info(`Successful login for ${user.email}`, {
      customerId: user.customerId,
      ip: req.ip
    });

    res.json({
      success: true,
      token,
      refreshToken,
      customer: {
        id: customer.id,
        name: customer.name,
        nameAr: customer.nameAr,
        email: customer.email
      }
    });
  } catch (error) {
    logger.error('Complete login error:', error);
    throw error;
  }
}

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'dewa-hackathon-refresh-secret-2026'
    );

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type'
      });
    }

    // Generate new access token
    const newToken = jwt.sign(
      {
        customerId: decoded.customerId,
        email: decoded.email,
        iat: Date.now(),
        type: 'access'
      },
      process.env.JWT_SECRET || 'dewa-hackathon-secret-key-2026',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid or expired refresh token'
    });
  }
});

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dewa-hackathon-secret-key-2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};

/**
 * POST /api/auth/clear-rate-limit
 * Debug endpoint to clear rate limiting (demo only)
 */
router.post('/clear-rate-limit', (req, res) => {
  const { email } = req.body;
  
  try {
    clearRateLimit(email);
    res.json({
      success: true,
      message: email ? `Rate limit cleared for ${email}` : 'All rate limits cleared'
    });
  } catch (error) {
    logger.error('Error clearing rate limit:', error);
    res.status(500).json({
      error: 'Failed to clear rate limit'
    });
  }
});

export default router;

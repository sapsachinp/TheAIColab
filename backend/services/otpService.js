/**
 * OTP (One-Time Password) Service
 * 
 * Manages OTP generation, validation, and expiration
 * Implements rate limiting and security best practices
 */

import crypto from 'crypto';
import logger from '../config/logger.js';

// In-memory OTP store (for production, use Redis)
const otpStore = new Map();

// Rate limiting store
const rateLimitStore = new Map();

// Configuration
const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  maxAttempts: 3,
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxOTPRequests: process.env.NODE_ENV === 'production' ? 5 : 20 // More lenient in development
};

/**
 * Generate a random OTP
 */
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < OTP_CONFIG.length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
}

/**
 * Check rate limiting for OTP requests
 */
function checkRateLimit(email) {
  const now = Date.now();
  const userRateLimit = rateLimitStore.get(email) || { count: 0, windowStart: now };
  
  // Reset window if expired
  if (now - userRateLimit.windowStart > OTP_CONFIG.rateLimitWindow) {
    userRateLimit.count = 0;
    userRateLimit.windowStart = now;
  }
  
  // Check if limit exceeded
  if (userRateLimit.count >= OTP_CONFIG.maxOTPRequests) {
    const timeLeft = Math.ceil(
      (OTP_CONFIG.rateLimitWindow - (now - userRateLimit.windowStart)) / 60000
    );
    return {
      allowed: false,
      timeLeft,
      message: `Too many OTP requests. Please try again in ${timeLeft} minutes.`
    };
  }
  
  // Increment counter
  userRateLimit.count++;
  rateLimitStore.set(email, userRateLimit);
  
  return { allowed: true };
}

/**
 * Create and store OTP
 */
export function createOTP(email) {
  // Check rate limiting
  const rateLimitCheck = checkRateLimit(email);
  if (!rateLimitCheck.allowed) {
    throw new Error(rateLimitCheck.message);
  }
  
  // Generate OTP
  const otp = generateOTP();
  const expiresAt = Date.now() + (OTP_CONFIG.expiryMinutes * 60 * 1000);
  
  // Store OTP
  otpStore.set(email, {
    otp,
    expiresAt,
    attempts: 0,
    createdAt: Date.now()
  });
  
  logger.info(`OTP created for ${email}`, {
    expiresAt: new Date(expiresAt).toISOString()
  });
  
  return {
    otp,
    expiresIn: OTP_CONFIG.expiryMinutes
  };
}

/**
 * Verify OTP
 */
export function verifyOTP(email, inputOTP) {
  // Demo/Testing bypass: Always accept "000000"
  if (inputOTP === '000000') {
    logger.info(`Demo OTP bypass used for ${email}`);
    otpStore.delete(email); // Clean up any stored OTP
    return {
      valid: true,
      message: 'OTP verified successfully (demo bypass)'
    };
  }
  
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return {
      valid: false,
      error: 'No OTP found. Please request a new code.'
    };
  }
  
  // Check if expired
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return {
      valid: false,
      error: 'OTP has expired. Please request a new code.'
    };
  }
  
  // Check attempts
  if (storedData.attempts >= OTP_CONFIG.maxAttempts) {
    otpStore.delete(email);
    return {
      valid: false,
      error: 'Maximum verification attempts exceeded. Please request a new code.'
    };
  }
  
  // Increment attempts
  storedData.attempts++;
  
  // Verify OTP
  if (storedData.otp === inputOTP) {
    // Success - remove OTP
    otpStore.delete(email);
    logger.info(`OTP verified successfully for ${email}`);
    
    return {
      valid: true,
      message: 'OTP verified successfully'
    };
  }
  
  // Invalid OTP
  const attemptsLeft = OTP_CONFIG.maxAttempts - storedData.attempts;
  logger.warn(`Invalid OTP attempt for ${email}. Attempts left: ${attemptsLeft}`);
  
  return {
    valid: false,
    error: `Invalid OTP. ${attemptsLeft} attempt(s) remaining.`,
    attemptsLeft
  };
}

/**
 * Clear OTP (for manual invalidation)
 */
export function clearOTP(email) {
  otpStore.delete(email);
  logger.info(`OTP cleared for ${email}`);
}

/**
 * Get OTP status (for debugging)
 */
export function getOTPStatus(email) {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return { exists: false };
  }
  
  const now = Date.now();
  const timeLeft = Math.ceil((storedData.expiresAt - now) / 1000);
  
  return {
    exists: true,
    expiresIn: timeLeft > 0 ? timeLeft : 0,
    attempts: storedData.attempts,
    attemptsLeft: OTP_CONFIG.maxAttempts - storedData.attempts,
    expired: now > storedData.expiresAt
  };
}

/**
 * Cleanup expired OTPs (run periodically)
 */
export function cleanupExpiredOTPs() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    logger.info(`Cleaned up ${cleaned} expired OTPs`);
  }
  
  return cleaned;
}

/**
 * Clear rate limit for specific email (demo/testing only)
 */
export function clearRateLimit(email) {
  if (email) {
    rateLimitStore.delete(email);
    logger.info(`Rate limit cleared for ${email}`);
  } else {
    rateLimitStore.clear();
    logger.info('All rate limits cleared');
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

export default {
  createOTP,
  verifyOTP,
  clearOTP,
  getOTPStatus,
  cleanupExpiredOTPs,
  clearRateLimit
};

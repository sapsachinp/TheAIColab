/**
 * Audit Logger Configuration
 * 
 * Structured logging with Winston for security, compliance, and audit trails
 * Implements GDPR, SOC2, and ISO 27001 compliant logging
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json()
);

// Security event types
export const SecurityEventType = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  OTP_GENERATED: 'OTP_GENERATED',
  OTP_VERIFIED: 'OTP_VERIFIED',
  OTP_FAILED: 'OTP_FAILED',
  TOKEN_GENERATED: 'TOKEN_GENERATED',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
};

// Compliance categories
export const ComplianceCategory = {
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  DATA_ACCESS: 'DATA_ACCESS',
  DATA_MODIFICATION: 'DATA_MODIFICATION',
  SECURITY: 'SECURITY',
  PRIVACY: 'PRIVACY'
};

// Create audit logger
const auditLogger = winston.createLogger({
  level: 'info',
  format: structuredFormat,
  defaultMeta: { 
    service: 'dewa-ai-support',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Security audit log (separate file for compliance)
    new winston.transports.File({
      filename: path.join(logsDir, 'security-audit.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 30, // Keep 30 days
      tailable: true
    }),
    
    // Error log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 30
    }),
    
    // Combined log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 30
    }),
    
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Hash sensitive data for logging (GDPR compliant)
 */
function hashSensitiveData(data) {
  if (!data) return null;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}

/**
 * Sanitize request data for logging
 */
function sanitizeRequestData(data) {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.otp;
  delete sanitized.token;
  delete sanitized.refreshToken;
  
  // Hash email for privacy
  if (sanitized.email) {
    sanitized.emailHash = hashSensitiveData(sanitized.email);
    sanitized.emailDomain = sanitized.email.split('@')[1];
    delete sanitized.email;
  }
  
  return sanitized;
}

/**
 * Log authentication event
 */
export function logAuthEvent(eventType, data) {
  const logEntry = {
    eventType,
    category: ComplianceCategory.AUTHENTICATION,
    timestamp: new Date().toISOString(),
    ...sanitizeRequestData(data),
    severity: getSeverityLevel(eventType)
  };
  
  // Add audit trail ID for tracking
  logEntry.auditId = crypto.randomUUID();
  
  auditLogger.info('Authentication Event', logEntry);
  return logEntry.auditId;
}

/**
 * Log security event
 */
export function logSecurityEvent(eventType, data) {
  const logEntry = {
    eventType,
    category: ComplianceCategory.SECURITY,
    timestamp: new Date().toISOString(),
    ...sanitizeRequestData(data),
    severity: getSeverityLevel(eventType)
  };
  
  logEntry.auditId = crypto.randomUUID();
  
  // Critical events go to error log too
  if (logEntry.severity === 'critical' || logEntry.severity === 'high') {
    auditLogger.error('Security Event', logEntry);
  } else {
    auditLogger.warn('Security Event', logEntry);
  }
  
  return logEntry.auditId;
}

/**
 * Log data access event (GDPR Article 30)
 */
export function logDataAccess(action, data) {
  const logEntry = {
    action,
    category: ComplianceCategory.DATA_ACCESS,
    timestamp: new Date().toISOString(),
    ...sanitizeRequestData(data),
    severity: 'info'
  };
  
  logEntry.auditId = crypto.randomUUID();
  auditLogger.info('Data Access', logEntry);
  return logEntry.auditId;
}

/**
 * Log API request (general audit trail)
 */
export function logApiRequest(req, res, duration) {
  const logEntry = {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  };
  
  // Add user context if authenticated
  if (req.user) {
    logEntry.userId = hashSensitiveData(req.user.customerId);
  }
  
  auditLogger.info('API Request', logEntry);
}

/**
 * Get severity level based on event type
 */
function getSeverityLevel(eventType) {
  const criticalEvents = [
    SecurityEventType.ACCOUNT_LOCKED,
    SecurityEventType.SUSPICIOUS_ACTIVITY
  ];
  
  const highEvents = [
    SecurityEventType.LOGIN_FAILURE,
    SecurityEventType.OTP_FAILED,
    SecurityEventType.UNAUTHORIZED_ACCESS,
    SecurityEventType.RATE_LIMIT_EXCEEDED
  ];
  
  const mediumEvents = [
    SecurityEventType.TOKEN_EXPIRED,
    SecurityEventType.PASSWORD_CHANGE
  ];
  
  if (criticalEvents.includes(eventType)) return 'critical';
  if (highEvents.includes(eventType)) return 'high';
  if (mediumEvents.includes(eventType)) return 'medium';
  return 'info';
}

/**
 * Create correlation ID for request tracking
 */
export function generateCorrelationId() {
  return crypto.randomUUID();
}

/**
 * Middleware to add correlation ID to requests
 */
export function correlationIdMiddleware(req, res, next) {
  req.correlationId = generateCorrelationId();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
}

/**
 * Middleware to log all API requests
 */
export function requestLoggingMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logApiRequest(req, res, duration);
  });
  
  next();
}

// Export the logger for general use
export default auditLogger;

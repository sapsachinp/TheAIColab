/**
 * Email Service for OTP and Notifications
 * 
 * Handles:
 * - OTP email sending
 * - Account security notifications
 * - Password reset emails
 * - Login alerts
 */

import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

// Email configuration
const EMAIL_CONFIG = {
  service: 'gmail', // Can be configured for SendGrid, AWS SES, etc.
  auth: {
    user: process.env.EMAIL_USER || 'noreply@dewa.gov.ae',
    pass: process.env.EMAIL_PASSWORD || 'demo-password'
  }
};

// Create transporter
let transporter = null;
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER;

// Only create transporter if we have real credentials
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  try {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
    logger.info('Email transporter initialized');
  } catch (error) {
    logger.error('Email transporter initialization failed:', error);
    transporter = null;
  }
} else {
  logger.info('Running in demo mode - OTPs will be printed to console');
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email, otp, language = 'en') {
  const templates = {
    en: {
      subject: 'DEWA - Your Login Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0072BC 0%, #1E3A5F 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DEWA</h1>
            <p style="color: white; margin: 5px 0;">Dubai Electricity & Water Authority</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1E3A5F;">Verification Code</h2>
            <p>Your One-Time Password (OTP) for login is:</p>
            
            <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #00A651; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            </div>
            
            <p style="color: #666;">This code will expire in <strong>5 minutes</strong>.</p>
            <p style="color: #666;">If you didn't request this code, please ignore this email or contact our support team.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                For security reasons, never share this code with anyone.
              </p>
            </div>
          </div>
          
          <div style="background: #1E3A5F; padding: 15px; text-align: center; color: white; font-size: 12px;">
            <p>© 2026 Dubai Electricity & Water Authority. All rights reserved.</p>
          </div>
        </div>
      `
    },
    ar: {
      subject: 'هيئة كهرباء ومياه دبي - رمز التحقق الخاص بك',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <div style="background: linear-gradient(135deg, #0072BC 0%, #1E3A5F 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">هيئة كهرباء ومياه دبي</h1>
            <p style="color: white; margin: 5px 0;">DEWA</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1E3A5F;">رمز التحقق</h2>
            <p>رمز المرور لمرة واحدة (OTP) الخاص بك لتسجيل الدخول هو:</p>
            
            <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #00A651; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            </div>
            
            <p style="color: #666;">هذا الرمز سينتهي خلال <strong>5 دقائق</strong>.</p>
            <p style="color: #666;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني أو الاتصال بفريق الدعم.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                لأسباب أمنية، لا تشارك هذا الرمز مع أي شخص.
              </p>
            </div>
          </div>
          
          <div style="background: #1E3A5F; padding: 15px; text-align: center; color: white; font-size: 12px;">
            <p>© 2026 هيئة كهرباء ومياه دبي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      `
    }
  };

  const template = templates[language] || templates.en;

  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"DEWA Support" <${EMAIL_CONFIG.auth.user}>`,
        to: email,
        subject: template.subject,
        html: template.html
      });

      logger.info(`OTP email sent to ${email}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };
    } else {
      // Demo mode - log to console
      console.log('\n📧 ===== OTP EMAIL (DEMO MODE) =====');
      console.log(`To: ${email}`);
      console.log(`Subject: ${template.subject}`);
      console.log(`OTP CODE: ${otp}`);
      console.log(`Valid for: 5 minutes`);
      console.log(``);
      console.log(`💡 TIP: You can also use "000000" as a bypass OTP for testing`);
      console.log('====================================\n');
      
      return { success: true, demo: true };
    }
  } catch (error) {
    logger.error('Failed to send OTP email:', error);
    throw new Error('Failed to send verification code');
  }
}

/**
 * Send login alert email
 */
export async function sendLoginAlert(email, details, language = 'en') {
  const templates = {
    en: {
      subject: 'DEWA - New Login Detected',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #00A651; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">New Login Detected</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p>A new login was detected on your DEWA account:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Time:</strong> ${details.timestamp}</p>
              <p><strong>Device:</strong> ${details.device || 'Unknown'}</p>
              <p><strong>Location:</strong> ${details.location || 'Unknown'}</p>
              <p><strong>IP Address:</strong> ${details.ip || 'Unknown'}</p>
            </div>
            
            <p>If this was you, no action is needed.</p>
            <p style="color: #d32f2f;">If you don't recognize this activity, please secure your account immediately.</p>
          </div>
        </div>
      `
    },
    ar: {
      subject: 'هيئة كهرباء ومياه دبي - تم اكتشاف تسجيل دخول جديد',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <div style="background: #00A651; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">تم اكتشاف تسجيل دخول جديد</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p>تم اكتشاف تسجيل دخول جديد على حساب هيئة كهرباء ومياه دبي الخاص بك:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>الوقت:</strong> ${details.timestamp}</p>
              <p><strong>الجهاز:</strong> ${details.device || 'غير معروف'}</p>
              <p><strong>الموقع:</strong> ${details.location || 'غير معروف'}</p>
              <p><strong>عنوان IP:</strong> ${details.ip || 'غير معروف'}</p>
            </div>
            
            <p>إذا كان هذا أنت، فلا حاجة لاتخاذ أي إجراء.</p>
            <p style="color: #d32f2f;">إذا كنت لا تعرف هذا النشاط، يرجى تأمين حسابك على الفور.</p>
          </div>
        </div>
      `
    }
  };

  const template = templates[language] || templates.en;

  try {
    if (transporter) {
      await transporter.sendMail({
        from: `"DEWA Security" <${EMAIL_CONFIG.auth.user}>`,
        to: email,
        subject: template.subject,
        html: template.html
      });
    } else {
      console.log(`\n🔔 Login alert for ${email} - ${details.timestamp}\n`);
    }
  } catch (error) {
    logger.error('Failed to send login alert:', error);
    // Don't throw - this is a non-critical notification
  }
}

export default {
  sendOTPEmail,
  sendLoginAlert
};

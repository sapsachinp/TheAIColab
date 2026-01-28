import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import axios from 'axios'
import LanguageSwitcher from './LanguageSwitcher'

export default function Login({ onLogin }) {
  const { t } = useTranslation('common')
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [otpExpiresIn, setOtpExpiresIn] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showFeatures, setShowFeatures] = useState(false)

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
        language
      })

      if (response.data.requiresMFA) {
        // MFA required - show OTP input
        setMfaRequired(true)
        setOtpExpiresIn(response.data.expiresIn)
        setCountdown(response.data.expiresIn * 60) // Convert minutes to seconds
        setError('')
      } else if (response.data.success) {
        // Direct login (MFA not enabled)
        onLogin(response.data.token, response.data.customer)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', {
        email,
        otp
      })

      if (response.data.success) {
        onLogin(response.data.token, response.data.customer)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/auth/resend-otp', {
        email,
        language
      })

      if (response.data.success) {
        setOtpExpiresIn(response.data.expiresIn)
        setCountdown(response.data.expiresIn * 60)
        setResendCooldown(60) // 60 second cooldown
        setOtp('')
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setMfaRequired(false)
    setOtp('')
    setError('')
    setCountdown(0)
  }

  const demoAccounts = [
    { email: 'ahmed@example.com', name: 'Ahmed (Warning - Bill Spike)', password: 'password123' },
    { email: 'fatima@example.com', name: 'Fatima (Excellent - Model Customer)', password: 'password123' },
    { email: 'mohammed@example.com', name: 'Mohammed (Good - Villa Owner)', password: 'password123' },
    { email: 'sara@example.com', name: 'Sara (Critical - Overdue)', password: 'password123' },
    { email: 'omar@example.com', name: 'Omar (Good - Commercial)', password: 'password123' },
    { email: 'layla@example.com', name: 'Layla (Excellent - Star Customer)', password: 'password123' }
  ]

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const features = [
    { icon: '🌐', nameEn: 'Bilingual UI', nameAr: 'واجهة ثنائية اللغة', descEn: 'English/Arabic with RTL support', descAr: 'إنجليزي/عربي مع دعم RTL' },
    { icon: '🔐', nameEn: 'MFA Security', nameAr: 'الأمان متعدد العوامل', descEn: 'Email OTP authentication', descAr: 'مصادقة OTP عبر البريد الإلكتروني' },
    { icon: '🤖', nameEn: 'AI-Powered', nameAr: 'مدعوم بالذكاء الاصطناعي', descEn: 'OpenAI predictions & insights', descAr: 'تنبؤات ورؤى OpenAI' },
    { icon: '👤', nameEn: 'Customer 360', nameAr: 'عرض 360 للعميل', descEn: 'Business partner & accounts', descAr: 'شريك الأعمال والحسابات' },
    { icon: '💬', nameEn: 'Multi-Channel', nameAr: 'متعدد القنوات', descEn: 'Web form & chat support', descAr: 'نموذج الويب ودعم الدردشة' },
    { icon: '🎯', nameEn: 'AI Guidance', nameAr: 'إرشادات الذكاء الاصطناعي', descEn: 'Smart request analysis', descAr: 'تحليل ذكي للطلبات' },
    { icon: '📊', nameEn: 'Cost Savings', nameAr: 'توفير التكاليف', descEn: 'Analytics & ROI tracking', descAr: 'تحليلات وتتبع العائد' },
    { icon: '🎫', nameEn: 'Ticket System', nameAr: 'نظام التذاكر', descEn: 'Track & manage requests', descAr: 'تتبع وإدارة الطلبات' }
  ]

  const successMetrics = [
    { labelEn: 'Features', labelAr: 'الميزات', value: '8/8', color: 'text-green-600' },
    { labelEn: 'AI Accuracy', labelAr: 'دقة الذكاء الاصطناعي', value: '95%', color: 'text-blue-600' },
    { labelEn: 'Cost Savings', labelAr: 'توفير التكاليف', value: 'AED 47K', color: 'text-dewa-green' },
    { labelEn: 'Customer Satisfaction', labelAr: 'رضا العملاء', value: '4.8/5', color: 'text-purple-600' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dewa-blue to-dewa-dark p-4">
      {/* Features Showcase Panel - Desktop Only */}
      <div className="hidden lg:block bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-sm mr-6 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="text-3xl">✨</span>
            {language === 'en' ? 'Platform Features' : 'ميزات المنصة'}
          </h2>
          <p className="text-white/80 text-sm">
            {language === 'en' ? 'AI-powered customer service excellence' : 'التميز في خدمة العملاء بالذكاء الاصطناعي'}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10 hover:bg-white/10 transition">
              <span className="text-2xl flex-shrink-0">{feature.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">
                  {language === 'en' ? feature.nameEn : feature.nameAr}
                </h3>
                <p className="text-xs text-white/70">
                  {language === 'en' ? feature.descEn : feature.descAr}
                </p>
              </div>
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Success Criteria */}
        <div className="pt-4 border-t border-white/20">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            {language === 'en' ? 'Success Metrics' : 'مقاييس النجاح'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {successMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <p className="text-xs text-white/70 mb-1">
                  {language === 'en' ? metric.labelEn : metric.labelAr}
                </p>
                <p className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <p className="font-bold text-sm">
              {language === 'en' ? 'Implementation Complete' : 'اكتمال التنفيذ'}
            </p>
          </div>
          <p className="text-xs text-white/80">
            {language === 'en' 
              ? 'All features successfully deployed and tested' 
              : 'تم نشر واختبار جميع الميزات بنجاح'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Mobile Features Toggle Button */}
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="lg:hidden w-full mb-4 px-4 py-2 bg-gradient-to-r from-dewa-green to-green-600 text-white rounded-lg flex items-center justify-between hover:shadow-lg transition"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-semibold">
              {language === 'en' ? 'View Platform Features' : 'عرض ميزات المنصة'}
            </span>
          </span>
          <svg 
            className={`w-5 h-5 transition-transform ${showFeatures ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Features Panel */}
        {showFeatures && (
          <div className="lg:hidden mb-6 p-4 bg-gradient-to-br from-dewa-blue/5 to-dewa-dark/5 rounded-xl border border-dewa-blue/20">
            <div className="space-y-2 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="font-medium text-gray-800">
                    {language === 'en' ? feature.nameEn : feature.nameAr}
                  </span>
                  <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200">
              {successMetrics.map((metric, index) => (
                <div key={index} className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    {language === 'en' ? metric.labelEn : metric.labelAr}
                  </p>
                  <p className={`text-sm font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-dewa-green rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">D</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-dewa-dark mb-2">
          {t('header.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('header.subtitle')}
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-600">
          <svg className="w-5 h-5 text-dewa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{language === 'en' ? 'Secured with MFA' : 'محمي بالمصادقة متعددة العوامل'}</span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!mfaRequired ? (
          // Step 1: Email & Password
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? t('loading') : t('buttons.signin')}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                {language === 'en' ? 'Demo Accounts:' : 'حسابات تجريبية:'}
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      setEmail(account.email)
                      setPassword(account.password)
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition"
                  >
                    <div className="font-medium text-gray-900">{account.name}</div>
                    <div className="text-gray-500 text-xs flex justify-between">
                      <span>{account.email}</span>
                      <span className="text-dewa-green">pw: {account.password}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Step 2: OTP Verification
          <>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dewa-green/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-dewa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Verify Your Identity' : 'تحقق من هويتك'}
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? `We've sent a 6-digit code to ${email}` 
                  : `لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى ${email}`}
              </p>
              {countdown > 0 && (
                <p className="text-sm text-dewa-green font-medium mt-2">
                  {language === 'en' ? 'Code expires in' : 'ينتهي الرمز خلال'}: {formatTime(countdown)}
                </p>
              )}
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Enter 6-digit code' : 'أدخل الرمز المكون من 6 أرقام'}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? t('loading') : (language === 'en' ? 'Verify & Sign In' : 'تحقق وسجل الدخول')}
              </button>
            </form>

            {/* Resend & Back buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="w-full text-sm text-dewa-green hover:text-green-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `${language === 'en' ? 'Resend in' : 'إعادة الإرسال خلال'} ${resendCooldown}s`
                  : (language === 'en' ? 'Resend Code' : 'إعادة إرسال الرمز')}
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                {language === 'en' ? '← Back to Login' : '→ العودة إلى تسجيل الدخول'}
              </button>
            </div>

            {/* Console reminder */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                {language === 'en' 
                  ? '💡 Demo Mode: Check your browser console for the OTP code' 
                  : '💡 وضع التجريبي: تحقق من وحدة التحكم في متصفحك للحصول على رمز OTP'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

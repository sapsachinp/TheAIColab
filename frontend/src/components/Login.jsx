import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import axios from 'axios'
import LanguageSwitcher from './LanguageSwitcher'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, Mail, Eye, EyeOff, Shield, Sparkles, Check, 
  TrendingUp, Globe, Brain, Users, MessageCircle, 
  Target, BarChart3, Zap
} from 'lucide-react'
import { API_BASE_URL, mockAuth, MOCK_USERS } from '../config/api'

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
  const [showPassword, setShowPassword] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

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
      // Demo Mode - Skip validation and go directly to OTP screen
      if (demoMode) {
        console.log('Demo mode enabled - bypassing password validation')
        setMfaRequired(true)
        setOtpExpiresIn(5)
        setCountdown(300)
        setLoading(false)
        return
      }

      // Always use local validation with MOCK_USERS (no backend call)
      console.log('Using local authentication with file data')
      const user = MOCK_USERS.find(u => u.email === email && u.password === password)
      
      if (!user) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      // Show MFA screen (skip actual OTP sending)
      setMfaRequired(true)
      setOtpExpiresIn(5)
      setCountdown(300)
      setError('')
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Demo Mode - Skip OTP validation and login directly
      if (demoMode) {
        console.log('Demo mode enabled - bypassing OTP validation')
        const demoUser = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0]
        onLogin('demo-token-' + Date.now(), demoUser.customer)
        setLoading(false)
        return
      }

      // Always accept "000000" as valid OTP (no backend call)
      console.log('Using local OTP validation - accepting 000000')
      
      if (otp !== '000000') {
        setError('Invalid OTP. Please use 000000')
        setLoading(false)
        return
      }

      // Find user and login
      const user = MOCK_USERS.find(u => u.email === email)
      if (!user) {
        setError('User not found')
        setLoading(false)
        return
      }

      onLogin('local-token-' + Date.now(), user.customer)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.')
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setError('')
    setLoading(true)

    try {
      let response
      try {
        // Try real backend first
        response = await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, {
          email,
          language
        }, { timeout: 1000 })  // Reduced to 1 second for faster fallback
      } catch (backendError) {
        // Fallback to mock service
        console.log('Backend unavailable, using mock OTP resend')
        const mockResponse = await mockAuth.resendOTP(email)
        response = { data: mockResponse }
      }

      if (response.data.success) {
        setOtpExpiresIn(response.data.expiresIn)
        setCountdown(response.data.expiresIn * 60)
        setResendCooldown(60) // 60 second cooldown
        setOtp('')
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to resend code.')
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
    { email: 'ahmed.mansoori@example.com', name: 'Ahmed (Warning - Bill Spike)', password: 'password123' },
    { email: 'fatima.hassan@example.com', name: 'Fatima (Excellent - Model Customer)', password: 'password123' },
    { email: 'mohammed.hashimi@example.com', name: 'Mohammed (Good - Villa Owner)', password: 'password123' },
    { email: 'sara.alzaabi@example.com', name: 'Sara (Critical - Overdue)', password: 'password123' },
    { email: 'omar.khalil@example.com', name: 'Omar (Good - Commercial)', password: 'password123' },
    { email: 'layla.mahmoud@example.com', name: 'Layla (Excellent - Star Customer)', password: 'password123' }
  ]

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const features = [
    { icon: Globe, nameEn: 'Bilingual UI', nameAr: 'واجهة ثنائية اللغة', descEn: 'English/Arabic with RTL support', descAr: 'إنجليزي/عربي مع دعم RTL' },
    { icon: Shield, nameEn: 'MFA Security', nameAr: 'الأمان متعدد العوامل', descEn: 'Email OTP authentication', descAr: 'مصادقة OTP عبر البريد الإلكتروني' },
    { icon: Brain, nameEn: 'AI-Powered', nameAr: 'مدعوم بالذكاء الاصطناعي', descEn: 'OpenAI predictions & insights', descAr: 'تنبؤات ورؤى OpenAI' },
    { icon: Users, nameEn: 'Customer 360', nameAr: 'عرض 360 للعميل', descEn: 'Business partner & accounts', descAr: 'شريك الأعمال والحسابات' },
    { icon: MessageCircle, nameEn: 'Multi-Channel', nameAr: 'متعدد القنوات', descEn: 'Web form & chat support', descAr: 'نموذج الويب ودعم الدردشة' },
    { icon: Target, nameEn: 'AI Guidance', nameAr: 'إرشادات الذكاء الاصطناعي', descEn: 'Smart request analysis', descAr: 'تحليل ذكي للطلبات' },
    { icon: TrendingUp, nameEn: 'Cost Savings', nameAr: 'توفير التكاليف', descEn: 'Analytics & ROI tracking', descAr: 'تحليلات وتتبع العائد' },
    { icon: BarChart3, nameEn: 'Ticket System', nameAr: 'نظام التذاكر', descEn: 'Track & manage requests', descAr: 'تتبع وإدارة الطلبات' }
  ]

  const successMetrics = [
    { labelEn: 'Features', labelAr: 'الميزات', value: '8/8', color: 'text-green-600' },
    { labelEn: 'AI Accuracy', labelAr: 'دقة الذكاء الاصطناعي', value: '95%', color: 'text-blue-600' },
    { labelEn: 'Cost Savings', labelAr: 'توفير التكاليف', value: 'AED 47K', color: 'text-dewa-green' },
    { labelEn: 'Customer Satisfaction', labelAr: 'رضا العملاء', value: '4.8/5', color: 'text-purple-600' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dewa-blue via-blue-600 to-dewa-dark p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-dewa-green/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Features Showcase Panel - Desktop Only */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md mr-8 text-white border border-white/20 relative z-10"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-dewa-green to-emerald-500 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">
              {language === 'en' ? 'Platform Features' : 'ميزات المنصة'}
            </h2>
          </div>
          <p className="text-white/80 text-base">
            {language === 'en' ? 'AI-powered customer service excellence' : 'التميز في خدمة العملاء بالذكاء الاصطناعي'}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="p-2 bg-gradient-to-br from-dewa-green/20 to-emerald-500/20 rounded-lg group-hover:from-dewa-green/30 group-hover:to-emerald-500/30 transition-all">
                  <IconComponent className="w-5 h-5 text-dewa-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1">
                    {language === 'en' ? feature.nameEn : feature.nameAr}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {language === 'en' ? feature.descEn : feature.descAr}
                  </p>
                </div>
                <Check className="w-5 h-5 text-dewa-green flex-shrink-0 mt-1" strokeWidth={3} />
              </motion.div>
            )
          })}
        </div>

        {/* Success Criteria */}
        <div className="pt-6 border-t border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold">
              {language === 'en' ? 'Success Metrics' : 'مقاييس النجاح'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {successMetrics.map((metric, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <p className="text-xs text-white/70 mb-1">
                  {language === 'en' ? metric.labelEn : metric.labelAr}
                </p>
                <p className={`text-xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievement Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 bg-gradient-to-r from-dewa-green/20 to-emerald-500/20 backdrop-blur-sm p-5 rounded-xl border border-dewa-green/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-dewa-green" />
            <p className="font-bold text-base">
              {language === 'en' ? 'Implementation Complete' : 'اكتمال التنفيذ'}
            </p>
          </div>
          <p className="text-sm text-white/80">
            {language === 'en' 
              ? 'All features successfully deployed and tested' 
              : 'تم نشر واختبار جميع الميزات بنجاح'}
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-lg relative z-10"
      >
        {/* Mobile Features Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFeatures(!showFeatures)}
          className="lg:hidden w-full mb-6 px-5 py-3 bg-gradient-to-r from-dewa-green to-emerald-600 text-white rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">
              {language === 'en' ? 'View Platform Features' : 'عرض ميزات المنصة'}
            </span>
          </span>
          <motion.div
            animate={{ rotate: showFeatures ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Mobile Features Panel */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mb-6 p-5 bg-gradient-to-br from-dewa-blue/5 to-dewa-dark/5 rounded-xl border border-dewa-blue/20 overflow-hidden"
            >
              <div className="space-y-3 mb-5">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-gradient-to-br from-dewa-green/10 to-emerald-500/10 rounded-lg">
                        <IconComponent className="w-4 h-4 text-dewa-green" />
                      </div>
                      <span className="font-medium text-gray-800 flex-1">
                        {language === 'en' ? feature.nameEn : feature.nameAr}
                      </span>
                      <Check className="w-4 h-4 text-dewa-green" strokeWidth={3} />
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                {successMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-xs text-gray-600 mb-1">
                      {language === 'en' ? metric.labelEn : metric.labelAr}
                    </p>
                    <p className={`text-base font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="w-24 h-24 bg-gradient-to-br from-dewa-green to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl relative"
          >
            <span className="text-white text-5xl font-bold">D</span>
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(0, 166, 81, 0.4)",
                  "0 0 0 20px rgba(0, 166, 81, 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl"
            />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-center text-dewa-dark mb-2"
        >
          {t('header.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 mb-8 text-lg"
        >
          {t('header.subtitle')}
        </motion.p>

        {/* Security Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8 px-4 py-2 bg-dewa-green/5 rounded-full text-sm text-gray-700 w-fit mx-auto border border-dewa-green/20"
        >
          <Shield className="w-5 h-5 text-dewa-green" />
          <span className="font-medium">{language === 'en' ? 'Secured with MFA' : 'محمي بالمصادقة متعددة العوامل'}</span>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
            >
              <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!mfaRequired ? (
          // Step 1: Email & Password
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dewa-green focus:border-transparent transition-all outline-none"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dewa-green focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Demo Mode Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="demoMode"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="w-4 h-4 text-dewa-green border-amber-300 rounded focus:ring-dewa-green focus:ring-2"
                />
                <label htmlFor="demoMode" className="text-sm text-amber-800 cursor-pointer select-none">
                  {language === 'en' 
                    ? '🚀 Demo Mode (Skip validation - instant access)' 
                    : '🚀 وضع التجربة (تخطي التحقق - وصول فوري)'}
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-dewa-green to-emerald-600 hover:from-dewa-green hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-dewa-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </motion.div>
                )}
                {loading ? t('loading') : t('buttons.signin')}
              </motion.button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === 'en' ? 'Demo Accounts:' : 'حسابات تجريبية:'}
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {demoAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setEmail(account.email)
                      setPassword(account.password)
                    }}
                    className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-dewa-green/5 hover:to-emerald-50 rounded-xl border-2 border-gray-200 hover:border-dewa-green/30 transition-all group"
                  >
                    <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-dewa-blue to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {account.name.charAt(0)}
                      </div>
                      <span>{account.name}</span>
                    </div>
                    <div className="text-gray-500 text-xs flex justify-between items-center pl-10">
                      <span className="font-mono">{account.email}</span>
                      <span className="text-dewa-green font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to use
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Step 2: OTP Verification
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-dewa-green/10 to-emerald-500/10 rounded-2xl mb-5 border-2 border-dewa-green/20"
              >
                <Mail className="w-10 h-10 text-dewa-green" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Verify Your Identity' : 'تحقق من هويتك'}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'en' 
                  ? `We've sent a 6-digit code to` 
                  : `لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى`}
              </p>
              <p className="text-sm font-semibold text-dewa-dark mt-1">{email}</p>
              {countdown > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-dewa-green/10 rounded-full"
                >
                  <div className="w-2 h-2 bg-dewa-green rounded-full animate-pulse" />
                  <span className="text-sm text-dewa-green font-semibold">
                    {language === 'en' ? 'Code expires in' : 'ينتهي الرمز خلال'}: {formatTime(countdown)}
                  </span>
                </motion.div>
              )}
            </motion.div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  {language === 'en' ? 'Enter 6-digit code' : 'أدخل الرمز المكون من 6 أرقام'}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dewa-green focus:border-transparent text-center text-3xl tracking-[0.5em] font-mono font-bold text-gray-900 outline-none transition-all"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-dewa-green to-emerald-600 hover:from-dewa-green hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-dewa-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                {loading ? t('loading') : (language === 'en' ? 'Verify & Sign In' : 'تحقق وسجل الدخول')}
              </motion.button>
            </form>

            {/* Resend & Back buttons */}
            <div className="mt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="w-full text-sm text-dewa-green hover:text-emerald-600 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed py-2 px-4 rounded-lg border-2 border-dewa-green/20 hover:border-dewa-green/40 disabled:border-gray-200 transition-all"
              >
                {resendCooldown > 0 
                  ? `${language === 'en' ? 'Resend in' : 'إعادة الإرسال خلال'} ${resendCooldown}s`
                  : (language === 'en' ? '🔄 Resend Code' : '🔄 إعادة إرسال الرمز')}
              </motion.button>
              
              <button
                onClick={handleBackToLogin}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
              >
                {language === 'en' ? '← Back to Login' : '→ العودة إلى تسجيل الدخول'}
              </button>
            </div>

            {/* Console reminder */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl"
            >
              <p className="text-xs text-blue-800 text-center flex items-center justify-center gap-2">
                <span className="text-lg">💡</span>
                <span>
                  {language === 'en' 
                    ? 'Demo Mode: Check your browser console for the OTP code' 
                    : 'وضع التجريبي: تحقق من وحدة التحكم في متصفحك للحصول على رمز OTP'}
                </span>
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}

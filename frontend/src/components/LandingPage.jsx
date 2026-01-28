import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Zap, MessageSquare, Brain, TrendingUp, Shield, Clock,
  BarChart3, Users, CheckCircle, ArrowRight, Sparkles,
  Target, Headphones, Globe, Award, Bot
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI analyzes customer queries with 95% accuracy, providing instant, personalized responses.',
      color: 'from-purple-500 to-indigo-600',
      stats: '95% Accuracy'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Conversational Support',
      description: 'Natural language processing enables human-like conversations in English and Arabic.',
      color: 'from-blue-500 to-cyan-600',
      stats: '24/7 Available'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Proactive Guidance',
      description: 'Predictive analytics identify issues before they escalate, reducing ticket volume by 40%.',
      color: 'from-green-500 to-emerald-600',
      stats: '40% Deflection'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboard tracks performance metrics and customer satisfaction in real-time.',
      color: 'from-orange-500 to-red-600',
      stats: 'Live Insights'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with multi-factor authentication and data encryption.',
      color: 'from-red-500 to-pink-600',
      stats: 'Bank-Level Security'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Cost Efficiency',
      description: 'Reduce support costs by up to 60% while improving customer satisfaction.',
      color: 'from-yellow-500 to-orange-600',
      stats: '60% Savings'
    }
  ]

  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'First Contact Resolution: 70% FCR rate'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Multi-Language Support: English & Arabic'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Voice & Text: Seamless interaction modes'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Smart Ticket Management: Automated routing'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Bill Prediction: AI-powered forecasting'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Customer 360°: Complete profile view'
    }
  ]

  const stats = [
    { value: '95%', label: 'AI Accuracy', icon: <Target className="w-8 h-8" /> },
    { value: '70%', label: 'FCR Rate', icon: <Headphones className="w-8 h-8" /> },
    { value: '24/7', label: 'Availability', icon: <Globe className="w-8 h-8" /> },
    { value: '60%', label: 'Cost Savings', icon: <Award className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-green-500/20 rounded-full blur-3xl top-1/2 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl"
              >
                D
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">DEWA AI Support</h1>
                <p className="text-sm text-blue-200">Next-Generation Customer Experience</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-medium border border-white/20 transition-all"
            >
              Sign In
            </motion.button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-full mb-8 border border-white/20"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Powered by Advanced AI & Machine Learning</span>
            </motion.div>

            <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent leading-tight">
              Transform Customer Support
              <br />
              <span className="text-5xl md:text-6xl">with AI Intelligence</span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of customer service with our AI-powered platform.
              Reduce costs by 60%, improve satisfaction, and deliver exceptional support 24/7.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 255, 100, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="group px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-lg font-bold shadow-2xl transition-all inline-flex items-center gap-3"
            >
              <Bot className="w-6 h-6" />
              Try AI Support Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="text-sm text-blue-200 mt-4">
              No credit card required • Free demo available
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all"
              >
                <div className="flex justify-center mb-3 text-green-400">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support at scale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-blue-100 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center mb-12"
            >
              <h3 className="text-4xl font-bold mb-4">Key Benefits</h3>
              <p className="text-lg text-blue-200">
                Delivered through our comprehensive AI-powered platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="text-green-400 flex-shrink-0 mt-1">
                    {benefit.icon}
                  </div>
                  <p className="text-blue-50">{benefit.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-16 border border-white/20 text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl"
              >
                <Users className="w-10 h-10" />
              </motion.div>
            </div>
            <h3 className="text-5xl font-bold mb-6">Ready to Experience AI Support?</h3>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join leading organizations using AI to transform customer experience.
              Start your journey today with our comprehensive demo.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0, 255, 100, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="group px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-xl font-bold shadow-2xl transition-all inline-flex items-center gap-4"
            >
              <Sparkles className="w-6 h-6" />
              Launch Demo Experience
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            <p className="text-sm text-blue-200 mt-6">
              ✓ Full feature access • ✓ No installation required • ✓ Instant setup
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center font-bold shadow-lg">
                D
              </div>
              <div>
                <p className="text-sm font-medium">DEWA AI Support Platform</p>
                <p className="text-xs text-blue-200">© 2026 Dubai Electricity & Water Authority</p>
              </div>
            </div>
            <p className="text-sm text-blue-200">
              Powered by Advanced AI • Secure • Scalable
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import { motion } from 'framer-motion'
import { 
  User, FileText, Zap, AlertCircle, TrendingUp, Brain,
  CreditCard, Award, BarChart3,
  MessageSquare, FileCheck, Activity, Shield,
  Home, PhoneOff, Receipt, DollarSign, AlertTriangle, CheckCircle, Bell
} from 'lucide-react'
import { API_BASE_URL, mockData } from '../config/api'

export default function CustomerSummary({ customer }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSummary()
  }, [customer])

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token')
      let response
      
      try {
        // Try real backend first with 3 second timeout
        response = await axios.get(
          `${API_BASE_URL}/api/customer/summary/${customer.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000  // 3 seconds to get real AI data
          }
        )
        console.log('✅ Loaded real data from backend')
      } catch (backendError) {
        // Fallback to mock data
        console.log('⚠️ Backend unavailable, using mock customer data')
        const mockResponse = await mockData.getCustomerSummary(customer.id)
        response = { data: mockResponse }
      }

      setSummary(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error loading summary:', err)
      setError('Failed to load summary: ' + (err.message || 'Unknown error'))
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dewa-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  const { customer: customerData, aiInsights } = summary

  const getHealthColor = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      critical: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || colors.warning
  }

  const getHealthIcon = (status) => {
    const icons = {
      excellent: '🌟',
      good: '✅',
      warning: '⚠️',
      critical: '🚨'
    }
    return icons[status] || '📊'
  }

  const getHealthLabel = (status) => {
    const labels = {
      excellent: 'Excellent',
      good: 'Good',
      warning: 'Needs Attention',
      critical: 'Critical'
    }
    return labels[status] || status
  }

  // Generate timeline data for last 6 months
  const generateTimelineData = () => {
    const months = []
    const today = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      
      months.push({
        month: monthName,
        year: year,
        fullDate: date,
        events: []
      })
    }
    
    // Add sample events (in real app, this would come from customer data)
    const eventTypes = [
      { type: 'invoice', label: 'Invoice', icon: Receipt, color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-600' },
      { type: 'payment', label: 'Payment', icon: CheckCircle, color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-600' },
      { type: 'reminder', label: 'Reminder', icon: Bell, color: 'bg-amber-500', lightColor: 'bg-amber-100', textColor: 'text-amber-600' },
      { type: 'fine', label: 'Fine', icon: AlertTriangle, color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-600' },
      { type: 'move_in', label: 'Move In', icon: Home, color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-600' },
      { type: 'disconnection', label: 'Disconnect', icon: PhoneOff, color: 'bg-orange-500', lightColor: 'bg-orange-100', textColor: 'text-orange-600' }
    ]
    
    // Add events to months
    months[0].events.push({ ...eventTypes[4], date: 5 }) // Move in
    months[1].events.push({ ...eventTypes[0], date: 1 }) // Invoice
    months[1].events.push({ ...eventTypes[1], date: 10 }) // Payment
    months[2].events.push({ ...eventTypes[0], date: 1 }) // Invoice
    months[2].events.push({ ...eventTypes[2], date: 5 }) // Reminder
    months[2].events.push({ ...eventTypes[1], date: 8 }) // Payment
    months[3].events.push({ ...eventTypes[0], date: 1 }) // Invoice
    months[3].events.push({ ...eventTypes[3], date: 15 }) // Fine
    months[3].events.push({ ...eventTypes[1], date: 18 }) // Payment
    months[4].events.push({ ...eventTypes[0], date: 1 }) // Invoice
    months[4].events.push({ ...eventTypes[2], date: 3 }) // Reminder
    months[4].events.push({ ...eventTypes[1], date: 5 }) // Payment
    months[5].events.push({ ...eventTypes[0], date: 1 }) // Invoice
    months[5].events.push({ ...eventTypes[2], date: 8 }) // Reminder
    
    return months
  }

  const timelineData = generateTimelineData()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <Link
          to="/summary"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Activity className="w-5 h-5" />
          Summary
        </Link>
        <Link
          to="/request"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <FileCheck className="w-5 h-5" />
          New Request
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <MessageSquare className="w-5 h-5" />
          Chat Support
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <BarChart3 className="w-5 h-5" />
          Analytics
        </Link>
      </motion.div>

      {/* AI Predictions & Account Behavior - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold">AI-Powered Account Intelligence</h2>
              <p className="text-purple-100">Predictive insights for smarter decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Next Month Prediction */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Next Month Prediction</p>
                  <p className="text-xs text-purple-200">AI Confidence: {((aiInsights?.billPrediction?.confidence || 0.85) * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">
                AED {aiInsights?.billPrediction?.predicted || customerData.predictedBill}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (aiInsights?.billPrediction?.trend || 'stable') === 'increasing' 
                    ? 'bg-red-400/30 text-red-100' 
                    : (aiInsights?.billPrediction?.trend || 'stable') === 'decreasing'
                    ? 'bg-green-400/30 text-green-100'
                    : 'bg-blue-400/30 text-blue-100'
                }`}>
                  {(aiInsights?.billPrediction?.trend || 'stable') === 'increasing' && '↗'}
                  {(aiInsights?.billPrediction?.trend || 'stable') === 'decreasing' && '↘'}
                  {(aiInsights?.billPrediction?.trend || 'stable') === 'stable' && '→'}
                  {' '}{(aiInsights?.billPrediction?.trend || 'stable').charAt(0).toUpperCase() + (aiInsights?.billPrediction?.trend || 'stable').slice(1)}
                </span>
              </div>
              <p className="text-sm text-purple-100 mt-2">vs Last: AED {customerData.lastBill}</p>
            </motion.div>

            {/* Account Behavior Analysis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Consumption Behavior</p>
                  <p className="text-xs text-purple-200">AI Analysis</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-purple-100 mb-1">Trend</p>
                  <p className="text-2xl font-bold capitalize">
                    {aiInsights?.consumptionAnalysis?.trend || 'Stable'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-100 mb-1">Variance</p>
                  <p className={`text-2xl font-bold ${
                    Math.abs(aiInsights?.consumptionAnalysis?.variance || 0) > 15 
                      ? 'text-red-300' 
                      : 'text-green-300'
                  }`}>
                    {aiInsights?.consumptionAnalysis?.variance > 0 ? '+' : ''}{aiInsights?.consumptionAnalysis?.variance || 0}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Key Decision Factors */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Account Health</p>
                  <p className="text-xs text-purple-200">Status Score</p>
                </div>
              </div>
              <div className="text-5xl font-bold mb-3">
                {customerData.accountHealth?.score || 85}
                <span className="text-2xl text-purple-200">/100</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${customerData.accountHealth?.score || 85}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${
                    (customerData.accountHealth?.score || 85) >= 80 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : (customerData.accountHealth?.score || 85) >= 60
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-red-400 to-rose-500'
                  }`}
                />
              </div>
              <p className="text-sm text-purple-100 mt-3 capitalize">
                {getHealthLabel(customerData.accountHealth?.status || 'good')}
              </p>
            </motion.div>
          </div>

          {/* AI Insights Summary */}
          {aiInsights?.consumptionAnalysis?.reason && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-2xl p-5 border border-yellow-300/30"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-400/30 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-100" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">💡 AI Account Behavior Summary</h4>
                  <p className="text-purple-50 leading-relaxed">
                    {aiInsights.consumptionAnalysis.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Customer 360 Information */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-dewa-blue via-blue-600 to-blue-700 text-white rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-dewa-green to-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
              >
                {customerData.name.charAt(0)}
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome, {customerData.name}</h1>
                <div className="flex items-center gap-2 text-blue-100">
                  <User className="w-4 h-4" />
                  <p className="text-sm">Business Partner: {customerData.businessPartnerName || customerData.businessPartner || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Customer ID</p>
              <p className="text-2xl font-bold">{customerData.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Contract Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Contract Accounts</p>
                  <p className="text-3xl font-bold">{customerData.contractAccounts?.length || 1}</p>
                </div>
              </div>
            </motion.div>

            {/* Total Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Active Services</p>
                  <p className="text-3xl font-bold">
                    {customerData.contractAccounts?.reduce((total, acc) => total + (acc.services?.length || 0), 0) || 2}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Open Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-red-500/30 to-rose-500/30 rounded-lg group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Open Requests</p>
                  <p className="text-3xl font-bold">{customerData.openComplaints?.length || 0}</p>
                </div>
              </div>
            </motion.div>

            {/* Outstanding Dues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-gradient-to-br rounded-lg group-hover:scale-110 transition-transform ${
                  (customerData.totalOutstandingDues || 0) > 0 
                    ? 'from-amber-500/30 to-yellow-500/30' 
                    : 'from-green-500/30 to-emerald-500/30'
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Total Dues</p>
                  <p className={`text-3xl font-bold ${(customerData.totalOutstandingDues || 0) > 0 ? 'text-yellow-300' : ''}`}>
                    AED {(customerData.totalOutstandingDues || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        {/* Contract Accounts Detail */}
        {customerData.contractAccounts && customerData.contractAccounts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-3 text-blue-100">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customerData.contractAccounts.map((account, idx) => (
                <div key={idx} className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{account.accountNumber}</p>
                      <p className="text-xs text-blue-100">{account.address}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500 bg-opacity-50 rounded text-xs">
                        {account.accountType}
                      </span>
                    </div>
                    {account.outstandingAmount > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-yellow-300">Outstanding</p>
                        <p className="text-sm font-bold text-yellow-300">AED {account.outstandingAmount.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {account.services?.map((service, sidx) => (
                      <span key={sidx} className="px-2 py-0.5 bg-green-500 bg-opacity-40 rounded text-xs flex items-center gap-1">
                        {service.type === 'Electricity' && '⚡'}
                        {service.type === 'Water' && '💧'}
                        {service.type === 'Sewerage' && '🚿'}
                        {service.type === 'District Cooling' && '❄️'}
                        {service.type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Open Requests Summary */}
        {customerData.openComplaints && customerData.openComplaints.length > 0 && (
          <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
            <h3 className="text-sm font-semibold mb-3 text-blue-100 flex items-center gap-2">
              <span>📌</span> Active Requests
            </h3>
            <div className="space-y-2">
              {customerData.openComplaints.map((complaint, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{complaint.ticketId}: {complaint.subject}</p>
                    {complaint.accountNumber && (
                      <p className="text-xs text-blue-200">Account: {complaint.accountNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      complaint.status === 'Open' ? 'bg-yellow-500 bg-opacity-50' :
                      complaint.status === 'Pending' ? 'bg-orange-500 bg-opacity-50' :
                      'bg-green-500 bg-opacity-50'
                    }`}>
                      {complaint.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      complaint.priority === 'High' ? 'bg-red-500 bg-opacity-50' :
                      complaint.priority === 'Medium' ? 'bg-orange-400 bg-opacity-50' :
                      'bg-blue-500 bg-opacity-50'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </motion.div>

      {/* Account Health Score */}
      {customerData.accountHealth && (
        <div className={`mb-6 border-2 rounded-xl p-6 ${getHealthColor(customerData.accountHealth.status)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-4xl mr-3">{getHealthIcon(customerData.accountHealth.status)}</span>
              <div>
                <h2 className="text-2xl font-bold">
                  Account Health: {getHealthLabel(customerData.accountHealth.status)}
                </h2>
                <p className="text-sm opacity-80">Score: {customerData.accountHealth.score}/100</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{customerData.accountHealth.score}</div>
              <div className="w-32 h-2 bg-white bg-opacity-30 rounded-full mt-2">
                <div 
                  className="h-full bg-current rounded-full transition-all"
                  style={{ width: `${customerData.accountHealth.score}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {customerData.accountHealth.reasons && customerData.accountHealth.reasons.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold text-sm mb-2">Key factors:</p>
              <div className="flex flex-wrap gap-2">
                {customerData.accountHealth.reasons.map((reason, index) => (
                  <span key={index} className="px-3 py-1 bg-white bg-opacity-40 rounded-full text-sm">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Events Timeline - Last 6 Months */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-dewa-green to-emerald-600 rounded-xl">
                <Activity className="w-7 h-7 text-white" />
              </div>
              Customer Events Timeline
            </h2>
            <p className="text-sm text-gray-600 mt-2 ml-14">Track your account activity over the last 6 months</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-700 font-medium">Invoice</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 font-medium">Payment</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-700 font-medium">Reminder</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span className="text-red-700 font-medium">Fine</span>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative px-4">
          {/* Horizontal main line with gradient */}
          <div className="absolute top-[52px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dewa-green to-transparent opacity-40"></div>
          <div className="absolute top-[52px] left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-dewa-green to-gray-300"></div>
          
          {/* Month markers and events */}
          <div className="relative flex justify-between items-start">
            {timelineData.map((monthData, index) => (
              <div key={index} className="flex-1 flex flex-col items-center relative">
                {/* Month label at top */}
                <div className="text-center mb-4 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm font-bold text-gray-800">
                    {monthData.month}
                  </div>
                  <div className="text-xs text-gray-500">
                    '{String(monthData.year).slice(-2)}
                  </div>
                </div>

                {/* Main dot on timeline */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                  className={`w-5 h-5 rounded-full z-10 shadow-lg relative ${
                    monthData.events.length > 0 
                      ? 'bg-gradient-to-br from-dewa-green to-emerald-600 ring-4 ring-green-100' 
                      : 'bg-white border-4 border-gray-300'
                  }`}
                >
                  {monthData.events.length > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white text-white text-[8px] font-bold flex items-center justify-center"
                    >
                      {monthData.events.length}
                    </motion.div>
                  )}
                </motion.div>

                {/* Vertical line for events */}
                {monthData.events.length > 0 && (
                  <div className="w-px h-8 bg-gradient-to-b from-dewa-green to-transparent"></div>
                )}

                {/* Events for this month */}
                <div className="mt-2 space-y-2 min-h-[180px] w-full max-w-[120px]">
                  {monthData.events.map((event, eventIndex) => {
                    const EventIcon = event.icon
                    return (
                      <motion.div
                        key={eventIndex}
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.3 + (index * 0.08) + (eventIndex * 0.05),
                          type: "spring",
                          stiffness: 150
                        }}
                        className="relative group"
                      >
                        {/* Connector line from timeline to event */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 ${event.color} opacity-20 -top-2`} style={{ height: '8px' }}></div>
                        
                        {/* Event card - cleaner design like reference */}
                        <div className={`${event.lightColor} border-2 ${event.color.replace('bg-', 'border-')} rounded-xl p-2.5 shadow-md hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden`}>
                          {/* Background pattern */}
                          <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                            <EventIcon className="w-full h-full" />
                          </div>
                          
                          <div className="flex items-center gap-2 mb-1 relative z-10">
                            <div className={`${event.color} p-1.5 rounded-lg shadow-sm`}>
                              <EventIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-bold ${event.textColor} truncate`}>
                                {event.label}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`text-[10px] ${event.textColor} opacity-75 font-medium ml-1`}>
                            {monthData.month} {event.date}
                          </div>
                          
                          {/* Hover tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                            {event.label} on {monthData.month} {event.date}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary stats with modern cards */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow"
            >
              <Receipt className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{timelineData.reduce((sum, m) => sum + m.events.filter(e => e.type === 'invoice').length, 0)}</div>
              <div className="text-xs text-blue-600 font-medium">Invoices</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="text-center bg-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow"
            >
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{timelineData.reduce((sum, m) => sum + m.events.filter(e => e.type === 'payment').length, 0)}</div>
              <div className="text-xs text-green-600 font-medium">Payments</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center bg-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-md transition-shadow"
            >
              <Bell className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-700">{timelineData.reduce((sum, m) => sum + m.events.filter(e => e.type === 'reminder').length, 0)}</div>
              <div className="text-xs text-amber-600 font-medium">Reminders</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="text-center bg-red-50 rounded-xl p-4 border border-red-200 hover:shadow-md transition-shadow"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{timelineData.reduce((sum, m) => sum + m.events.filter(e => e.type === 'fine').length, 0)}</div>
              <div className="text-xs text-red-600 font-medium">Fines</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center bg-purple-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow"
            >
              <Home className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{timelineData.reduce((sum, m) => sum + m.events.filter(e => e.type === 'move_in').length, 0)}</div>
              <div className="text-xs text-purple-600 font-medium">Move In</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="text-center bg-gradient-to-br from-dewa-green to-emerald-600 rounded-xl p-4 border border-green-300 hover:shadow-md transition-shadow text-white"
            >
              <Activity className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{timelineData.reduce((sum, m) => sum + m.events.length, 0)}</div>
              <div className="text-xs font-medium">Total Events</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bill Prediction */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-dewa-green">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Next Bill (Predicted)</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              AI Prediction
            </span>
          </div>
          <div className="text-4xl font-bold text-dewa-dark mb-2">
            AED {aiInsights?.billPrediction?.predicted || customerData.predictedBill}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Confidence: {((aiInsights?.billPrediction?.confidence || 0.8) * 100).toFixed(0)}%
            <br />
            Due: {new Date(customerData.billDueDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <span className="font-medium">Trend:</span>{' '}
              <span className={`capitalize ${
                (aiInsights?.billPrediction?.trend || 'stable') === 'increasing' ? 'text-red-600' :
                (aiInsights?.billPrediction?.trend || 'stable') === 'decreasing' ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {aiInsights?.billPrediction?.trend || 'stable'}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Last bill: AED {customerData.lastBill}
            </p>
            {customerData.paymentHistory && (
              <p className="text-xs text-gray-500 mt-1">
                Payment history: <span className="capitalize font-medium">{customerData.paymentHistory}</span>
              </p>
            )}
          </div>
        </div>

        {/* Consumption Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-dewa-blue">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Consumption Insights</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Trend</p>
              <p className="text-lg font-semibold capitalize">
                {aiInsights?.consumptionAnalysis?.trend || 'Stable'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Variance from Average</p>
              <p className={`text-lg font-semibold ${
                Math.abs(aiInsights?.consumptionAnalysis?.variance || 0) > 15 ? 'text-red-600' : 'text-green-600'
              }`}>
                {aiInsights?.consumptionAnalysis?.variance || 0}%
              </p>
            </div>
            {customerData.usagePatterns?.comparedToSimilar && (
              <div>
                <p className="text-sm text-gray-600">vs Similar Homes</p>
                <p className="text-sm font-semibold">
                  {customerData.usagePatterns.comparedToSimilar}
                </p>
              </div>
            )}
            {aiInsights?.consumptionAnalysis?.reason && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-medium text-yellow-800">
                  💡 {aiInsights.consumptionAnalysis.reason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Open Complaints */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Open Complaints</h3>
          {customerData.openComplaints.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No open complaints</p>
              <p className="text-sm text-green-600 mt-2">✓ All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {customerData.openComplaints.map((complaint) => (
                <div
                  key={complaint.ticketId}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-gray-500">
                      {complaint.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === 'Open'
                          ? 'bg-red-100 text-red-800'
                          : complaint.status === 'Resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {complaint.subject}
                  </p>
                  {complaint.subjectAr && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {complaint.subjectAr}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Historical Consumption Chart with Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Consumption Forecast</h3>
            <p className="text-sm text-gray-600">Historical data with AI-powered predictions</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-dewa-green"></div>
              <span className="text-gray-600">Actual Bill</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-dewa-blue"></div>
              <span className="text-gray-600">Actual Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-purple-500 border-t-2 border-dashed border-purple-500"></div>
              <span className="text-gray-600">AI Prediction</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={[
              ...(customerData.consumptionHistory || []),
              ...((customerData.consumptionHistory && customerData.consumptionHistory.length > 0) ? [{
                month: new Date(new Date(customerData.consumptionHistory[customerData.consumptionHistory.length - 1]?.month + '-01').setMonth(new Date(customerData.consumptionHistory[customerData.consumptionHistory.length - 1]?.month + '-01').getMonth() + 1)).toISOString().slice(0, 7),
                amount: Number.parseFloat(aiInsights?.billPrediction?.predicted || customerData.predictedBill),
                kwh: Math.round((Number.parseFloat(aiInsights?.billPrediction?.predicted || customerData.predictedBill) / 0.38) * 100) / 100,
                predicted: true
              }] : [])
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(month) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              yAxisId="left" 
              label={{ value: 'Bill Amount (AED)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Usage (kWh)', angle: 90, position: 'insideRight', style: { fill: '#6b7280' } }}
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                const isPredicted = props.payload.predicted
                return [
                  name === 'amount' 
                    ? `${isPredicted ? '(Predicted) ' : ''}AED ${value}` 
                    : `${isPredicted ? '(Predicted) ' : ''}${value} kWh`,
                  name === 'amount' ? 'Bill Amount' : 'kWh Usage'
                ]
              }}
              labelFormatter={(month) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="amount" 
              stroke="#00A651" 
              strokeWidth={3}
              name="Bill Amount"
              dot={(props) => {
                const { cx, cy, payload } = props
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={payload.predicted ? 6 : 5}
                    fill={payload.predicted ? '#8b5cf6' : '#00A651'}
                    stroke="white"
                    strokeWidth={2}
                  />
                )
              }}
              strokeDasharray={(entry) => entry?.predicted ? "8 8" : "0"}
              activeDot={{ r: 8, fill: '#00A651', stroke: 'white', strokeWidth: 2 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="kwh" 
              stroke="#0072BC" 
              strokeWidth={3}
              name="kWh Usage"
              dot={(props) => {
                const { cx, cy, payload } = props
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={payload.predicted ? 6 : 5}
                    fill={payload.predicted ? '#8b5cf6' : '#0072BC'}
                    stroke="white"
                    strokeWidth={2}
                  />
                )
              }}
              strokeDasharray={(entry) => entry?.predicted ? "8 8" : "0"}
              activeDot={{ r: 8, fill: '#0072BC', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Average Monthly Bill</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {customerData.consumptionHistory && customerData.consumptionHistory.length > 0 
                  ? (customerData.consumptionHistory.reduce((sum, item) => sum + item.amount, 0) / customerData.consumptionHistory.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Average Monthly Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {customerData.consumptionHistory && customerData.consumptionHistory.length > 0
                  ? Math.round(customerData.consumptionHistory.reduce((sum, item) => sum + item.kwh, 0) / customerData.consumptionHistory.length)
                  : 0} kWh
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Next Month Forecast</p>
              <p className="text-2xl font-bold text-purple-600">
                AED {aiInsights?.billPrediction?.predicted || customerData.predictedBill}
              </p>
              <p className="text-xs text-gray-500 mt-1">Dotted line in chart</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendations / Tips */}
      {customerData.accountHealth?.recommendations && customerData.accountHealth.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Personalized AI Tips for You
          </h3>
          <div className="space-y-3">
            {customerData.accountHealth.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm text-gray-800">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights from Backend */}
      {aiInsights?.recommendations && aiInsights.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            🤖 Additional AI Recommendations
          </h3>
          <div className="space-y-3">
            {aiInsights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-blue-100"
              >
                <div className="flex items-start">
                  <span
                    className={`px-2 py-1 text-xs rounded-full mr-3 ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <p className="text-sm text-gray-800">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/request"
          className="block bg-dewa-green hover:bg-green-600 text-white rounded-xl p-6 text-center transition"
        >
          <div className="text-3xl mb-2">📝</div>
          <h4 className="font-bold text-lg mb-1">Submit Request</h4>
          <p className="text-sm opacity-90">AI guidance before submitting</p>
        </Link>
        <Link
          to="/chat"
          className="block bg-dewa-blue hover:bg-blue-700 text-white rounded-xl p-6 text-center transition"
        >
          <div className="text-3xl mb-2">💬</div>
          <h4 className="font-bold text-lg mb-1">Chat with AI</h4>
          <p className="text-sm opacity-90">Voice & text support</p>
        </Link>
        <Link
          to="/payment"
          className="block bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-center transition"
        >
          <div className="text-3xl mb-2">💳</div>
          <h4 className="font-bold text-lg mb-1">Pay Bill Now</h4>
          <p className="text-sm opacity-90">Secure DEWA payment portal</p>
        </Link>
      </div>
    </div>
  )
}

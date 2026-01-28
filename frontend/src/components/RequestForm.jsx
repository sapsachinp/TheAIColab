import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

export default function RequestForm({ customer }) {
  const [requestType, setRequestType] = useState('')
  const [requestDetails, setRequestDetails] = useState('')
  const [guidance, setGuidance] = useState(null)
  const [requestExplanation, setRequestExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)
  const [existingRequests, setExistingRequests] = useState([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)
  const [confirmedProceed, setConfirmedProceed] = useState(false)

  const requestTypes = [
    { value: 'billing_inquiry', label: 'Billing Inquiry / High Bill', icon: '💰' },
    { value: 'service_outage', label: 'Service Outage', icon: '⚡' },
    { value: 'meter_reading', label: 'Meter Reading Issue', icon: '📊' },
    { value: 'payment', label: 'Payment Problem', icon: '💳' },
    { value: 'connection_request', label: 'New Connection', icon: '🔌' },
    { value: 'complaint', label: 'General Complaint', icon: '📝' }
  ]

  // Check for existing requests and generate AI explanation when request type changes
  useEffect(() => {
    if (requestType) {
      checkExistingRequests(requestType)
      generateRequestExplanation(requestType)
    } else {
      setRequestExplanation(null)
      setExistingRequests([])
      setShowDuplicateWarning(false)
      setConfirmedProceed(false)
    }
  }, [requestType])

  const checkExistingRequests = async (type) => {
    setCheckingDuplicates(true)
    try {
      const token = localStorage.getItem('token')
      // Fetch customer's open tickets
      const response = await axios.get(
        `http://localhost:3001/api/customer/summary/${customer.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const customerData = response.data.customer
      const openComplaints = customerData.openComplaints || []
      
      // Filter complaints matching the selected request type
      const matchingRequests = openComplaints.filter(complaint => {
        // Map complaint subjects to request types
        const subjectLower = (complaint.subject || '').toLowerCase()
        const typeLower = type.toLowerCase()
        
        if (typeLower.includes('billing') && subjectLower.includes('bill')) return true
        if (typeLower.includes('outage') && subjectLower.includes('outage')) return true
        if (typeLower.includes('meter') && subjectLower.includes('meter')) return true
        if (typeLower.includes('payment') && subjectLower.includes('payment')) return true
        if (typeLower.includes('connection') && subjectLower.includes('connection')) return true
        
        return false
      })

      if (matchingRequests.length > 0) {
        setExistingRequests(matchingRequests)
        setShowDuplicateWarning(true)
        setConfirmedProceed(false)
      } else {
        setExistingRequests([])
        setShowDuplicateWarning(false)
        setConfirmedProceed(true) // Auto-proceed if no duplicates
      }
    } catch (err) {
      console.error('Error checking existing requests:', err)
      setConfirmedProceed(true) // Allow proceeding on error
    } finally {
      setCheckingDuplicates(false)
    }
  }

  const handleConfirmProceed = () => {
    setConfirmedProceed(true)
    setShowDuplicateWarning(false)
  }

  const handleCancelProceed = () => {
    setRequestType('')
    setShowDuplicateWarning(false)
    setConfirmedProceed(false)
  }

  const generateRequestExplanation = async (type) => {
    setLoadingExplanation(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/api/proactive/explain-request',
        {
          customerId: customer.id,
          requestType: type
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setRequestExplanation(response.data.explanation)
    } catch (err) {
      console.error('Error getting explanation:', err)
      // Fallback to default explanation
      setRequestExplanation(getDefaultExplanation(type))
    } finally {
      setLoadingExplanation(false)
    }
  }

  const getDefaultExplanation = (type) => {
    const explanations = {
      billing_inquiry: {
        title: 'Understanding Your Bill',
        description: 'Billing inquiries typically arise from unexpected increases in consumption. We analyze your usage patterns, compare with historical data, and identify potential causes.',
        commonReasons: [
          'Seasonal changes (summer AC usage)',
          'New appliances or equipment',
          'Changes in occupancy or usage habits',
          'Possible meter reading errors'
        ],
        nextSteps: 'Our AI will review your consumption history and provide personalized insights.'
      },
      service_outage: {
        title: 'Service Disruption',
        description: 'Service outages require immediate attention. We check for planned maintenance, area-wide issues, and your account status to provide quick resolution.',
        commonReasons: [
          'Scheduled maintenance in your area',
          'Weather-related disruptions',
          'Equipment failure or overload',
          'Individual connection issues'
        ],
        nextSteps: 'We\'ll check current outage reports and prioritize your request accordingly.'
      },
      meter_reading: {
        title: 'Meter Reading Concerns',
        description: 'Meter reading issues can affect billing accuracy. We verify your meter data, check for anomalies, and ensure correct readings.',
        commonReasons: [
          'Meter accessibility issues',
          'Digital vs. analog reading differences',
          'Faulty meter equipment',
          'Timing of meter reading cycles'
        ],
        nextSteps: 'Our team will verify meter readings and schedule inspection if needed.'
      },
      payment: {
        title: 'Payment Processing',
        description: 'Payment problems can include failed transactions, duplicate charges, or account reconciliation issues.',
        commonReasons: [
          'Bank transaction delays',
          'Incorrect payment reference',
          'System processing time',
          'Outstanding balance confusion'
        ],
        nextSteps: 'We\'ll review your payment history and account status immediately.'
      },
      connection_request: {
        title: 'New Service Connection',
        description: 'New connection requests involve technical assessment, documentation verification, and scheduling installation.',
        commonReasons: [
          'New property or construction',
          'Service upgrade requirements',
          'Additional meter installation',
          'Temporary connection needs'
        ],
        nextSteps: 'Our team will guide you through documentation and schedule technical survey.'
      },
      complaint: {
        title: 'General Complaint',
        description: 'We take all complaints seriously and aim to resolve them promptly with appropriate escalation when needed.',
        commonReasons: [
          'Service quality concerns',
          'Staff interaction issues',
          'Delayed response times',
          'Policy or procedure questions'
        ],
        nextSteps: 'Your complaint will be logged and assigned to appropriate team for resolution.'
      }
    }
    return explanations[type] || null
  }

  const handleGetGuidance = async () => {
    if (!requestType) {
      alert('Please select a request type')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/api/proactive/guidance',
        {
          customerId: customer.id,
          requestType,
          requestDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setGuidance(response.data.guidance)
    } catch (err) {
      console.error('Error getting guidance:', err)
      alert('Failed to get AI guidance')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTicket = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/api/backoffice/submit-ticket',
        {
          customerId: customer.id,
          requestType,
          requestDetails,
          aiGuidance: guidance
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setSubmittedTicket(response.data.ticket)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting ticket:', err)
      alert('Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  if (submitted && submittedTicket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-green-300 rounded-3xl p-10 shadow-xl">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-bounce">✅</div>
              <h2 className="text-4xl font-bold text-green-900 mb-3">
                Request Submitted Successfully!
              </h2>
              <p className="text-green-700 text-lg">
                Your request has been registered and our team will review it shortly.
              </p>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
              <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🎫</span>
                Ticket Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Ticket Number</p>
                  <p className="font-bold text-2xl text-dewa-blue">{submittedTicket.ticketId}</p>
                </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <p className={`font-bold text-lg ${
                  submittedTicket.priority === 'High' ? 'text-red-600' :
                  submittedTicket.priority === 'Medium' ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {submittedTicket.priority === 'High' ? '🔴' : 
                   submittedTicket.priority === 'Medium' ? '🟡' : '🟢'} {submittedTicket.priority}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Request Type</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {submittedTicket.requestType.replace('_', ' ')}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-green-700">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {submittedTicket.status}
                </p>
              </div>
            </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Submitted</p>
                <p className="text-gray-900 font-semibold text-lg">
                  {new Date(submittedTicket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-7 mb-8 border border-blue-200">
              <h4 className="font-bold text-xl text-gray-900 mb-5 flex items-center">
                <span className="text-3xl mr-3">📋</span>
                What Happens Next?
              </h4>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-base">Your request has been logged in our system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-0.5">→</span>
                  <span className="text-base">Our support team will review your request within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 text-xl mt-0.5">📧</span>
                  <span className="text-base">You'll receive updates via email and SMS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl mt-0.5">💬</span>
                  <span className="text-base">Track your request anytime via Chat Support by asking "track my requests"</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/chat"
                className="flex-1 bg-gradient-to-r from-dewa-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold transition-all text-center shadow-md hover:shadow-lg"
              >
                💬 Chat Support
              </Link>
              <Link
                to="/summary"
                className="flex-1 bg-gradient-to-r from-dewa-green to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-bold transition-all text-center shadow-md hover:shadow-lg"
              >
                📊 Dashboard
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setSubmittedTicket(null)
                  setGuidance(null)
                  setRequestType('')
                  setRequestDetails('')
                  setRequestExplanation(null)
                }}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-800 px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg border-2 border-gray-200"
              >
                ➕ New Request
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Navigation */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <Link
            to="/summary"
            className="px-5 py-2.5 bg-white hover:bg-gray-50 rounded-xl font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap border border-gray-200"
          >
            Summary
          </Link>
          <Link
            to="/request"
            className="px-5 py-2.5 bg-gradient-to-r from-dewa-green to-green-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
          >
            New Request
          </Link>
          <Link
            to="/chat"
            className="px-5 py-2.5 bg-white hover:bg-gray-50 rounded-xl font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap border border-gray-200"
          >
            Chat Support
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-white hover:bg-gray-50 rounded-xl font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap border border-gray-200"
          >
            Analytics
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Submit New Request
            </h2>

            {/* Proactive Alert */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-2 text-lg">
                    AI-Powered Guidance
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Get instant AI analysis before submitting. We'll check for duplicates,
                    known issues, and provide personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7">
              {/* Request Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Request Type *
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dewa-green focus:border-dewa-green transition-all bg-white text-gray-900"
                >
                  <option value="">Select request type...</option>
                  {requestTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

            {/* AI Request Explanation - Shows when request type is selected */}
            {requestType && requestExplanation && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 shadow-sm animate-fadeIn">
                <div className="flex items-start mb-4">
                  <span className="text-3xl mr-3">
                    {requestTypes.find(t => t.value === requestType)?.icon || '📋'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-dewa-dark mb-1">
                      {requestExplanation.title}
                    </h3>
                    {loadingExplanation ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="animate-spin mr-2">⚙️</span>
                        Generating AI explanation...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {requestExplanation.description}
                        </p>

                        {/* Common Reasons */}
                        {requestExplanation.commonReasons && (
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-sm text-gray-800 mb-2">
                              Common Reasons for This Request:
                            </h4>
                            <ul className="space-y-1">
                              {requestExplanation.commonReasons.map((reason, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-dewa-green mr-2">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Next Steps */}
                        {requestExplanation.nextSteps && (
                          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 border-l-4 border-dewa-blue">
                            <div className="flex items-start">
                              <span className="text-lg mr-2">👉</span>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                                  What Happens Next:
                                </h4>
                                <p className="text-sm text-gray-700">
                                  {requestExplanation.nextSteps}
                                </p>
                              </div>

            {/* Duplicate Warning Modal */}
            <AnimatePresence>
              {showDuplicateWarning && existingRequests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={handleCancelProceed}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              Similar Open Request Found
                            </h3>
                            <p className="text-sm text-white/90">
                              You already have an open request for this category. Review it before creating a duplicate.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleCancelProceed}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Existing Requests */}
                    <div className="p-6 max-h-[50vh] overflow-y-auto">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">🎫</span>
                        Your Open Requests for This Category:
                      </h4>
                      
                      <div className="space-y-3">
                        {existingRequests.map((request, index) => (
                          <motion.div
                            key={request.ticketId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-gray-900 mb-1">
                                  {request.subject}
                                </p>
                                <p className="text-sm text-gray-600 font-mono">
                                  Ticket: {request.ticketId}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                request.status === 'Open' ? 'bg-red-100 text-red-700' :
                                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                            
                            {request.subjectAr && (
                              <p className="text-sm text-gray-600 mb-2" dir="rtl">
                                {request.subjectAr}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-orange-200">
                              <span className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  request.priority === 'High' ? 'bg-red-500' :
                                  request.priority === 'Medium' ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`} />
                                {request.priority} Priority
                              </span>
                              {request.accountNumber && (
                                <span>Account: {request.accountNumber}</span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancelProceed}
                          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel & Review Existing
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleConfirmProceed}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-dewa-green to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Proceed with New Request
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        💡 Tip: Check your existing requests in Chat Support or Dashboard before creating duplicates
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
                            </div>
                          </div>
                        )}

                        {/* AI Insights (if available from OpenAI) */}
                        {requestExplanation.aiInsights && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-l-4 border-green-500">
                            <div className="flex items-start">
                              <span className="text-lg mr-2">🤖</span>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                                  AI Personalized Insight:
                                </h4>
                                <p className="text-sm text-gray-700">
                                  {requestExplanation.aiInsights}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Request Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Details {requestType && '(Optional - helps us serve you better)'}
              </label>
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                rows="5"
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dewa-green focus:border-dewa-green transition-all resize-none"
                placeholder="Please describe your request in detail..."
              />
            </div>

            {/* Get AI Guidance Button */}
            {!guidance && (
              <div>
                <button
                  onClick={handleGetGuidance}
                  disabled={loading || !requestType || !confirmedProceed || checkingDuplicates}
                  className="w-full bg-gradient-to-r from-dewa-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                >
                  {checkingDuplicates ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⚙️</span>
                      Checking for duplicates...
                    </>
                  ) : loading ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⚙️</span>
                      Analyzing...
                    </>
                  ) : !confirmedProceed && existingRequests.length > 0 ? (
                    '⚠️ Confirm to proceed'
                  ) : (
                    '🤖 Get AI Guidance'
                  )}
                </button>
                {!confirmedProceed && existingRequests.length > 0 && (
                  <p className="text-sm text-amber-600 mt-3 flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4 h-4" />
                    Please review and confirm your existing requests first
                  </p>
                )}
              </div>
            )}
          </div>

          {/* AI Guidance Response */}
          {guidance && (
            <div className="mt-6 space-y-6">
              {/* Priority Banner */}
              <div className={`rounded-lg p-4 border-l-4 ${
                guidance.priority === 'urgent' ? 'bg-red-50 border-red-500' :
                guidance.priority === 'high' ? 'bg-orange-50 border-orange-500' :
                guidance.priority === 'medium' ? 'bg-blue-50 border-blue-500' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {guidance.priority === 'urgent' ? '🚨' : 
                     guidance.priority === 'high' ? '⚠️' : 
                     guidance.priority === 'medium' ? 'ℹ️' : '✅'}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">
                      {guidance.priority} Priority
                    </h4>
                    {guidance.aiPowered && (
                      <span className="text-xs text-gray-600">🤖 AI-Powered Analysis</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Data Analysis */}
              {guidance.customerDataAnalysis && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-dewa-dark mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Your Account Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Billing Summary */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">💰 Billing Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Bill:</span>
                          <span className="font-bold">AED {guidance.customerDataAnalysis.billingSummary.currentBill}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Predicted Next:</span>
                          <span className="font-bold text-dewa-blue">AED {guidance.customerDataAnalysis.billingSummary.predictedBill}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Change:</span>
                          <span className={`font-bold ${parseFloat(guidance.customerDataAnalysis.billingSummary.variance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {parseFloat(guidance.customerDataAnalysis.billingSummary.variance) > 0 ? '+' : ''}
                            {guidance.customerDataAnalysis.billingSummary.variance}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Consumption Insights */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">⚡ Consumption Pattern</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trend:</span>
                          <span className={`font-bold capitalize ${
                            guidance.customerDataAnalysis.consumptionInsights.trend === 'increasing' ? 'text-red-600' :
                            guidance.customerDataAnalysis.consumptionInsights.trend === 'decreasing' ? 'text-green-600' :
                            'text-gray-700'
                          }`}>
                            {guidance.customerDataAnalysis.consumptionInsights.trend}
                            {guidance.customerDataAnalysis.consumptionInsights.trend !== 'stable' && 
                              ` (${Math.abs(guidance.customerDataAnalysis.consumptionInsights.variance).toFixed(1)}%)`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average:</span>
                          <span className="font-medium">{guidance.customerDataAnalysis.consumptionInsights.average} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Latest:</span>
                          <span className="font-medium">{guidance.customerDataAnalysis.consumptionInsights.latest} kWh</span>
                        </div>
                      </div>
                    </div>

                    {/* Account Status */}
                    {(guidance.customerDataAnalysis.accountStatus.openComplaints > 0 || 
                      guidance.customerDataAnalysis.accountStatus.hasUnpaidBills) && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-700 mb-3">📋 Account Status</h4>
                        <div className="space-y-2 text-sm">
                          {guidance.customerDataAnalysis.accountStatus.openComplaints > 0 && (
                            <div className="flex items-center text-orange-600">
                              <span className="mr-2">⚠️</span>
                              <span>{guidance.customerDataAnalysis.accountStatus.openComplaints} open complaint(s)</span>
                            </div>
                          )}
                          {guidance.customerDataAnalysis.accountStatus.hasUnpaidBills && (
                            <div className="flex items-center text-red-600">
                              <span className="mr-2">❗</span>
                              <span>Unpaid: AED {guidance.customerDataAnalysis.accountStatus.unpaidAmount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Usage Patterns */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">🔍 Usage Insights</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>{guidance.customerDataAnalysis.usagePatterns.reason}</p>
                        {guidance.customerDataAnalysis.usagePatterns.peakHours !== 'Not available' && (
                          <p className="text-xs">Peak: {guidance.customerDataAnalysis.usagePatterns.peakHours}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Situation Analysis */}
              {guidance.situationAnalysis && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg text-dewa-dark mb-3 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    Situation Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{guidance.situationAnalysis}</p>
                  
                  {guidance.rootCause && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Likely Root Cause:</h4>
                      <p className="text-gray-600 text-sm">{guidance.rootCause}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {guidance.recommendations && guidance.recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-dewa-dark mb-4 flex items-center">
                    <span className="text-2xl mr-2">💡</span>
                    Personalized Recommendations
                  </h3>
                  <div className="space-y-3">
                    {guidance.recommendations.map((rec, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-start">
                          <span className="text-green-600 font-bold mr-3">{index + 1}.</span>
                          <p className="text-gray-700 text-sm leading-relaxed flex-1">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proactive Advice */}
              {guidance.proactiveAdvice && (
                <div
                  className={`border-l-4 rounded-lg p-6 ${
                    guidance.proactiveAdvice.shouldDeflect
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-3">
                      {guidance.proactiveAdvice.shouldDeflect ? '⚠️' : 'ℹ️'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {guidance.proactiveAdvice.shouldDeflect
                          ? 'Alternative Solutions Available'
                          : 'Ready to Proceed'}
                      </h3>
                      <p className="text-gray-800 mb-3">{guidance.proactiveAdvice.suggestion}</p>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Confidence: </span>
                        {(guidance.proactiveAdvice.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {guidance.proactiveAdvice.alternatives && (
                    <div className="mt-4 pt-4 border-t border-yellow-200">
                      <p className="font-medium text-sm mb-2">Suggested alternatives:</p>
                      <ul className="space-y-1">
                        {guidance.proactiveAdvice.alternatives.map((alt, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {alt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guidance.proactiveAdvice.insights && (
                    <div className="mt-4 pt-4 border-t border-yellow-200">
                      <p className="font-medium text-sm mb-2">Insights:</p>
                      <ul className="space-y-1">
                        {guidance.proactiveAdvice.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {!guidance.proactiveAdvice?.shouldDeflect || guidance.proactiveAdvice?.confidence < 0.8 ? (
                  <button
                    onClick={handleSubmitTicket}
                    disabled={loading}
                    className="flex-1 bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-md"
                  >
                    {loading ? 'Submitting...' : '✓ Submit Ticket'}
                  </button>
                ) : (
                  <Link
                    to="/summary"
                    className="flex-1 bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition text-center shadow-md"
                  >
                    Return to Summary
                  </Link>
                )}
                <button
                  onClick={() => setGuidance(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition shadow-md"
                >
                  ← Modify Request
                </button>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

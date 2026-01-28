import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function RequestForm({ customer }) {
  const [requestType, setRequestType] = useState('')
  const [requestDetails, setRequestDetails] = useState('')
  const [guidance, setGuidance] = useState(null)
  const [requestExplanation, setRequestExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  const requestTypes = [
    { value: 'billing_inquiry', label: 'Billing Inquiry / High Bill', icon: '💰' },
    { value: 'service_outage', label: 'Service Outage', icon: '⚡' },
    { value: 'meter_reading', label: 'Meter Reading Issue', icon: '📊' },
    { value: 'payment', label: 'Payment Problem', icon: '💳' },
    { value: 'connection_request', label: 'New Connection', icon: '🔌' },
    { value: 'complaint', label: 'General Complaint', icon: '📝' }
  ]

  // Generate AI explanation when request type changes
  useEffect(() => {
    if (requestType) {
      generateRequestExplanation(requestType)
    } else {
      setRequestExplanation(null)
    }
  }, [requestType])

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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold text-green-900 mb-2">
              Request Submitted Successfully!
            </h2>
            <p className="text-green-700 text-lg">
              Your request has been registered and our team will review it shortly.
            </p>
          </div>

          {/* Ticket Details Card */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="font-bold text-xl text-dewa-dark mb-4 flex items-center">
              <span className="text-2xl mr-2">🎫</span>
              Ticket Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Ticket Number</p>
                <p className="font-bold text-lg text-dewa-blue">{submittedTicket.ticketId}</p>
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

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-gray-800">
                {new Date(submittedTicket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h4 className="font-bold text-lg text-dewa-dark mb-3 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              What Happens Next?
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span>Your request has been logged in our system</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">→</span>
                <span>Our support team will review your request within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">📧</span>
                <span>You'll receive updates via email and SMS</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">💬</span>
                <span>Track your request anytime via Chat Support by asking "track my requests"</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/chat"
              className="flex-1 bg-dewa-blue hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold transition text-center shadow-md"
            >
              💬 Chat Support
            </Link>
            <Link
              to="/summary"
              className="flex-1 bg-dewa-green hover:bg-green-600 text-white px-6 py-4 rounded-lg font-bold transition text-center shadow-md"
            >
              📊 Back to Dashboard
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
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-lg font-bold transition shadow-md"
            >
              ➕ Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex space-x-4 mb-6">
        <Link
          to="/summary"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
        >
          Summary
        </Link>
        <Link
          to="/request"
          className="px-4 py-2 bg-dewa-green text-white rounded-lg font-medium"
        >
          New Request
        </Link>
        <Link
          to="/chat"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
        >
          Chat Support
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
        >
          Analytics
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-dewa-dark mb-6">
            Submit New Request
          </h2>

          {/* Proactive Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <p className="font-medium text-blue-900 mb-1">
                  AI-Powered Proactive Guidance
                </p>
                <p className="text-sm text-blue-700">
                  Get instant AI analysis before submitting. We'll check for duplicates,
                  known issues, and provide personalized recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details {requestType && '(Optional - but helps us serve you better)'}
              </label>
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
                placeholder="Please describe your request in detail..."
              />
            </div>

            {/* Get AI Guidance Button */}
            {!guidance && (
              <button
                onClick={handleGetGuidance}
                disabled={loading || !requestType}
                className="w-full bg-dewa-blue hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : '🤖 Get AI Guidance'}
              </button>
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
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function RequestForm({ customer }) {
  const [requestType, setRequestType] = useState('')
  const [requestDetails, setRequestDetails] = useState('')
  const [guidance, setGuidance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const requestTypes = [
    { value: 'billing_inquiry', label: 'Billing Inquiry / High Bill' },
    { value: 'service_outage', label: 'Service Outage' },
    { value: 'meter_reading', label: 'Meter Reading Issue' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'connection_request', label: 'New Connection' },
    { value: 'complaint', label: 'General Complaint' }
  ]

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
      await axios.post(
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

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting ticket:', err)
      alert('Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Request Submitted Successfully
          </h2>
          <p className="text-green-700 mb-6">
            Your ticket has been created and assigned to our support team.
            You'll receive updates via email and SMS.
          </p>
          <div className="space-x-4">
            <Link
              to="/summary"
              className="inline-block bg-dewa-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Back to Summary
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setGuidance(null)
                setRequestType('')
                setRequestDetails('')
              }}
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
            >
              Submit Another
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
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Request Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details
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
            <div className="mt-6 space-y-4">
              <div
                className={`border-l-4 rounded-lg p-6 ${
                  guidance.shouldDeflect
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start mb-3">
                  <span className="text-3xl mr-3">
                    {guidance.shouldDeflect ? '⚠️' : '✅'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {guidance.shouldDeflect
                        ? 'AI Recommendation: Consider Alternatives'
                        : 'Ready to Proceed'}
                    </h3>
                    <p className="text-gray-800 mb-3">{guidance.suggestion}</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Confidence: </span>
                      {(guidance.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                {guidance.alternatives && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="font-medium text-sm mb-2">
                      Suggested alternatives:
                    </p>
                    <ul className="space-y-1">
                      {guidance.alternatives.map((alt, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {alt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Insights */}
                {guidance.insights && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="font-medium text-sm mb-2">Insights:</p>
                    <ul className="space-y-1">
                      {guidance.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {!guidance.shouldDeflect || guidance.confidence < 0.8 ? (
                  <button
                    onClick={handleSubmitTicket}
                    disabled={loading}
                    className="flex-1 bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                ) : (
                  <Link
                    to="/summary"
                    className="flex-1 bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition text-center"
                  >
                    Return to Summary
                  </Link>
                )}
                <button
                  onClick={() => setGuidance(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition"
                >
                  Modify Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      const response = await axios.get(
        `http://localhost:3001/api/customer/summary/${customer.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setSummary(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load summary')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dewa-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your summary...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex space-x-4 mb-6">
        <Link
          to="/summary"
          className="px-4 py-2 bg-dewa-green text-white rounded-lg font-medium"
        >
          Summary
        </Link>
        <Link
          to="/request"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Prediction */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-dewa-green">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Predicted Next Bill</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              AI Prediction
            </span>
          </div>
          <div className="text-4xl font-bold text-dewa-dark mb-2">
            AED {aiInsights?.billPrediction?.predicted || customerData.predictedBill}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Confidence: {((aiInsights?.billPrediction?.confidence || 0.8) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <span className="font-medium">Trend:</span>{' '}
              {aiInsights?.billPrediction?.trend || 'stable'}
            </p>
            <p className="text-xs text-gray-500">
              Last bill: AED {customerData.lastBill}
            </p>
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
              <p className="text-lg font-semibold">
                {aiInsights?.consumptionAnalysis?.variance || 0}%
              </p>
            </div>
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
            <div className="space-y-3">
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

      {/* AI Recommendations */}
      {aiInsights?.recommendations && aiInsights.recommendations.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            🤖 AI Recommendations
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
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/request"
          className="block bg-dewa-green hover:bg-green-600 text-white rounded-xl p-6 text-center transition"
        >
          <div className="text-2xl mb-2">📝</div>
          <h4 className="font-bold text-lg mb-1">Submit New Request</h4>
          <p className="text-sm opacity-90">Get AI guidance before submitting</p>
        </Link>
        <Link
          to="/chat"
          className="block bg-dewa-blue hover:bg-blue-700 text-white rounded-xl p-6 text-center transition"
        >
          <div className="text-2xl mb-2">💬</div>
          <h4 className="font-bold text-lg mb-1">Chat with AI</h4>
          <p className="text-sm opacity-90">Voice & text support available</p>
        </Link>
      </div>
    </div>
  )
}

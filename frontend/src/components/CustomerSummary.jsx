import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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

      {/* Historical Consumption Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Consumption History & Prediction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={customerData.consumptionHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(month) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            />
            <YAxis yAxisId="left" label={{ value: 'AED', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'kWh', angle: 90, position: 'insideRight' }} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'amount' ? `AED ${value}` : `${value} kWh`,
                name === 'amount' ? 'Bill' : 'Usage'
              ]}
              labelFormatter={(month) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="amount" 
              stroke="#00A651" 
              strokeWidth={2}
              name="Bill Amount"
              dot={{ fill: '#00A651' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="kwh" 
              stroke="#0072BC" 
              strokeWidth={2}
              name="kWh Usage"
              dot={{ fill: '#0072BC' }}
              strokeDasharray={(entry) => entry.predicted ? "5 5" : "0"}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Dotted line indicates AI prediction based on historical patterns and seasonal factors
        </p>
      </div>

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
        <button
          onClick={() => window.open('https://www.dewa.gov.ae/en/consumer/billing/pay-bill', '_blank')}
          className="block bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-center transition w-full"
        >
          <div className="text-3xl mb-2">💳</div>
          <h4 className="font-bold text-lg mb-1">Pay Bill Now</h4>
          <p className="text-sm opacity-90">Multiple payment options</p>
        </button>
      </div>
    </div>
  )
}

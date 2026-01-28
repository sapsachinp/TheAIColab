import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

const COLORS = ['#00A651', '#0072BC', '#FFA500', '#FF6B6B']

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        'http://localhost:3001/api/backoffice/analytics',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setAnalytics(response.data.metrics)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dewa-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const pieData = [
    { name: 'Resolved', value: analytics?.resolvedCount || 0 },
    { name: 'Deflected', value: analytics?.deflectedCount || 0 },
    { name: 'Pending', value: (analytics?.totalInteractions || 0) - (analytics?.resolvedCount || 0) - (analytics?.deflectedCount || 0) }
  ]

  const performanceData = [
    { name: 'FCR Rate', value: analytics?.fcrRate || 0, target: 70 },
    { name: 'Deflection Rate', value: analytics?.deflectionRate || 0, target: 40 },
    { name: 'Satisfaction', value: analytics?.avgSatisfaction * 20 || 0, target: 80 }
  ]

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
          className="px-4 py-2 bg-dewa-green text-white rounded-lg font-medium"
        >
          Analytics
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dewa-dark mb-2">Analytics & Continuous Learning</h1>
        <p className="text-gray-600">Real-time insights from AI-powered customer interactions</p>
      </div>

      {/* DEWA Savings Section - Prominent Display */}
      {analytics?.savings && (
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span>💰</span> DEWA Cost Savings - AI Impact
              </h2>
              <p className="text-green-100">Financial benefits of AI-powered customer support</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Savings Rate</p>
              <p className="text-3xl font-bold">{analytics.savings.savingsPercentage}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-xs text-green-100 mb-2">Current Period Savings</p>
              <p className="text-3xl font-bold">AED {analytics.savings.totalSavings.toLocaleString()}</p>
              <p className="text-xs text-green-200 mt-2">vs. traditional support model</p>
            </div>

            <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-xs text-green-100 mb-2">Projected Monthly</p>
              <p className="text-3xl font-bold">AED {analytics.savings.projectedMonthlySavings.toLocaleString()}</p>
              <p className="text-xs text-green-200 mt-2">estimated savings/month</p>
            </div>

            <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-xs text-green-100 mb-2">Projected Yearly</p>
              <p className="text-3xl font-bold">AED {analytics.savings.projectedYearlySavings.toLocaleString()}</p>
              <p className="text-xs text-green-200 mt-2">estimated savings/year</p>
            </div>

            <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-xs text-green-100 mb-2">Agent Capacity Freed</p>
              <p className="text-3xl font-bold">{analytics.savings.equivalentAgentsSaved}</p>
              <p className="text-xs text-green-200 mt-2">equivalent agents saved</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-100">AI-Handled Calls</span>
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-2xl font-bold">{analytics.savings.deflectedCalls}</p>
              <p className="text-xs text-green-200 mt-1">
                @ AED {analytics.savings.costPerAICall} per call
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-100">Escalated to Agents</span>
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-2xl font-bold">{analytics.savings.escalatedCalls}</p>
              <p className="text-xs text-green-200 mt-1">
                @ AED {analytics.savings.costPerHumanCall} per call
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-100">Cost Comparison</span>
                <span className="text-2xl">📉</span>
              </div>
              <p className="text-sm">
                <span className="line-through text-red-300">AED {analytics.savings.traditionalCost.toLocaleString()}</span>
                <br />
                <span className="text-xl font-bold text-green-200">AED {analytics.savings.actualCost.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <p className="text-xs text-green-100 text-center">
              💡 AI reduces customer support costs by handling routine inquiries efficiently, allowing agents to focus on complex cases
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-dewa-green">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Interactions</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-dewa-dark">{analytics?.totalInteractions || 0}</p>
          <p className="text-xs text-gray-500 mt-1">All channels</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">FCR Rate</h3>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-dewa-dark">{analytics?.fcrRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">First Contact Resolution</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Ticket Deflection</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-dewa-dark">{analytics?.deflectionRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Prevented tickets</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Satisfaction</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-dewa-dark">{analytics?.avgSatisfaction || 0}/5</p>
          <p className="text-xs text-gray-500 mt-1">Customer rating</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Performance vs Targets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00A651" name="Current" />
              <Bar dataKey="target" fill="#0072BC" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interaction Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Interaction Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          Continuous Learning Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">AI Accuracy</h4>
            <p className="text-2xl font-bold text-dewa-green mb-1">
              {analytics?.fcrRate || 0}%
            </p>
            <p className="text-xs text-gray-600">
              Intent classification accuracy improving with each interaction
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Proactive Impact</h4>
            <p className="text-2xl font-bold text-dewa-blue mb-1">
              {analytics?.deflectedCount || 0}
            </p>
            <p className="text-xs text-gray-600">
              Tickets prevented through proactive guidance
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Human Oversight</h4>
            <p className="text-2xl font-bold text-orange-500 mb-1">100%</p>
            <p className="text-xs text-gray-600">
              AI recommendations require human approval
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3">Feedback Loop Active ♻️</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ Real-time logging of all AI interactions</p>
            <p>✓ Customer satisfaction data feeding back to models</p>
            <p>✓ Automated A/B testing for empathy responses</p>
            <p>✓ Human override tracking for model improvement</p>
          </div>
        </div>
      </div>
    </div>
  )
}

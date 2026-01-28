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
            className="px-5 py-2.5 bg-white hover:bg-gray-50 rounded-xl font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap border border-gray-200"
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
            className="px-5 py-2.5 bg-gradient-to-r from-dewa-green to-green-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
          >
            Analytics
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Analytics & Insights</h1>
          <p className="text-lg text-gray-600">Real-time insights from AI-powered customer interactions</p>
        </div>

        {/* DEWA Savings Section - Prominent Display */}
        {analytics?.savings && (
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white rounded-3xl shadow-xl p-10 mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                  <span>💰</span> Cost Savings Impact
                </h2>
                <p className="text-green-50 text-lg">Financial benefits of AI-powered support</p>
              </div>
              <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <p className="text-sm text-green-50 mb-2">Savings Rate</p>
                <p className="text-4xl font-bold">{analytics.savings.savingsPercentage}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <p className="text-sm text-green-50 mb-3 font-medium">Current Period</p>
                <p className="text-3xl font-bold mb-2">AED {analytics.savings.totalSavings.toLocaleString()}</p>
                <p className="text-xs text-green-100">vs. traditional model</p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <p className="text-sm text-green-50 mb-3 font-medium">Monthly Projection</p>
                <p className="text-3xl font-bold mb-2">AED {analytics.savings.projectedMonthlySavings.toLocaleString()}</p>
                <p className="text-xs text-green-100">estimated/month</p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <p className="text-sm text-green-50 mb-3 font-medium">Yearly Projection</p>
                <p className="text-3xl font-bold mb-2">AED {analytics.savings.projectedYearlySavings.toLocaleString()}</p>
                <p className="text-xs text-green-100">estimated/year</p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
                <p className="text-sm text-green-50 mb-3 font-medium">Capacity Freed</p>
                <p className="text-3xl font-bold mb-2">{analytics.savings.equivalentAgentsSaved}</p>
                <p className="text-xs text-green-100">agent equivalents</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-green-50">AI-Handled</span>
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-3xl font-bold mb-1">{analytics.savings.deflectedCalls}</p>
                <p className="text-sm text-green-100">
                  @ AED {analytics.savings.costPerAICall} per call
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-green-50">Escalated</span>
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-3xl font-bold mb-1">{analytics.savings.escalatedCalls}</p>
                <p className="text-sm text-green-100">
                  @ AED {analytics.savings.costPerHumanCall} per call
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-green-50">Comparison</span>
                  <span className="text-2xl">📉</span>
                </div>
                <p className="text-sm mb-2">
                  <span className="line-through text-red-200">AED {analytics.savings.traditionalCost.toLocaleString()}</span>
                </p>
                <p className="text-2xl font-bold text-green-50">AED {analytics.savings.actualCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/30">
              <p className="text-sm text-green-50 text-center leading-relaxed">
                💡 AI reduces support costs by handling routine inquiries efficiently, allowing agents to focus on complex cases
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-dewa-green">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Interactions</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{analytics?.totalInteractions || 0}</p>
            <p className="text-sm text-gray-500">All channels</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">FCR Rate</h3>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{analytics?.fcrRate || 0}%</p>
            <p className="text-sm text-gray-500">First Contact Resolution</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Deflection</h3>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{analytics?.deflectionRate || 0}%</p>
            <p className="text-sm text-gray-500">Prevented tickets</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Satisfaction</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{analytics?.avgSatisfaction || 0}/5</p>
            <p className="text-sm text-gray-500">Customer rating</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-7">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Performance vs Targets</h3>
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
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-7">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Interaction Distribution</h3>
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
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-md p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🤖</span>
            Continuous Learning Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">AI Accuracy</h4>
              <p className="text-3xl font-bold text-dewa-green mb-2">
                {analytics?.fcrRate || 0}%
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Intent classification accuracy improving with each interaction
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">Proactive Impact</h4>
              <p className="text-3xl font-bold text-dewa-blue mb-2">
                {analytics?.deflectedCount || 0}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tickets prevented through proactive guidance
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">Human Oversight</h4>
              <p className="text-3xl font-bold text-orange-500 mb-2">100%</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI recommendations require human approval
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Feedback Loop Active ♻️</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-2"><span className="text-green-500">✓</span> Real-time logging of all AI interactions</p>
              <p className="flex items-start gap-2"><span className="text-green-500">✓</span> Customer satisfaction data feeding back to models</p>
              <p className="flex items-start gap-2"><span className="text-green-500">✓</span> Automated A/B testing for empathy responses</p>
              <p className="flex items-start gap-2"><span className="text-green-500">✓</span> Human override tracking for model improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

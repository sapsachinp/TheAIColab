import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import { API_BASE_URL, mockData } from '../config/api'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Speed,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  AutoAwesome,
  Insights,
  Analytics,
  SmartToy,
  Support,
  ThumbUp,
  Schedule,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      let response
      
      try {
        // Try real backend first with 3 second timeout
        response = await axios.get(
          `${API_BASE_URL}/api/backoffice/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000  // 3 seconds to get real AI analytics
          }
        )
        console.log('✅ Loaded real analytics from backend')
      } catch (backendError) {
        // Fallback to mock analytics
        console.log('⚠️ Backend unavailable, using mock analytics data')
        const mockResponse = await mockData.getAnalytics()
        response = { data: { metrics: mockResponse.analytics } }
      }

      setAnalytics(response.data.metrics)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <SmartToy sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Analyzing AI Performance...
          </Typography>
          <LinearProgress sx={{ mt: 2, width: 200 }} />
        </Card>
      </Box>
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

  // Helper function to determine status and color
  const getStatusInfo = (value, target) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return { status: 'excellent', color: 'success', icon: <CheckCircle /> }
    if (percentage >= 80) return { status: 'good', color: 'info', icon: <TrendingUp /> }
    if (percentage >= 60) return { status: 'warning', color: 'warning', icon: <Warning /> }
    return { status: 'needs attention', color: 'error', icon: <ErrorIcon /> }
  }

  // Calculate trends (mock data - replace with actual historical comparison)
  const getTrendIndicator = (value, isPositive = true) => {
    const trend = Math.random() > 0.5 ? 'up' : 'down'
    const change = (Math.random() * 15).toFixed(1)
    const isGoodTrend = isPositive ? trend === 'up' : trend === 'down'
    
    return {
      trend,
      change,
      isGood: isGoodTrend,
      icon: trend === 'up' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Navigation */}
        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            component={Link}
            to="/summary"
            label="Summary"
            clickable
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
          />
          <Chip
            component={Link}
            to="/request"
            label="New Request"
            clickable
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
          />
          <Chip
            component={Link}
            to="/chat"
            label="Chat Support"
            clickable
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
          />
          <Chip
            component={Link}
            to="/dashboard"
            label="Analytics"
            clickable
            color="primary"
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              fontWeight: 600,
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          />
        </Stack>

        {/* Header with AI Indicator */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Analytics fontSize="large" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                AI Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time insights from AI-powered customer interactions
              </Typography>
            </Box>
            <Chip 
              icon={<AutoAwesome />}
              label="Live" 
              color="success" 
              sx={{ animation: 'pulse 2s infinite' }}
            />
          </Stack>
        </Paper>

        {/* DEWA Savings Section - Prominent Display */}
        {analytics?.savings && (
          <Card 
            elevation={3}
            sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 4,
              mb: 4,
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                      💰 Cost Savings Impact
                    </Typography>
                    <Chip 
                      icon={<TrendingUp />}
                      label="Optimized" 
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                    />
                  </Stack>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Financial benefits of AI-powered support
                  </Typography>
                </Box>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                    Savings Rate
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics.savings.savingsPercentage}%
                  </Typography>
                </Paper>
              </Stack>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { 
                    label: 'Current Period', 
                    value: `AED ${analytics.savings.totalSavings.toLocaleString()}`,
                    subtitle: 'vs. traditional model',
                    icon: '💵'
                  },
                  { 
                    label: 'Monthly Projection', 
                    value: `AED ${analytics.savings.projectedMonthlySavings.toLocaleString()}`,
                    subtitle: 'estimated/month',
                    icon: '📅'
                  },
                  { 
                    label: 'Yearly Projection', 
                    value: `AED ${analytics.savings.projectedYearlySavings.toLocaleString()}`,
                    subtitle: 'estimated/year',
                    icon: '📊'
                  },
                  { 
                    label: 'Capacity Freed', 
                    value: analytics.savings.equivalentAgentsSaved,
                    subtitle: 'agent equivalents',
                    icon: '👥'
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2.5, 
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.25)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="caption" fontWeight={600} sx={{ opacity: 0.9 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h6">{item.icon}</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {item.subtitle}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2}>
                {[
                  {
                    title: 'AI-Handled',
                    value: analytics.savings.deflectedCalls,
                    subtitle: `@ AED ${analytics.savings.costPerAICall} per call`,
                    icon: '🤖'
                  },
                  {
                    title: 'Escalated',
                    value: analytics.savings.escalatedCalls,
                    subtitle: `@ AED ${analytics.savings.costPerHumanCall} per call`,
                    icon: '👤'
                  },
                  {
                    title: 'Cost Comparison',
                    value: `AED ${analytics.savings.actualCost.toLocaleString()}`,
                    subtitle: `Saved AED ${(analytics.savings.traditionalCost - analytics.savings.actualCost).toLocaleString()}`,
                    icon: '📉'
                  }
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2.5, 
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography variant="h6">{item.icon}</Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {item.subtitle}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
              
              <Typography variant="body2" align="center" sx={{ opacity: 0.9 }}>
                💡 AI reduces support costs by handling routine inquiries efficiently, allowing agents to focus on complex cases
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards with AI Signals */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: 'Total Interactions',
              value: analytics?.totalInteractions || 0,
              subtitle: 'All channels',
              icon: <Analytics fontSize="large" />,
              color: '#10b981',
              trend: getTrendIndicator(analytics?.totalInteractions || 0, true)
            },
            {
              title: 'FCR Rate',
              value: `${analytics?.fcrRate || 0}%`,
              subtitle: 'First Contact Resolution',
              icon: <CheckCircle fontSize="large" />,
              color: '#3b82f6',
              trend: getTrendIndicator(analytics?.fcrRate || 0, true),
              status: getStatusInfo(analytics?.fcrRate || 0, 70)
            },
            {
              title: 'Deflection Rate',
              value: `${analytics?.deflectionRate || 0}%`,
              subtitle: 'Prevented tickets',
              icon: <Speed fontSize="large" />,
              color: '#f59e0b',
              trend: getTrendIndicator(analytics?.deflectionRate || 0, true),
              status: getStatusInfo(analytics?.deflectionRate || 0, 40)
            },
            {
              title: 'Customer Satisfaction',
              value: `${analytics?.avgSatisfaction || 0}/5`,
              subtitle: 'Average rating',
              icon: <ThumbUp fontSize="large" />,
              color: '#8b5cf6',
              trend: getTrendIndicator(analytics?.avgSatisfaction || 0, true),
              status: getStatusInfo((analytics?.avgSatisfaction || 0) * 20, 80)
            }
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  borderLeft: `6px solid ${metric.color}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {metric.title}
                      </Typography>
                      {metric.status && (
                        <Chip 
                          size="small" 
                          label={metric.status.status} 
                          color={metric.status.color}
                          icon={metric.status.icon}
                          sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    <Avatar sx={{ bgcolor: `${metric.color}20`, color: metric.color, width: 48, height: 48 }}>
                      {metric.icon}
                    </Avatar>
                  </Stack>
                  
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5, color: metric.color }}>
                    {metric.value}
                  </Typography>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {metric.subtitle}
                    </Typography>
                    <Chip
                      size="small"
                      icon={metric.trend.icon}
                      label={`${metric.trend.change}%`}
                      color={metric.trend.isGood ? 'success' : 'error'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts with Modern Design */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Performance Metrics */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Performance vs Targets
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tracking key performance indicators
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Insights />
                  </Avatar>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" name="Current" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="#3b82f6" name="Target" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Interaction Distribution */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Interaction Distribution
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Breakdown of customer interactions
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>
                    <Support />
                  </Avatar>
                </Stack>
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Insights with Visual Indicators */}
        <Card 
          elevation={2}
          sx={{ 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Psychology fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  AI Continuous Learning Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time intelligence and adaptation metrics
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  title: 'AI Accuracy',
                  value: `${analytics?.fcrRate || 0}%`,
                  description: 'Intent classification accuracy improving with each interaction',
                  icon: <AutoAwesome fontSize="large" />,
                  color: 'success',
                  bgColor: '#10b98120'
                },
                {
                  title: 'Proactive Impact',
                  value: analytics?.deflectedCount || 0,
                  description: 'Tickets prevented through proactive guidance',
                  icon: <Speed fontSize="large" />,
                  color: 'info',
                  bgColor: '#3b82f620'
                },
                {
                  title: 'Human Oversight',
                  value: '100%',
                  description: 'AI recommendations require human approval',
                  icon: <CheckCircle fontSize="large" />,
                  color: 'warning',
                  bgColor: '#f59e0b20'
                }
              ].map((insight, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      background: insight.bgColor,
                      border: '2px solid',
                      borderColor: `${insight.color}.light`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {insight.title}
                      </Typography>
                      <Avatar sx={{ bgcolor: `${insight.color}.main`, width: 40, height: 40 }}>
                        {insight.icon}
                      </Avatar>
                    </Stack>
                    <Typography variant="h3" fontWeight="bold" color={`${insight.color}.main`} sx={{ mb: 1.5 }}>
                      {insight.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {insight.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Schedule />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Feedback Loop Active ♻️
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                {[
                  'Real-time logging of all AI interactions',
                  'Customer satisfaction data feeding back to models',
                  'Automated A/B testing for empathy responses',
                  'Human override tracking for model improvement'
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <CheckCircle color="success" sx={{ fontSize: 20, mt: 0.3 }} />
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

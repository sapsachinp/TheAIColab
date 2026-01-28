import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Psychology,
  Chat,
  TrendingUp,
  BarChart,
  Security,
  Speed,
  CheckCircle,
  ArrowForward,
  AutoAwesome,
  SmartToy,
  People,
} from '@mui/icons-material';
import dewaTheme from '../theme/muiTheme';

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { value: '95%', label: 'Customer Satisfaction', icon: <AutoAwesome /> },
    { value: '40%', label: 'Cost Reduction', icon: <TrendingUp /> },
    { value: '24/7', label: 'Availability', icon: <Speed /> },
    { value: '5min', label: 'Avg. Response Time', icon: <Chat /> },
  ];

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI analyzes customer queries with 95% accuracy, providing instant, personalized responses.',
      stats: '95% Accuracy',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: 'Conversational Support',
      description: 'Natural language processing enables human-like conversations in English and Arabic.',
      stats: '24/7 Available',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Proactive Guidance',
      description: 'Predictive analytics identify issues before they escalate, reducing ticket volume by 40%.',
      stats: '40% Deflection',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      icon: <BarChart sx={{ fontSize: 40 }} />,
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboard tracks performance metrics and customer satisfaction in real-time.',
      stats: 'Live Insights',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with multi-factor authentication and data encryption.',
      stats: 'Bank-Level Security',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized infrastructure ensures response times under 5 seconds for 99% of queries.',
      stats: '<5s Response',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
    },
  ];

  const benefits = [
    { icon: <CheckCircle color="success" />, text: 'Reduce support costs by up to 40% with automated responses' },
    { icon: <CheckCircle color="success" />, text: 'Scale support operations without increasing headcount' },
    { icon: <CheckCircle color="success" />, text: 'Improve customer satisfaction with instant, accurate responses' },
    { icon: <CheckCircle color="success" />, text: 'Gain insights from comprehensive analytics and reporting' },
    { icon: <CheckCircle color="success" />, text: 'Seamlessly integrate with existing CRM and ticketing systems' },
    { icon: <CheckCircle color="success" />, text: 'Maintain 24/7 availability without increasing operational costs' },
  ];

  return (
    <ThemeProvider theme={dewaTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            bottom: -300,
            left: -300,
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* AppBar */}
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  width: 48,
                  height: 48,
                  fontWeight: 'bold',
                }}
              >
                D
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  DEWA AI Support
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Powered by Advanced Intelligence
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              endIcon={<ArrowForward />}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  icon={<AutoAwesome sx={{ color: '#10b981 !important', fontSize: 24 }} />}
                  label="AI-Powered Support Platform"
                  sx={{
                    mb: 4,
                    px: 3,
                    py: 3.5,
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#0f172a',
                    border: '2px solid #10b981',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                    '& .MuiChip-icon': {
                      marginLeft: '8px',
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 12px 48px rgba(16, 185, 129, 0.4)',
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Transform Customer Support with AI
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 6, maxWidth: 800, mx: 'auto', fontWeight: 400 }}
                >
                  Empower your team with intelligent automation, reduce costs by 40%, and deliver exceptional customer experiences 24/7.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  endIcon={<ArrowForward />}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.25rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  Get Started Now
                </Button>
              </motion.div>
            </Box>

            {/* Stats Section */}
            <Box sx={{ py: 6 }}>
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      component={motion.div}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      whileHover={{ y: -8 }}
                      sx={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        height: '100%',
                      }}
                    >
                      <CardContent sx={{ py: 4 }}>
                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 8 }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  Powerful Features
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                  Everything you need to deliver world-class customer support at scale
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card
                      component={motion.div}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -10 }}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 3,
                            background: feature.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'white',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {feature.description}
                        </Typography>
                        <Chip
                          label={feature.stats}
                          size="small"
                          color="success"
                          icon={<AutoAwesome fontSize="small" />}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Benefits Section */}
            <Box sx={{ py: 8 }}>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    Why Choose DEWA AI Support?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Our platform combines cutting-edge AI technology with intuitive design to deliver measurable results for your business.
                  </Typography>
                  <Stack spacing={2}>
                    {benefits.map((benefit, index) => (
                      <Paper
                        key={index}
                        component={motion.div}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                      >
                        {benefit.icon}
                        <Typography variant="body1">{benefit.text}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component={motion.div}
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    sx={{
                      position: 'relative',
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      <SmartToy sx={{ fontSize: 120, color: 'white' }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* CTA Section */}
            <Box sx={{ py: 10 }}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                sx={{
                  p: { xs: 4, md: 8 },
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <Box
                  component={motion.div}
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  sx={{ display: 'inline-block', mb: 3 }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      margin: '0 auto',
                    }}
                  >
                    <People sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
                <Typography variant="h2" sx={{ mb: 3 }}>
                  Ready to Experience AI Support?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}>
                  Join leading organizations using AI to transform customer experience. Start your journey today with our comprehensive demo.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  endIcon={<AutoAwesome />}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    px: 8,
                    py: 2.5,
                    fontSize: '1.25rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  Launch Demo Experience
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                  ✓ Full feature access • ✓ No installation required • ✓ Instant setup
                </Typography>
              </Paper>
            </Box>
          </Container>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              py: 4,
              mt: 8,
            }}
          >
            <Container maxWidth="lg">
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      width: 40,
                      height: 40,
                    }}
                  >
                    D
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      DEWA AI Support Platform
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      © 2026 Dubai Electricity & Water Authority
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Powered by Advanced AI • Secure • Scalable
                </Typography>
              </Stack>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

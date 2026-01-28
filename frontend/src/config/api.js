// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Mock data for demo mode (when backend is not available)
export const MOCK_USERS = [
  {
    email: 'ahmed.mansoori@example.com',
    password: 'password123',
    customer: {
      id: 'C12345',
      name: 'Ahmed Al Mansoori',
      businessPartner: '1000123456',
      businessPartnerName: 'Ahmed Al Mansoori'
    }
  },
  {
    email: 'fatima.hassan@example.com',
    password: 'password123',
    customer: {
      id: 'C67890',
      name: 'Fatima Hassan',
      businessPartner: '1000234567',
      businessPartnerName: 'Fatima Hassan'
    }
  },
  {
    email: 'mohammed.hashimi@example.com',
    password: 'password123',
    customer: {
      id: 'C11223',
      name: 'Mohammed Al Hashimi',
      businessPartner: '1000345678',
      businessPartnerName: 'Mohammed Al Hashimi'
    }
  },
  {
    email: 'sara.alzaabi@example.com',
    password: 'password123',
    customer: {
      id: 'C44556',
      name: 'Sara Al Zaabi',
      businessPartner: '1000456789',
      businessPartnerName: 'Sara Al Zaabi'
    }
  },
  {
    email: 'omar.khalil@example.com',
    password: 'password123',
    customer: {
      id: 'C77889',
      name: 'Omar Khalil',
      businessPartner: '1000567890',
      businessPartnerName: 'Omar Khalil'
    }
  },
  {
    email: 'layla.mahmoud@example.com',
    password: 'password123',
    customer: {
      id: 'C99001',
      name: 'Layla Mahmoud',
      businessPartner: '1000678901',
      businessPartnerName: 'Layla Mahmoud'
    }
  }
]

// Mock authentication service
export const mockAuth = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    return {
      success: true,
      requiresMFA: true,
      message: 'OTP sent to your email',
      expiresIn: 5
    }
  },
  
  verifyOTP: async (email, otp) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const user = MOCK_USERS.find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Accept any OTP for demo (or specifically "000000")
    if (otp !== '000000' && otp.length !== 6) {
      throw new Error('Invalid OTP')
    }
    
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      customer: user.customer
    }
  },
  
  resendOTP: async (email) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const user = MOCK_USERS.find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      success: true,
      message: 'OTP resent successfully',
      expiresIn: 5
    }
  }
}

// Mock data services for other endpoints
export const mockData = {
  getCustomerSummary: async (customerId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const user = MOCK_USERS.find(u => u.customer.id === customerId)
    if (!user) {
      throw new Error('Customer not found')
    }
    
    return {
      success: true,
      customer: {
        id: customerId,
        name: user.customer.name,
        businessPartner: user.customer.businessPartner,
        businessPartnerName: user.customer.businessPartnerName,
        email: user.email,
        phone: '+971-50-123-4567',
        address: 'Dubai Marina, Dubai, UAE',
        accountStatus: 'Active',
        customerSince: '2020-01-15'
      },
      billing: {
        currentBalance: 1250.50,
        dueDate: '2026-02-15',
        lastPayment: {
          amount: 980.00,
          date: '2026-01-10',
          method: 'Credit Card'
        },
        averageMonthlyBill: 1100.00,
        trend: 'stable'
      },
      consumption: {
        current: 1450,
        previous: 1380,
        average: 1420,
        unit: 'kWh',
        trend: 'increasing',
        percentageChange: 5.1
      },
      services: [
        { id: 1, name: 'Electricity', status: 'Active', accountNumber: customerId + '-E' },
        { id: 2, name: 'Water', status: 'Active', accountNumber: customerId + '-W' }
      ],
      recentActivity: [
        { date: '2026-01-25', type: 'Bill Generated', amount: 1250.50, status: 'Pending' },
        { date: '2026-01-10', type: 'Payment Received', amount: 980.00, status: 'Completed' },
        { date: '2025-12-28', type: 'Bill Generated', amount: 980.00, status: 'Paid' }
      ]
    }
  },
  
  getChatbotResponse: async (query, customerId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      response: {
        text: 'Thank you for your question. This is a demo response in mock mode. Your query: "' + query + '". For full functionality, please connect to the backend service.',
        intent: 'general_inquiry',
        confidence: 0.85,
        suggestions: [
          'View your current bill',
          'Check payment history',
          'Update account information'
        ]
      }
    }
  },
  
  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      success: true,
      analytics: {
        totalCustomers: 15234,
        activeTickets: 142,
        resolvedToday: 89,
        avgResponseTime: 12.5,
        customerSatisfaction: 94.2,
        ticketsByCategory: [
          { category: 'Billing', count: 45 },
          { category: 'Technical', count: 38 },
          { category: 'General', count: 59 }
        ],
        resolutionRate: [
          { month: 'Sep', rate: 91 },
          { month: 'Oct', rate: 93 },
          { month: 'Nov', rate: 92 },
          { month: 'Dec', rate: 94 },
          { month: 'Jan', rate: 95 }
        ]
      }
    }
  },
  
  submitTicket: async (ticketData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      success: true,
      ticket: {
        id: 'TK' + Math.floor(Math.random() * 100000),
        status: 'Open',
        priority: ticketData.severity || 'Medium',
        createdAt: new Date().toISOString(),
        estimatedResolution: '2-3 business days'
      },
      message: 'Ticket created successfully in demo mode'
    }
  },
  
  getGuidance: async (query, customerId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      guidance: {
        recommendation: 'Based on your query, here are some suggestions in demo mode.',
        steps: [
          'Review your account details',
          'Check recent transactions',
          'Contact support if needed'
        ],
        estimatedTime: '5-10 minutes',
        priority: 'Medium'
      }
    }
  }
}

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 3000
    })
    return response.ok
  } catch (error) {
    return false
  }
}

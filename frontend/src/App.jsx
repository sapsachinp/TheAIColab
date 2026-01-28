import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LogOut, User as UserIcon } from 'lucide-react'
import Login from './components/Login'
import LandingPage from './components/LandingPage'
import CustomerSummary from './components/CustomerSummary'
import RequestForm from './components/RequestForm'
import Chatbot from './components/Chatbot'
import Dashboard from './components/Dashboard'
import BillPayment from './components/BillPayment'
import LanguageSwitcher from './components/LanguageSwitcher'
import FloatingChatButton from './components/FloatingChatButton'

function App() {
  const { t } = useTranslation('common')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token')
    const savedCustomer = localStorage.getItem('customer')
    if (token && savedCustomer) {
      setIsAuthenticated(true)
      setCustomer(JSON.parse(savedCustomer))
    }
  }, [])

  const handleLogin = (token, customerData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('customer', JSON.stringify(customerData))
    setIsAuthenticated(true)
    setCustomer(customerData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('customer')
    setIsAuthenticated(false)
    setCustomer(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        {isAuthenticated && (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-dewa-dark via-blue-900 to-dewa-blue text-white shadow-xl sticky top-0 z-40 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-br from-dewa-green to-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
                  >
                    D
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold">{t('header.title')}</h1>
                    <p className="text-xs text-blue-200">AI-Powered Support Platform</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{customer?.name}</span>
                  </div>
                  <LanguageSwitcher />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('header.logout')}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>
        )}

        {/* Floating Chat Button */}
        {isAuthenticated && customer && <FloatingChatButton />}

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/summary" />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/summary" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/summary"
            element={
              isAuthenticated ? (
                <CustomerSummary customer={customer} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/request"
            element={
              isAuthenticated ? (
                <RequestForm customer={customer} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <Chatbot customer={customer} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/payment"
            element={
              isAuthenticated ? (
                <BillPayment />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

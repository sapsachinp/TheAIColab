import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Login from './components/Login'
import CustomerSummary from './components/CustomerSummary'
import RequestForm from './components/RequestForm'
import Chatbot from './components/Chatbot'
import Dashboard from './components/Dashboard'
import BillPayment from './components/BillPayment'
import LanguageSwitcher from './components/LanguageSwitcher'

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {isAuthenticated && (
          <header className="bg-dewa-dark text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-dewa-green rounded-full flex items-center justify-center font-bold text-xl">
                  D
                </div>
                <h1 className="text-2xl font-bold">{t('header.title')}</h1>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-sm">{t('header.welcome')}, {customer?.name}</span>
                <LanguageSwitcher />
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {t('header.logout')}
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Routes */}
        <Routes>
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
          <Route path="/" element={<Navigate to={isAuthenticated ? "/summary" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

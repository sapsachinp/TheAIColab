import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BillPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8 h-screen flex flex-col max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/summary')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-dewa-green transition-colors font-medium rounded-lg hover:bg-white/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">💳</span>
              Bill Payment
            </h1>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-blue-900 mb-1.5">Secure Payment Portal</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                You are connected to DEWA's official payment gateway. All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-dewa-green mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading payment portal...</p>
            </div>
          </div>
        )}

        {/* Payment Iframe */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <iframe
            src="https://www.dewa.gov.ae/consumer/billing/easypay"
            title="DEWA Bill Payment"
            className="w-full h-full"
            onLoad={handleIframeLoad}
            allow="payment"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Footer Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact DEWA: <span className="font-semibold text-dewa-green">04 601 9999</span>
          </p>
        </div>
      </div>
    </div>
  )
}

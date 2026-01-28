import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BillPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/summary')}
            className="flex items-center gap-2 text-gray-600 hover:text-dewa-green transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">💳</span>
            DEWA Bill Payment
          </h1>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Secure Payment Portal</h3>
            <p className="text-xs text-blue-800">
              You are now connected to DEWA's official payment gateway. All transactions are secure and encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dewa-green mx-auto mb-4"></div>
            <p className="text-gray-600">Loading DEWA payment portal...</p>
          </div>
        </div>
      )}

      {/* Payment Iframe */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
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
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Having trouble? Contact DEWA customer service: <span className="font-semibold text-dewa-green">04 601 9999</span></p>
      </div>
    </div>
  )
}

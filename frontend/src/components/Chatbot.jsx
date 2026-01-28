import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Mic, MicOff, Volume2, VolumeX, FileText, 
  Activity, MessageSquare, BarChart3, User, Bot, X, CheckCircle
} from 'lucide-react'

export default function Chatbot({ customer }) {
  const { t } = useTranslation('chatbot')
  const { t: tCommon } = useTranslation('common')
  const { language } = useLanguage()
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: t('greeting', { name: customer?.name }),
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [requestMode, setRequestMode] = useState(false)
  const [selectedRequestType, setSelectedRequestType] = useState('')
  const [requestDetails, setRequestDetails] = useState('')
  const [requestGuidance, setRequestGuidance] = useState(null)
  const [loadingGuidance, setLoadingGuidance] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const requestTypes = [
    { value: 'billing_inquiry', label: language === 'ar' ? 'استفسار عن الفاتورة' : 'Billing Inquiry / High Bill', icon: '💰' },
    { value: 'service_outage', label: language === 'ar' ? 'انقطاع الخدمة' : 'Service Outage', icon: '⚡' },
    { value: 'meter_reading', label: language === 'ar' ? 'قراءة العداد' : 'Meter Reading Issue', icon: '📊' },
    { value: 'payment', label: language === 'ar' ? 'مشكلة في الدفع' : 'Payment Problem', icon: '💳' },
    { value: 'connection_request', label: language === 'ar' ? 'توصيل جديد' : 'New Connection', icon: '🔌' },
    { value: 'complaint', label: language === 'ar' ? 'شكوى عامة' : 'General Complaint', icon: '📝' }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize Speech Recognition (STT)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language === 'ar' ? 'ar-AE' : 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/api/chatbot/query',
        {
          customerId: customer.id,
          query: input,
          channel: 'web',
          language: language
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const aiMessage = {
        type: 'ai',
        text: response.data.response.message,
        intent: response.data.response.intent,
        confidence: response.data.response.confidence,
        suggestions: response.data.response.suggestions,
        tickets: response.data.response.tickets,
        hasExistingTickets: response.data.response.hasExistingTickets,
        existingTicketsNote: response.data.response.existingTicketsNote,
        canSubmitNew: response.data.response.canSubmitNew,
        timestamp: new Date()
      }

      // Add choice suggestions if there are existing tickets and can submit new
      if (response.data.response.canSubmitNew && response.data.response.hasExistingTickets) {
        aiMessage.suggestions = language === 'ar' 
          ? ['عرض طلباتي الحالية', 'تقديم طلب جديد على أي حال']
          : ['View my existing requests', 'Submit a new request anyway']
      }

      setMessages((prev) => [...prev, aiMessage])

      // Only trigger request mode if promptRequestForm is true (not just canSubmitNew)
      if (response.data.response.promptRequestForm) {
        setTimeout(() => {
          setRequestMode(true)
        }, 500)
      }

      // Text-to-Speech (TTS)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.text)
        utterance.lang = language === 'ar' ? 'ar-AE' : 'en-US'
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: t('error'),
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleRequestTypeSelect = async (type) => {
    setSelectedRequestType(type)
    setLoading(true)

    try {
      // Get AI explanation for this request type
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/api/proactive/explain-request',
        {
          customerId: customer.id,
          requestType: type
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const explanation = response.data.explanation
      const typeLabel = requestTypes.find(t => t.value === type)?.label || type

      // Add explanation message
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? `لقد اخترت: ${typeLabel}\n\n${explanation.description}\n\nهل ترغب في إضافة تفاصيل إضافية؟`
            : `You selected: ${typeLabel}\n\n${explanation.description}\n\nWould you like to add additional details?`,
          requestExplanation: explanation,
          showDetailsInput: true,
          timestamp: new Date()
        }
      ])
    } catch (err) {
      console.error('Error fetching explanation:', err)
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? 'تم اختيار نوع الطلب. يمكنك إضافة التفاصيل أو المتابعة مباشرة.'
            : 'Request type selected. You can add details or proceed directly.',
          showDetailsInput: true,
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async () => {
    if (!selectedRequestType) return

    // If guidance not yet loaded, get it first
    if (!requestGuidance) {
      await handleGetGuidance()
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      // Submit the ticket
      const submitResponse = await axios.post(
        'http://localhost:3001/api/backoffice/submit-ticket',
        {
          customerId: customer.id,
          requestType: selectedRequestType,
          requestDetails: requestDetails,
          aiGuidance: requestGuidance
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const ticket = submitResponse.data.ticket

      // Show success message with ticket details
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? `✅ تم تقديم طلبك بنجاح!\n\nرقم الطلب: ${ticket.ticketId}\nالأولوية: ${ticket.priority}\nالحالة: ${ticket.status}\n\nسيقوم فريقنا بمراجعة طلبك خلال 24 ساعة.`
            : `✅ Your request has been submitted successfully!\n\nTicket #${ticket.ticketId}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\n\nOur team will review your request within 24 hours.`,
          submittedTicket: ticket,
          timestamp: new Date()
        }
      ])

      // Reset request mode
      setRequestMode(false)
      setSelectedRequestType('')
      setRequestDetails('')
      setRequestGuidance(null)
    } catch (err) {
      console.error('Error submitting request:', err)
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? 'عذراً، حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.'
            : 'Sorry, there was an error submitting your request. Please try again.',
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleGetGuidance = async () => {
    if (!selectedRequestType) return

    setLoadingGuidance(true)

    try {
      const token = localStorage.getItem('token')
      
      // Remove any previous guidance messages
      setMessages((prev) => prev.filter(m => !m.guidanceData))
      
      // Get AI guidance
      const guidanceResponse = await axios.post(
        'http://localhost:3001/api/proactive/guidance',
        {
          customerId: customer.id,
          requestType: selectedRequestType,
          requestDetails: requestDetails || ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const guidance = guidanceResponse.data.guidance
      setRequestGuidance(guidance)

      // Add guidance message to chat
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? '🤖 تحليل الذكاء الاصطناعي لطلبك:'
            : '🤖 AI Analysis of Your Request:',
          guidanceData: guidance,
          showSubmitButton: true,
          timestamp: new Date()
        }
      ])
    } catch (err) {
      console.error('Error getting guidance:', err)
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: language === 'ar'
            ? 'تعذر الحصول على توصيات الذكاء الاصطناعي. هل تريد المتابعة؟'
            : 'Unable to get AI recommendations. Would you like to proceed anyway?',
          showSubmitButton: true,
          timestamp: new Date()
        }
      ])
    } finally {
      setLoadingGuidance(false)
    }
  }

  const handleCancelRequest = () => {
    setRequestMode(false)
    setSelectedRequestType('')
    setRequestDetails('')
    
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: language === 'ar'
          ? 'تم إلغاء تقديم الطلب. كيف يمكنني مساعدتك؟'
          : 'Request submission cancelled. How can I help you?',
        timestamp: new Date()
      }
    ])
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <Link
          to="/summary"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <Activity className="w-5 h-5" />
          {tCommon('navigation.summary')}
        </Link>
        <Link
          to="/request"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <FileText className="w-5 h-5" />
          {tCommon('navigation.newRequest')}
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          {tCommon('navigation.chatSupport')}
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200"
        >
          <BarChart3 className="w-5 h-5" />
          {tCommon('navigation.analytics')}
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Chat Header */}
        <div className="bg-dewa-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-dewa-green rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-bold">{t('title')}</h3>
              <p className="text-xs opacity-80">{t('subtitle')}</p>
            </div>
          </div>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
            >
              🔇 {t('stopSpeaking')}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-dewa-green text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {message.intent && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {t('intent')}: {t(`intents.${message.intent}`, { defaultValue: message.intent })} ({(message.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                )}

                {/* Display Tickets if available */}
                {message.tickets && message.tickets.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.tickets.map((ticket, idx) => (
                      <div key={ticket.ticketId} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-sm text-dewa-dark">
                              🎫 {language === 'ar' ? 'رقم الطلب' : 'Ticket'} #{ticket.ticketId}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(ticket.createdAt).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">{language === 'ar' ? 'النوع' : 'Type'}</p>
                            <p className="font-medium capitalize">{ticket.requestType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">{language === 'ar' ? 'الحالة' : 'Status'}</p>
                            <p className="font-medium flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                ticket.status === 'Open' ? 'bg-green-500' :
                                ticket.status === 'In Progress' ? 'bg-blue-500' :
                                ticket.status === 'Resolved' ? 'bg-gray-500' :
                                'bg-yellow-500'
                              }`}></span>
                              {ticket.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing tickets note */}
                {message.existingTicketsNote && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 flex items-start">
                      <span className="mr-2">ℹ️</span>
                      <span>{message.existingTicketsNote}</span>
                    </p>
                  </div>
                )}
                {/* Request Type Selection */}
                {message.showRequestForm && !selectedRequestType && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'اختر نوع الطلب:' : 'Select Request Type:'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {requestTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => handleRequestTypeSelect(type.value)}
                          className="flex items-center space-x-2 rtl:space-x-reverse p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition text-left rtl:text-right"
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-xs font-medium text-gray-800">{type.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleCancelRequest}
                      className="w-full mt-2 text-xs text-gray-600 hover:text-gray-800 py-2"
                    >
                      {language === 'ar' ? '✕ إلغاء' : '✕ Cancel'}
                    </button>
                  </div>
                )}

                {/* Details Input */}
                {message.showDetailsInput && selectedRequestType && !requestGuidance && (
                  <div className="mt-4 space-y-3">
                    {message.requestExplanation && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-purple-900 mb-2">
                          {language === 'ar' ? 'معلومات مفيدة:' : 'Helpful Information:'}
                        </p>
                        {message.requestExplanation.commonReasons && (
                          <ul className="text-xs text-purple-700 space-y-1">
                            {message.requestExplanation.commonReasons.slice(0, 2).map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    <textarea
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder={language === 'ar' ? 'أضف تفاصيل إضافية (اختياري)' : 'Add additional details (optional)'}
                      rows="3"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
                    />
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={handleGetGuidance}
                        disabled={loadingGuidance}
                        className="flex-1 bg-dewa-blue hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      >
                        {loadingGuidance ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') : (language === 'ar' ? '🤖 احصل على توصيات AI' : '🤖 Get AI Guidance')}
                      </button>
                      <button
                        onClick={handleCancelRequest}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Guidance Display */}
                {message.guidanceData && typeof message.guidanceData === 'object' && (
                  <div className="mt-4 space-y-3">
                    {/* Customer Data Analysis */}
                    {message.guidanceData.customerDataAnalysis && typeof message.guidanceData.customerDataAnalysis === 'object' && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <span>📊</span>
                          {language === 'ar' ? 'تحليل بيانات العميل' : 'Customer Data Analysis'}
                        </h4>
                        <div className="space-y-2">
                          {/* Billing Summary with detailed breakdown */}
                          {message.guidanceData.customerDataAnalysis.billingSummary && (
                            <div className="bg-white rounded p-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                {language === 'ar' ? '💰 ملخص الفواتير' : '💰 Billing Summary'}
                              </p>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-500">{language === 'ar' ? 'الحالي' : 'Current'}</p>
                                  <p className="font-bold">AED {message.guidanceData.customerDataAnalysis.billingSummary.currentBill}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">{language === 'ar' ? 'المتوقع' : 'Predicted'}</p>
                                  <p className="font-bold text-dewa-blue">AED {message.guidanceData.customerDataAnalysis.billingSummary.predictedBill}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">{language === 'ar' ? 'الفرق' : 'Variance'}</p>
                                  <p className={`font-bold ${parseFloat(message.guidanceData.customerDataAnalysis.billingSummary.variance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {parseFloat(message.guidanceData.customerDataAnalysis.billingSummary.variance) > 0 ? '+' : ''}
                                    {message.guidanceData.customerDataAnalysis.billingSummary.variance}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Consumption Insights with trend and stats */}
                          {message.guidanceData.customerDataAnalysis.consumptionInsights && (
                            <div className="bg-white rounded p-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                {language === 'ar' ? '⚡ رؤى الاستهلاك' : '⚡ Consumption Insights'}
                              </p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">{language === 'ar' ? 'الاتجاه:' : 'Trend:'}</span>
                                  <span className={`font-medium capitalize ${
                                    message.guidanceData.customerDataAnalysis.consumptionInsights.trend === 'increasing' ? 'text-red-600' :
                                    message.guidanceData.customerDataAnalysis.consumptionInsights.trend === 'decreasing' ? 'text-green-600' :
                                    'text-gray-700'
                                  }`}>
                                    {message.guidanceData.customerDataAnalysis.consumptionInsights.trend}
                                    {message.guidanceData.customerDataAnalysis.consumptionInsights.trend !== 'stable' && 
                                      ` (${Math.abs(message.guidanceData.customerDataAnalysis.consumptionInsights.variance).toFixed(1)}%)`
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">{language === 'ar' ? 'المتوسط:' : 'Average:'}</span>
                                  <span className="font-medium">{message.guidanceData.customerDataAnalysis.consumptionInsights.average} kWh</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">{language === 'ar' ? 'الأخير:' : 'Latest:'}</span>
                                  <span className="font-medium">{message.guidanceData.customerDataAnalysis.consumptionInsights.latest} kWh</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Account Status with alerts */}
                          {message.guidanceData.customerDataAnalysis.accountStatus && (
                            <div className="bg-white rounded p-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                {language === 'ar' ? '📋 حالة الحساب' : '📋 Account Status'}
                              </p>
                              {(message.guidanceData.customerDataAnalysis.accountStatus.openComplaints > 0 || 
                                message.guidanceData.customerDataAnalysis.accountStatus.hasUnpaidBills) ? (
                                <div className="space-y-1">
                                  {message.guidanceData.customerDataAnalysis.accountStatus.openComplaints > 0 && (
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-orange-600">⚠️</span>
                                      <span className="text-gray-700">{message.guidanceData.customerDataAnalysis.accountStatus.openComplaints} {language === 'ar' ? 'شكوى مفتوحة' : 'open complaint(s)'}</span>
                                    </div>
                                  )}
                                  {message.guidanceData.customerDataAnalysis.accountStatus.hasUnpaidBills && (
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-red-600">💳</span>
                                      <span className="text-gray-700">{language === 'ar' ? 'غير مدفوع:' : 'Unpaid:'} AED {message.guidanceData.customerDataAnalysis.accountStatus.unpaidAmount}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <span>✓</span> {language === 'ar' ? 'الحساب في حالة جيدة' : 'Account in good standing'}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Usage Patterns if available */}
                          {message.guidanceData.customerDataAnalysis.usagePatterns && (
                            <div className="bg-white rounded p-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                {language === 'ar' ? '📈 أنماط الاستخدام' : '📈 Usage Patterns'}
                              </p>
                              <p className="text-xs text-gray-600">{message.guidanceData.customerDataAnalysis.usagePatterns.reason}</p>
                              {message.guidanceData.customerDataAnalysis.usagePatterns.peakHours !== 'Not available' && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {language === 'ar' ? 'ساعات الذروة:' : 'Peak Hours:'} {message.guidanceData.customerDataAnalysis.usagePatterns.peakHours}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Situation Analysis */}
                    {message.guidanceData.situationAnalysis && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                          <span>🔍</span>
                          {language === 'ar' ? 'تحليل الموقف' : 'Situation Analysis'}
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {message.guidanceData.situationAnalysis}
                        </p>
                        {message.guidanceData.rootCause && (
                          <div className="mt-2 p-2 bg-white rounded">
                            <p className="text-xs font-semibold text-purple-700">
                              {language === 'ar' ? '💡 السبب الجذري:' : '💡 Root Cause:'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {message.guidanceData.rootCause}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {message.guidanceData.recommendations && Array.isArray(message.guidanceData.recommendations) && message.guidanceData.recommendations.length > 0 && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                        <h4 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                          <span>✨</span>
                          {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                        </h4>
                        <ul className="space-y-2">
                          {message.guidanceData.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white rounded p-2">
                              <span className="text-green-600 font-bold text-xs">{idx + 1}.</span>
                              <span className="text-xs text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Priority Badge */}
                    {message.guidanceData.priority && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">
                          {language === 'ar' ? 'الأولوية:' : 'Priority:'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          message.guidanceData.priority === 'High' ? 'bg-red-100 text-red-700' :
                          message.guidanceData.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {message.guidanceData.priority}
                        </span>
                      </div>
                    )}

                    {/* Submit Button */}
                    {message.showSubmitButton && (
                      <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                        <button
                          onClick={handleSubmitRequest}
                          disabled={loading}
                          className="flex-1 bg-dewa-green hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                        >
                          {loading ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (language === 'ar' ? '✓ إرسال الطلب' : '✓ Submit Request')}
                        </button>
                        <button
                          onClick={() => {
                            // Remove guidance messages from chat
                            setMessages((prev) => prev.filter(m => !m.guidanceData))
                            setRequestGuidance(null)
                            // Keep details for editing, don't clear
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                        >
                          {language === 'ar' ? '✎ تعديل' : '✎ Modify'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Submitted Ticket Display */}
                {message.submittedTicket && (
                  <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <span className="text-4xl">✅</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600">{language === 'ar' ? 'رقم الطلب' : 'Ticket #'}</p>
                        <p className="font-bold text-dewa-blue">{message.submittedTicket.ticketId}</p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-gray-600">{language === 'ar' ? 'الأولوية' : 'Priority'}</p>
                        <p className={`font-bold ${
                          message.submittedTicket.priority === 'High' ? 'text-red-600' :
                          message.submittedTicket.priority === 'Medium' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {message.submittedTicket.priority}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600 mt-3">
                      {language === 'ar' 
                        ? 'يمكنك تتبع طلبك بكتابة "تتبع الطلبات"'
                        : 'Track your request by typing "track requests"'}
                    </p>
                  </div>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-600">{t('suggestions')}:</p>
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left rtl:text-right text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition"
                      >
                        {language === 'ar' ? '←' : '→'} {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {/* Request Mode Indicator */}
          {requestMode && !selectedRequestType && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {language === 'ar' ? '📝 وضع تقديم الطلب' : '📝 Request Submission Mode'}
              </p>
              <p className="text-xs text-blue-700">
                {language === 'ar' 
                  ? 'قم بالتمرير للأعلى لاختيار نوع الطلب من الرسالة أعلاه'
                  : 'Scroll up to select a request type from the message above'}
              </p>
            </div>
          )}

          <div className="flex items-end space-x-2 rtl:space-x-reverse">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              rows="2"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent resize-none"
              disabled={requestMode && selectedRequestType}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={requestMode && selectedRequestType}
              className={`p-3 rounded-lg transition ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gray-200 hover:bg-gray-300'
              } ${requestMode && selectedRequestType ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isListening ? t('voiceButton.stop') : t('voiceButton.start')}
            >
              <span className="text-xl">{isListening ? '🔴' : '🎤'}</span>
            </button>
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim() || (requestMode && selectedRequestType)}
              className="bg-dewa-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon('buttons.send')}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isListening ? `🎤 ${t('voiceButton.listening')}` : language === 'ar' ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>

      {/* Floating Request Form Overlay - Shows when request mode is active and type selected */}
      {requestMode && !selectedRequestType && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-dewa-green p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-dewa-dark">
                {language === 'ar' ? '📝 تقديم طلب جديد' : '📝 Submit New Request'}
              </h3>
              <button
                onClick={handleCancelRequest}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {language === 'ar' 
                ? 'اختر نوع الطلب الذي تريد تقديمه:'
                : 'Select the type of request you want to submit:'}
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {requestTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleRequestTypeSelect(type.value)}
                  className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-dewa-green rounded-xl transition-all transform hover:scale-105"
                >
                  <span className="text-3xl">{type.icon}</span>
                  <span className="text-xs font-medium text-gray-800 text-center leading-tight">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Chatbot({ customer }) {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: `Hello ${customer?.name}! I'm your AI assistant. How can I help you today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

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
  }, [])

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
          language: 'en'
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
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, aiMessage])

      // Text-to-Speech (TTS)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.text)
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
          text: 'I apologize, I\'m having trouble processing your request. Please try again.',
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
          className="px-4 py-2 bg-dewa-green text-white rounded-lg font-medium"
        >
          Chat Support
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
        >
          Analytics
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Chat Header */}
        <div className="bg-dewa-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-dewa-green rounded-full flex items-center justify-center mr-3">
              🤖
            </div>
            <div>
              <h3 className="font-bold">DEWA AI Assistant</h3>
              <p className="text-xs opacity-80">Voice & Text Support</p>
            </div>
          </div>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
            >
              🔇 Stop Speaking
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
                      Intent: {message.intent} ({(message.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-600">Quick actions:</p>
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition"
                      >
                        → {suggestion}
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
          <div className="flex items-end space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice..."
              rows="2"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent resize-none"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-lg transition ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <span className="text-xl">{isListening ? '🔴' : '🎤'}</span>
            </button>
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-dewa-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isListening ? '🎤 Listening... Speak now' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>
    </div>
  )
}

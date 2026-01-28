import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Zap } from 'lucide-react'

export default function FloatingChatButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  
  // Don't show on chat or login page
  if (location.pathname === '/chat' || location.pathname === '/login') {
    return null
  }

  const handleClick = () => {
    navigate('/chat')
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="relative w-16 h-16 bg-gradient-to-br from-dewa-green to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-dewa-green/50 transition-shadow group overflow-hidden"
        >
          {/* Pulse animation ring */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-dewa-green rounded-full"
          />
          
          {/* Icon */}
          <div className="relative z-10">
            <MessageCircle className="w-7 h-7" strokeWidth={2.5} />
          </div>

          {/* Notification badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
          >
            <Zap className="w-3 h-3 text-white" />
          </motion.div>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl">
                Chat with AI Assistant
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                  <div className="border-8 border-transparent border-l-gray-900" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional: Floating minimized chat preview */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-dewa-green to-emerald-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online - Ready to help
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get instant support with voice & text chat, bill inquiries, and smart request guidance.
            </p>
            <button
              onClick={handleClick}
              className="w-full py-2 bg-gradient-to-r from-dewa-green to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Start Chatting
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

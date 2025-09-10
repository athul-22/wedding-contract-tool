'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ 
  title = "Loading Wedding Contracts", 
  subtitle = "Setting up your workspace...",
  size = 'lg' 
}: LoadingSpinnerProps) {
  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  }

  const containerSizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14', 
    lg: 'w-16 h-16'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-neutral-50 to-primary-50 flex items-center justify-center">
      <motion.div 
        className="bg-white/80 backdrop-blur-md rounded-3xl p-12 shadow-large border border-white/40 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className={`${containerSizes[size]} bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow animate-glow mx-auto mb-6`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Loader2 className="text-white animate-spin" size={iconSizes[size]} />
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-neutral-800 mb-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-neutral-600"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  )
}
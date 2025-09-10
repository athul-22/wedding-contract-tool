'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Camera, UtensilsCrossed, Flower } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials. Please try again.')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const testAccounts = [
    { email: 'photographer@test.com', type: 'Photographer', icon: Camera },
    { email: 'caterer@test.com', type: 'Caterer', icon: UtensilsCrossed },
    { email: 'florist@test.com', type: 'Florist', icon: Flower }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-neutral-50 to-primary-50 flex">
      {/* Left Side - Welcome Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-primary-300/10 to-primary-200/20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="animate-float"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-8 shadow-glow">
              <span className="text-6xl font-bold text-white">W</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl font-bold text-neutral-800 mb-6 leading-tight"
          >
            WELCOME!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-neutral-600 max-w-md leading-relaxed"
          >
            Log in to access your professional contract management tools, track your progress, and create beautiful wedding contracts with AI assistance.
          </motion.p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-coral-200/40 rounded-full blur-lg animate-float" />
        <div className="absolute top-1/2 right-32 w-16 h-16 bg-warm-300/50 rounded-full blur-md" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <span className="text-3xl font-bold text-white">W</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Welcome!</h1>
            <p className="text-neutral-600">Professional contract management for wedding vendors</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-large border border-white/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-neutral-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-neutral-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-4"
                >
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(248, 118, 89, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Continue'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-neutral-600 text-sm mb-4 text-center font-medium">OR</p>
              <p className="text-neutral-700 text-sm mb-4 text-center">Quick access with test accounts:</p>
              <div className="space-y-3">
                {testAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(248, 118, 89, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEmail(account.email)
                      setPassword('password123')
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 hover:border-primary-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                        <account.icon size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="text-neutral-800 text-sm font-medium group-hover:text-primary-700 transition-colors">
                          {account.type}
                        </div>
                        <div className="text-neutral-500 text-xs">{account.email}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-neutral-500 text-xs text-center mt-4">Password: password123</p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-neutral-500">
                By proceeding, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">Terms of use</a>.
                <br />
                Read our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Edit3, Check, User, LogOut, Sparkles, Save, X, Calendar, MapPin, Package, DollarSign, Loader2, Users } from 'lucide-react'
import SignaturePad from 'react-signature-canvas'
import { Contract } from '@/types'
import ContractEditor from '@/components/ContractEditor'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [signingContract, setSigningContract] = useState<Contract | null>(null)
  const [signaturePadRef, setSignaturePadRef] = useState<any>(null)
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw')
  const [typedSignature, setTypedSignature] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')

  const [newContract, setNewContract] = useState({
    clientName: '',
    eventDate: '',
    eventVenue: '',
    servicePackage: '',
    amount: '',
    content: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    // Load contracts from localStorage
    const savedContracts = localStorage.getItem(`contracts_${session.user.id}`)
    if (savedContracts) {
      setContracts(JSON.parse(savedContracts))
    }
  }, [session, status, router])

  const saveContracts = (newContracts: Contract[]) => {
    if (session?.user) {
      localStorage.setItem(`contracts_${session.user.id}`, JSON.stringify(newContracts))
      setContracts(newContracts)
    }
  }

  const generateAIContent = async () => {
    if (!session?.user) return
    
    setIsGenerating(true)
    setGenerationProgress('Connecting to AI...')
    
    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vendorType: (session.user as any).vendorType,
          clientName: newContract.clientName,
          eventDate: newContract.eventDate,
          eventVenue: newContract.eventVenue,
          servicePackage: newContract.servicePackage,
          amount: newContract.amount
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      setGenerationProgress('Generating contract...')
      setNewContract(prev => ({ ...prev, content: '' }))
      
      let accumulatedContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              setIsGenerating(false)
              setGenerationProgress('')
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                setNewContract(prev => ({ 
                  ...prev, 
                  content: accumulatedContent 
                }))
                setGenerationProgress('Generating contract...')
              }
            } catch (e) {
              // Ignore parsing errors for partial data
            }
          }
        }
      }
      
    } catch (error) {
      console.error('AI generation error:', error)
      setGenerationProgress('Using fallback content...')
      
      // Fallback to mock content with simulated streaming
      const mockContent = generateMockContent()
      const chunks = mockContent.match(/.{1,50}/g) || [mockContent]
      
      setNewContract(prev => ({ ...prev, content: '' }))
      
      for (let i = 0; i < chunks.length; i++) {
        setTimeout(() => {
          setNewContract(prev => ({ 
            ...prev, 
            content: prev.content + chunks[i] 
          }))
          
          if (i === chunks.length - 1) {
            setIsGenerating(false)
            setGenerationProgress('')
          }
        }, i * 100)
      }
    }
  }

  const generateMockContent = () => {
    const vendorType = (session?.user as any)?.vendorType || 'vendor'
    return `WEDDING ${vendorType.toUpperCase()} SERVICE AGREEMENT

This agreement is made between ${session?.user?.name || 'Vendor'} ("Service Provider") and ${newContract.clientName} ("Client") for ${vendorType} services.

EVENT DETAILS:
- Event Date: ${newContract.eventDate}
- Venue: ${newContract.eventVenue}
- Service Package: ${newContract.servicePackage}
- Total Amount: $${newContract.amount}

TERMS AND CONDITIONS:

1. PAYMENT TERMS
A deposit of 50% is required to secure the date. The remaining balance is due 30 days before the event date.

2. CANCELLATION POLICY  
If the Client cancels more than 90 days before the event, 50% of the deposit will be refunded. Cancellations within 90 days forfeit the entire deposit.

3. SERVICE DELIVERY
The Service Provider agrees to deliver the agreed-upon services on the specified date and location.

4. LIABILITY
The Service Provider's liability is limited to the total contract amount. The Service Provider is not responsible for circumstances beyond their control.

5. FORCE MAJEURE
Neither party shall be liable for delays or failures in performance due to acts of God, government regulations, or other circumstances beyond reasonable control.

By signing below, both parties agree to the terms outlined in this contract.

Service Provider: ${session?.user?.name || 'Vendor'}
Date: ${new Date().toLocaleDateString()}

Client: ${newContract.clientName}
Date: _______________`
  }

  const createContract = () => {
    if (!session?.user) return

    const contract: Contract = {
      id: Date.now().toString(),
      vendorId: session.user.id || '',
      clientName: newContract.clientName,
      eventDate: newContract.eventDate,
      eventVenue: newContract.eventVenue,
      servicePackage: newContract.servicePackage,
      amount: parseFloat(newContract.amount) || 0,
      content: newContract.content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedContracts = [...contracts, contract]
    saveContracts(updatedContracts)
    
    setNewContract({
      clientName: '',
      eventDate: '',
      eventVenue: '',
      servicePackage: '',
      amount: '',
      content: ''
    })
    setIsCreating(false)
  }

  const updateContract = () => {
    if (!editingContract) return

    const updatedContracts = contracts.map(c => 
      c.id === editingContract.id 
        ? { ...editingContract, updatedAt: new Date().toISOString() }
        : c
    )
    saveContracts(updatedContracts)
    setEditingContract(null)
  }

  const signContract = () => {
    if (!signingContract) return

    let signature = ''
    if (signatureMode === 'draw' && signaturePadRef) {
      signature = signaturePadRef.toDataURL()
    } else if (signatureMode === 'type') {
      signature = typedSignature
    }

    const updatedContracts = contracts.map(c =>
      c.id === signingContract.id
        ? { ...c, status: 'signed' as const, signature, updatedAt: new Date().toISOString() }
        : c
    )
    saveContracts(updatedContracts)
    setSigningContract(null)
    setTypedSignature('')
  }

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-neutral-50 to-primary-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-large border border-white/40"
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow animate-glow">
                <span className="text-3xl font-bold text-white">W</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 mb-1">Wedding Contracts</h1>
                <p className="text-neutral-600 font-medium">Welcome back, {session.user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <p className="text-neutral-500 text-sm capitalize">{(session.user as any)?.vendorType} Services</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(248, 118, 89, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-600 transition-all duration-300 shadow-medium"
              >
                <Plus size={20} />
                New Contract
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-white/60 text-neutral-700 px-4 py-3 rounded-2xl border border-neutral-200 hover:bg-white/80 hover:border-neutral-300 transition-all duration-300"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Contracts List */}
        <div className="grid gap-6 mb-8">
          <AnimatePresence>
            {contracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-large border border-white/40 hover:shadow-glow-lg transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300 flex-shrink-0">
                      <Users size={24} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">{contract.clientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          contract.status === 'signed' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {contract.status === 'signed' ? (
                            <>
                              <Check size={12} />
                              Signed
                            </>
                          ) : (
                            <>
                              <FileText size={12} />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-neutral-600 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary-500" />
                          <span>{new Date(contract.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-coral-500" />
                          <span className="truncate">{contract.eventVenue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-warm-500" />
                          <span className="truncate">{contract.servicePackage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-500" />
                          <span className="font-semibold text-green-600">${contract.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-neutral-400">
                        Created: {new Date(contract.createdAt).toLocaleDateString()} • 
                        Updated: {new Date(contract.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(248, 118, 89, 0.1)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingContract(contract)}
                      className="p-3 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      title="Edit Contract"
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    {contract.status === 'draft' && (
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSigningContract(contract)}
                        className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all duration-200"
                        title="Sign Contract"
                      >
                        <Check size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>
                
                {contract.status === 'signed' && contract.signature && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <p className="text-neutral-600 text-sm mb-3 font-medium">Digital Signature:</p>
                    {contract.signature.startsWith('data:image') ? (
                      <div className="inline-block">
                        <img src={contract.signature} alt="Signature" className="max-w-xs h-16 bg-white rounded-xl shadow-soft border border-neutral-100" />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-warm-50 to-neutral-50 p-4 rounded-xl inline-block shadow-soft border border-neutral-100">
                        <span className="font-signature text-2xl text-neutral-800">{contract.signature}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {contracts.length === 0 && !isCreating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 shadow-large border border-white/40 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <FileText size={40} className="text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3">No contracts yet</h3>
                <p className="text-neutral-600 mb-8 leading-relaxed">Create your first professional contract to get started with your wedding business management.</p>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(248, 118, 89, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreating(true)}
                  className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-primary-600 transition-all duration-300 shadow-medium inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Your First Contract
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Contract Bottom Sheet */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsCreating(false)}
          >
            <motion.div 
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 300,
                mass: 0.8,
                duration: 0.6 
              }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-2xl max-h-[92vh] overflow-hidden"
              style={{
                boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.12), 0 -2px 16px rgba(0, 0, 0, 0.08)'
              }}
            >
              <motion.div 
                className="flex justify-center py-4 bg-white sticky top-0 z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
              </motion.div>
              
              <div className="px-6 pb-6 max-h-[calc(92vh-4rem)] overflow-y-auto">
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-800 mb-2">Create New Contract</h2>
                    <p className="text-neutral-600">Build a professional contract for your wedding services</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(248, 118, 89, 0.1)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCreating(false)}
                    className="p-3 text-neutral-400 hover:text-primary-600 transition-colors rounded-2xl"
                  >
                    <X size={24} />
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-2 gap-6 mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <label className="block text-neutral-700 text-sm font-semibold mb-3">Client Name</label>
                    <input
                      type="text"
                      value={newContract.clientName}
                      onChange={(e) => setNewContract(prev => ({ ...prev, clientName: e.target.value }))}
                      className="w-full px-4 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      placeholder="Enter client name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <label className="block text-neutral-700 text-sm font-semibold mb-3">Event Date</label>
                    <input
                      type="date"
                      value={newContract.eventDate}
                      onChange={(e) => setNewContract(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-4 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                  >
                    <label className="block text-neutral-700 text-sm font-semibold mb-3">Event Venue</label>
                    <input
                      type="text"
                      value={newContract.eventVenue}
                      onChange={(e) => setNewContract(prev => ({ ...prev, eventVenue: e.target.value }))}
                      className="w-full px-4 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      placeholder="Enter venue"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <label className="block text-neutral-700 text-sm font-semibold mb-3">Service Package</label>
                    <input
                      type="text"
                      value={newContract.servicePackage}
                      onChange={(e) => setNewContract(prev => ({ ...prev, servicePackage: e.target.value }))}
                      className="w-full px-4 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      placeholder="Enter package details"
                    />
                  </motion.div>

                  <motion.div 
                    className="md:col-span-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.3 }}
                  >
                    <label className="block text-neutral-700 text-sm font-semibold mb-3">Amount ($)</label>
                    <input
                      type="number"
                      value={newContract.amount}
                      onChange={(e) => setNewContract(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      placeholder="Enter amount"
                    />
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <label className="block text-neutral-700 text-sm font-semibold mb-4">Contract Content</label>
                  <ContractEditor
                    content={newContract.content}
                    onChange={(content) => setNewContract(prev => ({ ...prev, content }))}
                    onAIAssist={generateAIContent}
                    placeholder="Contract content will appear here... Use AI Assist to generate professional contract language."
                    className="w-full"
                    isGenerating={isGenerating}
                    generationProgress={generationProgress}
                  />
                </motion.div>

                <motion.div 
                  className="flex gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createContract}
                    disabled={!newContract.clientName || !newContract.content || isGenerating}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-medium"
                  >
                    <Save size={20} />
                    Create Contract
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                    className="px-8 py-4 bg-white/60 text-neutral-700 rounded-2xl border border-neutral-200 hover:bg-white/80 hover:text-neutral-800 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Contract Modal */}
      <AnimatePresence>
        {editingContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setEditingContract(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-4xl border border-white/40 shadow-large max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-800 mb-2">Edit Contract</h2>
                  <p className="text-neutral-600">Update your wedding service contract details</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(248, 118, 89, 0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingContract(null)}
                  className="p-3 text-neutral-400 hover:text-primary-600 transition-colors rounded-2xl"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-neutral-700 text-sm font-semibold mb-3">Client Name</label>
                  <input
                    type="text"
                    value={editingContract.clientName}
                    onChange={(e) => setEditingContract(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                    className="w-full px-4 py-4 bg-white/60 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm font-semibold mb-3">Event Date</label>
                  <input
                    type="date"
                    value={editingContract.eventDate}
                    onChange={(e) => setEditingContract(prev => prev ? { ...prev, eventDate: e.target.value } : null)}
                    className="w-full px-4 py-4 bg-white/60 border border-neutral-200 rounded-2xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm font-semibold mb-3">Event Venue</label>
                  <input
                    type="text"
                    value={editingContract.eventVenue}
                    onChange={(e) => setEditingContract(prev => prev ? { ...prev, eventVenue: e.target.value } : null)}
                    className="w-full px-4 py-4 bg-white/60 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm font-semibold mb-3">Service Package</label>
                  <input
                    type="text"
                    value={editingContract.servicePackage}
                    onChange={(e) => setEditingContract(prev => prev ? { ...prev, servicePackage: e.target.value } : null)}
                    className="w-full px-4 py-4 bg-white/60 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-neutral-700 text-sm font-semibold mb-3">Amount ($)</label>
                  <input
                    type="number"
                    value={editingContract.amount}
                    onChange={(e) => setEditingContract(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-4 bg-white/60 border border-neutral-200 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-neutral-700 text-sm font-semibold mb-4">Contract Content</label>
                <ContractEditor
                  content={editingContract.content}
                  onChange={(content) => setEditingContract(prev => prev ? { ...prev, content } : null)}
                  placeholder="Edit your contract content..."
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={updateContract}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-medium"
                >
                  <Save size={20} />
                  Update Contract
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingContract(null)}
                  className="px-8 py-4 bg-white/60 text-neutral-700 rounded-2xl border border-neutral-200 hover:bg-white/80 hover:text-neutral-800 transition-all duration-200 font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Contract Modal */}
      <AnimatePresence>
        {signingContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setSigningContract(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl border border-white/40 shadow-large"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-800 mb-2">Sign Contract</h2>
                  <p className="text-neutral-600">Add your digital signature to finalize the agreement</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(248, 118, 89, 0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSigningContract(null)}
                  className="p-3 text-neutral-400 hover:text-primary-600 transition-colors rounded-2xl"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="mb-8 p-6 bg-gradient-to-r from-warm-50 to-neutral-50 rounded-2xl border border-neutral-200/60">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{signingContract.clientName}</h3>
                <p className="text-neutral-600 mb-1">Event: {new Date(signingContract.eventDate).toLocaleDateString()}</p>
                <p className="text-neutral-600">Venue: {signingContract.eventVenue}</p>
                <p className="text-neutral-800 font-semibold mt-3">Amount: ${signingContract.amount.toLocaleString()}</p>
              </div>

              <div className="mb-8">
                <div className="flex gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSignatureMode('draw')}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                      signatureMode === 'draw' 
                        ? 'bg-primary-500 text-white shadow-glow' 
                        : 'bg-white/60 text-neutral-700 border border-neutral-200 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    Draw Signature
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSignatureMode('type')}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                      signatureMode === 'type' 
                        ? 'bg-primary-500 text-white shadow-glow' 
                        : 'bg-white/60 text-neutral-700 border border-neutral-200 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    Type Signature
                  </motion.button>
                </div>

                {signatureMode === 'draw' ? (
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-soft">
                    <SignaturePad
                      ref={setSignaturePadRef}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'signature-canvas w-full h-48'
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => signaturePadRef?.clear()}
                      className="mt-4 text-neutral-600 text-sm hover:text-primary-600 transition-colors font-medium"
                    >
                      Clear Signature
                    </motion.button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-soft">
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type your full name"
                      className="w-full px-6 py-4 bg-neutral-50 rounded-2xl text-neutral-800 text-2xl font-signature text-center border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                      style={{ fontFamily: 'cursive' }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={signContract}
                  disabled={signatureMode === 'draw' ? (signaturePadRef?.isEmpty?.() !== false) : !typedSignature.trim()}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-medium"
                >
                  <Check size={20} />
                  Sign Contract
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSigningContract(null)}
                  className="px-8 py-4 bg-white/60 text-neutral-700 rounded-2xl border border-neutral-200 hover:bg-white/80 hover:text-neutral-800 transition-all duration-200 font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

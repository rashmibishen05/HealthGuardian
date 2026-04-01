import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeartbeat, FaPills, FaRobot, FaStethoscope, FaCalendarAlt, FaFolder, FaSearch, FaCalculator, FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from './utils/ThemeContext'
import SOSEmergency from './components/SOSEmergency'
import MedicineInfo from './components/MedicineInfo'
import AIHealthAssistant from './components/AIHealthAssistant'
import HealthTracker from './components/HealthTracker'
import MedicationReminders from './components/MedicationReminders'
import HealthRecords from './components/HealthRecords'
import SymptomChecker from './components/SymptomChecker'
import HealthCalculators from './components/HealthCalculators'
import Disclaimer from './components/Disclaimer'

type TabType = 'sos' | 'medicine' | 'ai' | 'tracker' | 'reminders' | 'records' | 'symptoms' | 'calculators'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  color: string
  gradient: string
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('sos')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
      localStorage.setItem('hasSeenOnboarding', 'true')
    }
  }, [])

  const tabs: Tab[] = [
    {
      id: 'sos',
      label: 'SOS Emergency',
      icon: <FaHeartbeat />,
      color: 'red',
      gradient: 'gradient-emergency'
    },
    {
      id: 'medicine',
      label: 'Medicine Info',
      icon: <FaPills />,
      color: 'blue',
      gradient: 'gradient-primary'
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: <FaRobot />,
      color: 'purple',
      gradient: 'gradient-ai'
    },
    {
      id: 'tracker',
      label: 'Health Tracker',
      icon: <FaStethoscope />,
      color: 'green',
      gradient: 'gradient-health'
    },
    {
      id: 'reminders',
      label: 'Medications',
      icon: <FaCalendarAlt />,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'records',
      label: 'Records',
      icon: <FaFolder />,
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'symptoms',
      label: 'Symptom Checker',
      icon: <FaSearch />,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'calculators',
      label: 'Calculators',
      icon: <FaCalculator />,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 transition-colors duration-500 bg-pattern">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-30 border-b border-white/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeartbeat className="text-white text-2xl" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient-animated">
                  Offline Health Guardian
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your AI-powered health companion
                </p>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="glass-button p-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <FaMoon className="text-blue-600 text-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <FaSun className="text-yellow-500 text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Disclaimer */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Disclaimer />
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-2"
        >
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative py-3 px-2 rounded-xl font-semibold text-sm
                  transition-all duration-300
                  ${activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                  }
                `}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="text-xs hidden md:block">{tab.label}</span>
                </div>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    style={{ zIndex: -1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tab Content with smooth transitions */}
      <div className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'sos' && <SOSEmergency />}
            {activeTab === 'medicine' && <MedicineInfo />}
            {activeTab === 'ai' && <AIHealthAssistant />}
            {activeTab === 'tracker' && <HealthTracker />}
            {activeTab === 'reminders' && <MedicationReminders />}
            {activeTab === 'records' && <HealthRecords />}
            {activeTab === 'symptoms' && <SymptomChecker />}
            {activeTab === 'calculators' && <HealthCalculators />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Quick SOS */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl flex items-center justify-center z-40 hover:shadow-red-500/50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActiveTab('sos')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <FaHeartbeat className="text-2xl animate-pulse" />
      </motion.button>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOnboarding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-gradient mb-4">
                Welcome to Offline Health Guardian! 🏥
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>Your comprehensive offline health companion with:</p>
                <ul className="space-y-2 ml-4">
                  <li>✨ <strong>SOS Emergency</strong> - Quick access to emergency services</li>
                  <li>💊 <strong>Medicine Info</strong> - Search & scan medicines</li>
                  <li>🤖 <strong>AI Health Assistant</strong> - 24/7 health advice</li>
                  <li>📊 <strong>Health Tracker</strong> - Monitor your vitals</li>
                  <li>⏰ <strong>Medication Reminders</strong> - Never miss a dose</li>
                  <li>📁 <strong>Health Records</strong> - Store medical documents</li>
                  <li>🔍 <strong>Symptom Checker</strong> - AI-powered diagnosis</li>
                  <li>🧮 <strong>Health Calculators</strong> - BMI, calories & more</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">
                    <strong>Disclaimer:</strong> This app is for informational purposes only and not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="mt-6 w-full btn-primary py-3 text-lg"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

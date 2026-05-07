import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHeartbeat, FaPills, FaRobot, FaExclamationTriangle, 
  FaFileMedical, FaBars, FaTimes, FaMoon, FaSun, FaShieldAlt,
  FaCalculator, FaClock, FaStethoscope, FaChartLine, FaCog
} from 'react-icons/fa'
import SOSEmergency from './components/SOSEmergency'
import MedicineInfo from './components/MedicineInfo'
import AIHealthAssistant from './components/AIHealthAssistant'
import HealthVitals from './components/HealthVitals'
import HealthRecords from './components/HealthRecords'
import HealthTracker from './components/HealthTracker'
import HealthCalculators from './components/HealthCalculators'
import MedicationReminders from './components/MedicationReminders'
import SymptomChecker from './components/SymptomChecker'
import Disclaimer from './components/Disclaimer'
import Settings from './components/Settings'
import { useTheme } from './utils/ThemeContext'
import Auth from './components/Auth'
import { syncToCloud } from './utils/sync'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'sos'
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString())
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
    // Auto-sync on tab switch if online
    const email = localStorage.getItem('userEmail')
    if (email && isOnline) syncToCloud(email)
  }, [activeTab, isOnline])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const tabs = [
    { id: 'sos', label: 'SOS EMERGENCY', icon: <FaExclamationTriangle />, color: 'from-red-600 to-rose-600' },
    { id: 'health', label: 'AI ASSISTANT', icon: <FaRobot />, color: 'from-blue-600 to-indigo-600' },
    { id: 'medicine', label: 'MEDICINE INFO', icon: <FaPills />, color: 'from-emerald-600 to-teal-600' },
    { id: 'vitals', label: 'HEALTH VITALS', icon: <FaHeartbeat />, color: 'from-orange-600 to-amber-600' },
    { id: 'records', label: 'RECORDS', icon: <FaFileMedical />, color: 'from-purple-600 to-fuchsia-600' },
    { id: 'reminders', label: 'REMINDERS', icon: <FaClock />, color: 'from-pink-600 to-rose-600' },
    { id: 'trends', label: 'TRENDS', icon: <FaChartLine />, color: 'from-green-600 to-emerald-600' },
    { id: 'calculators', label: 'CALCULATORS', icon: <FaCalculator />, color: 'from-cyan-600 to-blue-600' },
    { id: 'symptoms', label: 'SYMPTOMS', icon: <FaStethoscope />, color: 'from-indigo-600 to-purple-600' },
    { id: 'settings', label: 'SETTINGS', icon: <FaCog />, color: 'from-slate-600 to-slate-800' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'sos': return <SOSEmergency />
      case 'health': return <AIHealthAssistant />
      case 'medicine': return <MedicineInfo />
      case 'vitals': return <HealthVitals />
      case 'records': return <HealthRecords />
      case 'reminders': return <MedicationReminders />
      case 'trends': return <HealthTracker />
      case 'calculators': return <HealthCalculators />
      case 'symptoms': return <SymptomChecker />
      case 'settings': return <Settings />
      default: return <SOSEmergency />
    }
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 font-sans transition-colors duration-500">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px]"
        />
      </div>

      {/* Premium Navigation Header */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200 dark:border-white/5 py-3 px-6 md:px-12 flex justify-between items-center backdrop-blur-2xl">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('sos')}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-110 transition-transform">
            <FaHeartbeat className="text-white text-2xl animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">HEALTH GUARDIAN</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {isOnline ? 'Active: Global Medical Engine' : 'Active: Secure Offline Vault'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-200/50 dark:bg-white/5 p-1.5 rounded-[1.5rem] border border-slate-300 dark:border-white/10 overflow-x-auto scrollbar-none max-w-[65vw]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[10px] xl:text-[11px] font-black tracking-widest transition-all duration-300 shrink-0
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5'
                }
              `}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-pill"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl shadow-xl shadow-blue-600/20 -z-10`}
                />
              )}
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-blue-600" />}
          </button>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black tracking-tighter text-blue-400 uppercase">System Status</span>
            <span className="text-xs font-bold text-slate-300">Vault Secure</span>
          </div>
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 z-[70] p-8 shadow-2xl border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black text-white">MENU</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="text-2xl text-slate-400"><FaTimes /></button>
              </div>
              <div className="flex flex-col gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white` : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="max-w-[1400px] mx-auto px-4 py-8 md:px-12 text-slate-900 dark:text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Disclaimer />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <FaShieldAlt className="text-blue-500 text-2xl" />
             <span className="text-sm font-black tracking-widest text-slate-400">ENCRYPTED OFFLINE DATA PROTECTION</span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center md:text-right">
            Offline Health Guardian v2.1 • No Data Leaves This Device
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

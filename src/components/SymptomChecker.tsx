import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { symptomCheckerTree, getSeverityColor } from '../data/symptomChecker'
import { searchDiseases, type DiseaseInfo } from '../data/diseases'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { FaSearch, FaStethoscope, FaArrowLeft, FaVial, FaGlobe, FaRobot } from 'react-icons/fa'

function SymptomChecker() {
  const [currentNode, setCurrentNode] = useState(symptomCheckerTree[0])
  const [history, setHistory] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DiseaseInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchingOnline, setSearchingOnline] = useState(false)
  const [isOnline] = useState(navigator.onLine)

  const handleAnswer = (nextId: string) => {
    const nextNode = symptomCheckerTree.find(n => n.id === nextId)
    if (nextNode) {
      setHistory([...history, currentNode.id])
      setCurrentNode(nextNode)
    }
  }

  const restart = () => {
    setCurrentNode(symptomCheckerTree[0])
    setHistory([])
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
  }

  const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (q.length > 2) {
      setIsSearching(true)
      const results = searchDiseases(q)
      setSearchResults(results)
      
      if (results.length === 0 && isOnline) {
        // AI Fallback
        handleOnlineDiagnosis(q)
      }
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  const handleOnlineDiagnosis = async (query: string) => {
    setSearchingOnline(true)
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const prompt = `Provide medical information for the condition "${query}" in JSON format.
      Structure: { "name": "...", "severity": "low/medium/high/emergency", "symptoms": ["...", "..."], "advice": "..." }
      Keep advice professional and concise. ONLY return JSON.`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      const jsonStr = text.replace(/```json|```/g, '').trim()
      const data = JSON.parse(jsonStr) as DiseaseInfo
      
      setSearchResults([data])
    } catch (error) {
      console.error('Online diagnosis failed:', error)
    } finally {
      setSearchingOnline(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
             <FaStethoscope />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">SYMPTOM CHECKER</h2>
        </div>
        {history.length > 0 && (
          <button onClick={() => {
            const prevId = history[history.length - 1]
            const prevNode = symptomCheckerTree.find(n => n.id === prevId)
            if (prevNode) {
              setCurrentNode(prevNode)
              setHistory(history.slice(0, -1))
            }
          }} className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
            <FaArrowLeft /> Back
          </button>
        )}
      </div>

      {/* Global Search Fallback */}
      <div className="relative mb-8">
         <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
         <input 
            type="text" 
            placeholder="Search symptoms or any disease (e.g. Malaria, Diabetes)..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all text-sm font-medium"
         />
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">Search Results ({searchResults.length})</h4>
                <button onClick={() => setIsSearching(false)} className="text-xs font-bold text-blue-600">Back to Diagnostic Tree</button>
             </div>
             {searchingOnline ? (
               <div className="text-center py-20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-600 font-bold">AI Companion is analyzing medical data...</p>
               </div>
             ) : searchResults.length > 0 ? (
               searchResults.map((d, i) => (
                 <div key={i} className="glass-card bg-white dark:bg-slate-800/50 p-6 border-none shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{d.name}</h3>
                          {!searchDiseases(d.name).length && <FaGlobe className="text-blue-400 text-xs" title="Online AI Source" />}
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         d.severity === 'emergency' ? 'bg-red-500 text-white' :
                         d.severity === 'high' ? 'bg-orange-500 text-white' :
                         d.severity === 'medium' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                       }`}>{d.severity}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Common Symptoms</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                       {d.symptoms.map((s, si) => <span key={si} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-[11px] font-medium">{s}</span>)}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                       <FaVial className="inline mr-2 text-blue-500" /> {d.advice}
                    </p>
                 </div>
               ))
             ) : (
               <div className="text-center py-12 text-slate-400">
                  <FaRobot className="text-4xl mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Condition not found.</p>
                  <p className="text-xs mt-1">
                    {isOnline ? "We couldn't generate a specific report for this. Try describing symptoms to the AI Assistant." : "Connect to the internet for a Global AI diagnosis."}
                  </p>
               </div>
             )}
          </motion.div>
        ) : (
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`p-8 rounded-3xl bg-${getSeverityColor(currentNode.severity)}-50/50 dark:bg-${getSeverityColor(currentNode.severity)}-900/10 border-2 border-${getSeverityColor(currentNode.severity)}-100 dark:border-${getSeverityColor(currentNode.severity)}-900/30`}>
              <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight text-slate-900 dark:text-white">{currentNode.question}</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{currentNode.advice}</p>
            </div>

            {currentNode.nextQuestions && currentNode.nextQuestions.length > 0 ? (
              <div className="grid gap-3">
                {currentNode.nextQuestions.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(option.nextId)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{option.answer}</span>
                      <FaArrowLeft className="rotate-180 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {currentNode.possibleConditions && (
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">Possible Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentNode.possibleConditions.map((condition, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-black border border-blue-100 dark:border-blue-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={restart} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  START NEW ASSESSMENT
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SymptomChecker

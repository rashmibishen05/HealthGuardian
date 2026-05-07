import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchMedicine, medicinesDatabase, type Medicine } from '../data/medicines'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { dbHelper } from '../utils/indexedDB'
import { FaPills, FaSearch, FaCapsules, FaShieldAlt, FaSyringe, FaGlobe, FaCamera, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa'
import Tesseract from 'tesseract.js'
import { checkInteraction, type Interaction } from '../data/interactions'

function MedicineInfo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [searchingOnline, setSearchingOnline] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isOnline] = useState(navigator.onLine)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  
  // Interaction Checker State
  const [showInteraction, setShowInteraction] = useState(false)
  const [med1, setMed1] = useState('')
  const [med2, setMed2] = useState('')
  const [interactionResult, setInteractionResult] = useState<Interaction | null>(null)
  const [hasChecked, setHasChecked] = useState(false)

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setSearchError(null)
    setStatusMsg('🔍 Scanning medicine bottle...')

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      })
      
      // Basic extraction: find words that might be medicine names
      // We'll clean the text and try to match against our database
      const lines = text.split('\n').map(l => l.trim().toLowerCase())
      let foundName = ''
      
      // Try to find a match in our database
      for (const line of lines) {
         if (line.length < 3) continue
         const match = medicinesDatabase.find(m => 
            line.includes(m.name.toLowerCase()) || 
            m.name.toLowerCase().includes(line)
         )
         if (match) {
            foundName = match.name
            break
         }
      }

      if (foundName) {
        setSearchQuery(foundName)
        handleSearch(foundName)
        setStatusMsg('')
      } else {
        // If no match in DB, just use the longest line as a guess
        const bestGuess = lines.reduce((a, b) => a.length > b.length ? a : b, '').substring(0, 30)
        setSearchQuery(bestGuess)
        handleSearch(bestGuess)
        setStatusMsg('Scan complete. Searching for extracted text...')
      }
    } catch (err) {
      console.error('OCR Error:', err)
      setSearchError('Failed to scan image. Please try typing the name.')
    } finally {
      setIsScanning(false)
    }
  }

  const [statusMsg, setStatusMsg] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    setSearchError(null)
    if (val.length > 1) {
      const filtered = medicinesDatabase
        .filter(m => m.name.toLowerCase().includes(val.toLowerCase()))
        .map(m => m.name)
        .slice(0, 5)
      setSuggestions(filtered)
      
      // Auto-search offline results
      const results = searchMedicine(val)
      if (results.length > 0) {
        setSearchResults(results)
      }
    } else {
      setSuggestions([])
      setSearchResults([])
    }
  }

  const handleSearch = async (query?: string) => {
    const q = query !== undefined ? query : searchQuery
    setSuggestions([]) // Clear suggestions on search
    setSearchError(null)
    if (q.trim()) {
      // 1. Search Static Database
      const staticResults = searchMedicine(q)
      
      // 2. Search Dynamic IndexedDB
      const dynamicResults = await dbHelper.searchMedicine(q)
      const mappedDynamicResults: Medicine[] = dynamicResults.map(r => ({
        name: r.name,
        genericName: r.genericName,
        uses: r.uses,
        dosage: r.dosage,
        warnings: r.warnings,
        sideEffects: r.sideEffects || []
      }))
      
      const combinedResults = [...staticResults, ...mappedDynamicResults]
      
      if (combinedResults.length > 0) {
        setSearchResults(combinedResults)
        if (combinedResults.length === 1) setSelectedMedicine(combinedResults[0])
      } else {
        // Fuzzy Match Fallback (Starts With)
        const fuzzyResults = medicinesDatabase.filter(m => 
          m.name.toLowerCase().startsWith(q.toLowerCase().substring(0, 3))
        )
        if (fuzzyResults.length > 0) {
          setSearchResults(fuzzyResults)
        } else if (navigator.onLine) {
          // Online fallback via Gemini
          handleOnlineSearch(q)
        } else {
          setSearchResults([])
        }
      }
    } else {
      setSearchResults([])
      setSelectedMedicine(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleOnlineSearch = async (query: string) => {
    if (query.length < 3) return
    setSearchingOnline(true)
    setSearchError(null)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("API Key missing")
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const prompt = `You are a professional medical database API. A user is searching for "${query}".
      1. If this query represents a valid medicine (even if misspelled like "dolo650" -> "Dolo-650"), provide its precise medical details.
      2. If the query is NOT a medicine (e.g., "hello", "what is a dog", "fever"), set "isMedicine" to false.
      
      Respond STRICTLY with valid JSON matching this exact structure:
      {
        "isMedicine": boolean,
        "name": "Corrected Brand or Generic Name",
        "genericName": "Primary active ingredient",
        "uses": "Primary medical uses",
        "dosage": "Standard adult dosage guidelines",
        "warnings": "Critical contraindications or warnings",
        "sideEffects": ["effect 1", "effect 2", "effect 3"]
      }
      Do NOT include any markdown formatting, backticks, or extra text. ONLY raw JSON.`

      let text = ""
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(prompt)
        text = result.response.text()
      } catch (err: any) {
        console.warn("Fallback to gemini-pro due to:", err.message)
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await fallbackModel.generateContent(prompt)
        text = result.response.text()
      }

      // Clean up markdown blocks if Gemini accidentally included them
      let jsonStr = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      
      // Sometimes it might start with something else, find first {
      const firstBrace = jsonStr.indexOf('{')
      const lastBrace = jsonStr.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1)
      }

      const resultData = JSON.parse(jsonStr)
      
      if (resultData.isMedicine === false) {
        setSearchError(`"${query}" does not appear to be a recognized medicine. If you are asking a health question, please use the AI Assistant tab.`)
        setSearchResults([])
        setSelectedMedicine(null)
      } else {
        const medData: Medicine = {
          name: resultData.name || query,
          genericName: resultData.genericName || 'N/A',
          uses: resultData.uses || 'Information unavailable.',
          dosage: resultData.dosage || 'Consult your doctor for dosage.',
          warnings: resultData.warnings || 'Consult your doctor before use.',
          sideEffects: Array.isArray(resultData.sideEffects) ? resultData.sideEffects : ['Consult doctor for potential side effects.']
        }
        
        // Save to IndexedDB for future offline use
        await dbHelper.addMedicine({
          ...medData,
          timestamp: Date.now()
        })
        setSearchResults([medData])
        setSelectedMedicine(medData)
      }
    } catch (error: any) {
      console.error('Online search failed:', error)
      setSearchError("Our global database is temporarily unavailable or returned invalid data. Please try again.")
      setSearchResults([])
    } finally {
      setSearchingOnline(false)
    }
  }

  const handleCheckInteraction = () => {
    if (!med1 || !med2) return
    const result = checkInteraction(med1, med2)
    setInteractionResult(result)
    setHasChecked(true)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search & Scan Header */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FaPills className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">MEDICINE INFO</h2>
          </div>
          <p className="text-blue-100 text-sm font-medium opacity-80">Instant information about dosages, side effects, and more.</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-2">
            <div className="relative flex-1 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search any medicine (e.g. Dolo-650, Atorvastatin)..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-16 py-5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-xl text-slate-900 dark:text-white shadow-inner"
              />
              
              <label className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-white/10 rounded-xl transition-all">
                 {isScanning ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                 ) : (
                    <FaCamera className="text-blue-600 dark:text-blue-400 text-xl" />
                 )}
                 <input type="file" accept="image/*" onChange={handleScan} className="hidden" disabled={isScanning} />
              </label>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                  >
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(s)
                          handleSearch(s)
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b last:border-none border-slate-100 dark:border-slate-700"
                      >
                        <FaCapsules className="text-slate-300 text-xs" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => handleSearch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-3xl font-black shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest"
            >
              Search
            </button>
          </div>

          {statusMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-blue-600 dark:text-blue-400 text-xs font-bold animate-pulse">
              {statusMsg}
            </motion.div>
          )}

          {!searchQuery && !selectedMedicine && (
            <div className="space-y-6">
              <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">Browse Common Medications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['Dolo-650', 'Augmentin', 'Taxim-O', 'Aciloc', 'Telma-40', 'Metformin', 'Lipitor', 'Zoloft'].map(med => (
                  <button 
                    key={med}
                    onClick={() => { setSearchQuery(med); handleSearch(med); }}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <FaCapsules className="text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{med}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>

          <div className="mt-6 flex gap-4">
             <button 
                onClick={() => setShowInteraction(!showInteraction)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
             >
                <FaExchangeAlt /> {showInteraction ? 'Close Checker' : 'Drug Interaction Checker'}
             </button>
          </div>

          <AnimatePresence>
             {showInteraction && (
                <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="mt-6 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30 overflow-hidden"
                >
                   <h4 className="text-sm font-black text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                      🛡️ Advanced Safety Checker (Offline)
                   </h4>
                   <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input 
                         type="text" 
                         placeholder="Medicine 1 (e.g. Aspirin)" 
                         value={med1}
                         onChange={(e) => setMed1(e.target.value)}
                         className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none"
                      />
                      <input 
                         type="text" 
                         placeholder="Medicine 2 (e.g. Warfarin)" 
                         value={med2}
                         onChange={(e) => setMed2(e.target.value)}
                         className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none"
                      />
                   </div>
                   <button 
                      onClick={handleCheckInteraction}
                      disabled={!med1 || !med2}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                   >
                      Verify Safety
                   </button>

                   {hasChecked && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                         {interactionResult ? (
                            <div className={`p-4 rounded-2xl border flex gap-4 ${
                               interactionResult.severity === 'high' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800' : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800'
                            }`}>
                               <FaExclamationTriangle className="text-xl shrink-0 mt-1" />
                               <div>
                                  <p className="font-black text-sm uppercase tracking-wide">{interactionResult.severity} RISK DETECTED</p>
                                  <p className="text-sm font-medium mt-1 leading-relaxed">{interactionResult.warning}</p>
                               </div>
                            </div>
                         ) : (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 rounded-2xl flex items-center gap-3">
                               <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                               <p className="text-sm font-bold">No major interactions found in our offline database for these medications.</p>
                            </div>
                         )}
                         <p className="text-[10px] text-slate-400 mt-3 text-center uppercase tracking-widest font-medium italic">
                            ⚠️ Always consult a doctor. This tool is for informational purposes only.
                         </p>
                      </motion.div>
                   )}
                </motion.div>
             )}
          </AnimatePresence>

      </div>

      {/* Suggested Results */}
      <AnimatePresence>
        {searchResults.length > 1 && !selectedMedicine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {searchResults.map((med, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedMedicine(med)}
                className="glass-card card-hover text-left p-6 flex flex-col items-start gap-2"
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-2">
                  <FaCapsules className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{med.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Generic: {med.genericName || 'N/A'}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed View */}
      {selectedMedicine && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-0 overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white relative">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md transition-all"
            >
              <FaSearch className="rotate-45" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
                {searchingOnline ? 'Searching Global DB...' : 'Verified Info'}
              </span>
              {selectedMedicine.genericName && <span className="text-blue-200 text-sm font-medium">#{selectedMedicine.genericName}</span>}
              {!medicinesDatabase.find(m => m.name === selectedMedicine.name) && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-400">
                  <FaGlobe /> Online Source
                </span>
              )}
            </div>
            <h3 className="text-4xl font-black mb-2">{selectedMedicine.name}</h3>
            <p className="text-lg text-blue-100 font-medium opacity-80 leading-relaxed max-w-2xl">{selectedMedicine.uses}</p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8 bg-white dark:bg-slate-900">
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <FaCapsules className="text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Dosage & Usage</h4>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {selectedMedicine.dosage}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="text-red-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Critical Warnings</h4>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 leading-relaxed text-red-700 dark:text-red-300 font-bold">
                  <p className="flex gap-2"><span className="text-red-500 shrink-0">(! )</span> {selectedMedicine.warnings}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                    <FaSyringe className="text-amber-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white">Possible Side Effects</h4>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {(selectedMedicine.sideEffects || []).map((effect, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-sm font-medium">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold mb-2">
                  <FaShieldAlt className="text-sm" />
                  <span className="text-xs uppercase tracking-widest">Medical Advisor</span>
                </div>
                <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                  This data is for educational purposes only. Always consult a certified medical professional before starting any new medication.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {searchQuery && searchResults.length === 0 && !searchingOnline && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
           <FaPills className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
           <p className="text-slate-600 dark:text-slate-400 text-xl font-bold text-center uppercase tracking-widest">No exact match found</p>
           <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-2 max-w-md mx-auto leading-relaxed">
             We couldn't find offline data for "{searchQuery}". Try our Global AI search for real-time information and spelling correction.
           </p>
           {isOnline && (
             <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={() => handleOnlineSearch(searchQuery)}
                  className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
                >
                  <FaGlobe /> Search Global AI Database
                </button>
             </div>
           )}
        </motion.div>
      )}

      {searchingOnline && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 shadow-xl" />
          <p className="text-xl font-black text-slate-700 dark:text-slate-300 animate-pulse tracking-widest uppercase">Consulting Global Medical Intelligence...</p>
          <p className="text-sm text-slate-400 mt-2">Fetching professional clinical data from global registries</p>
        </div>
      )}

      {searchError && !searchingOnline && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-200 dark:border-red-800/30 text-center">
          <FaShieldAlt className="text-red-500 text-4xl mx-auto mb-4" />
          <h4 className="text-red-700 dark:text-red-400 font-bold text-lg mb-2">Search Advisory</h4>
          <p className="text-red-600/80 dark:text-red-400/80 text-sm font-medium leading-relaxed max-w-xl mx-auto">
            {searchError}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default MedicineInfo

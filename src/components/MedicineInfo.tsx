import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchMedicine, type Medicine } from '../data/medicines'
import Tesseract from 'tesseract.js'
import { FaPills, FaSearch, FaCamera, FaCapsules, FaShieldAlt, FaSyringe } from 'react-icons/fa'

function MedicineInfo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [scanMode, setScanMode] = useState(false)
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchMedicine(query)
      setSearchResults(results)
      if (results.length === 1) {
        setSelectedMedicine(results[0])
      }
    } else {
      setSearchResults([])
      setSelectedMedicine(null)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setScanMode(true)
    } catch (error) {
      console.error('Camera error:', error)
      alert('Unable to access camera. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setScanMode(false)
  }

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setScanning(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // 100% Offline OCR Recognition
      // Requires assets in public/tesseract/ to avoid CDN fetching
      const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
        workerPath: '/tesseract/worker.min.js',
        langPath: '/tesseract/lang-data',
        corePath: '/tesseract/tesseract-core.wasm.js',
        logger: m => console.log('OCR Sync:', m),
      });

      console.log('Scanned text:', text)
      setScanning(false)

      // Try to extract medicine name from OCR text
      const words = text.split(/\s+/).filter((w) => w.length > 3)
      for (const word of words) {
        const results = searchMedicine(word)
        if (results.length > 0) {
          setSearchQuery(word)
          setSearchResults(results)
          setSelectedMedicine(results[0])
          stopCamera()
          return
        }
      }

      alert('No medicine found in the image. Try manual search.')
    } catch (error) {
      console.error('OCR error:', error)
      alert('Failed to scan image. Please try again or use manual search.')
      setScanning(false)
    }
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
          {!scanMode ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter medicine name (e.g. Aspirin)..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg text-slate-900 dark:text-white"
                />
              </div>
              <motion.button
                onClick={startCamera}
                className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCamera className="text-xl" />
                <span>Scan Medicine</span>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-[2px] border-white/30 rounded-3xl pointer-events-none m-8"></div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={captureAndScan}
                  disabled={scanning}
                  className="flex-1 btn-success py-4 rounded-2xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {scanning ? (
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : <FaSearch />}
                  <span>{scanning ? 'Analyzing Text...' : 'Analyze Label'}</span>
                </motion.button>
                <motion.button
                  onClick={stopCamera}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-2xl font-bold"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  Exit
                </motion.button>
              </div>
            </div>
          )}
        </div>
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
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">Prescription Med</span>
              {selectedMedicine.genericName && <span className="text-blue-200 text-sm font-medium">#{selectedMedicine.genericName}</span>}
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
                  {selectedMedicine.sideEffects.map((effect, idx) => (
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

      {searchQuery && searchResults.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
           <FaPills className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
           <p className="text-slate-600 dark:text-slate-400 text-xl font-bold text-center py-20">Medicine not found in offline DB</p>
           <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-1">Try a different name or use the AI Assistant for general advice.</p>
        </motion.div>
      )}
    </div>
  )
}

export default MedicineInfo

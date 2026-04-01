import { useState, useRef } from 'react'
import { searchMedicine, type Medicine } from '../data/medicines'
import { createWorker } from 'tesseract.js'

function MedicineInfo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [scanMode, setScanMode] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [ocrText, setOcrText] = useState('')
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
      const worker = await createWorker('eng')
      const {
        data: { text },
      } = await worker.recognize(canvas)
      await worker.terminate()

      setOcrText(text)
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
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Medicine Information</h2>

        {!scanMode ? (
          <>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search medicine name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={startCamera}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
              >
                Scan Medicine
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 1 && !selectedMedicine && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Found {searchResults.length} results:
                </p>
                <div className="space-y-2">
                  {searchResults.map((med, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMedicine(med)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                    >
                      <p className="font-semibold text-gray-800">{med.name}</p>
                      {med.genericName && (
                        <p className="text-sm text-gray-600">{med.genericName}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={captureAndScan}
                disabled={scanning}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold disabled:bg-gray-400"
              >
                {scanning ? 'Scanning...' : 'Capture & Scan'}
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>

            {ocrText && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Detected text:</p>
                <p className="text-sm text-gray-800">{ocrText}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medicine Details */}
      {selectedMedicine && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedMedicine.name}
              </h3>
              {selectedMedicine.genericName && (
                <p className="text-gray-600">Generic: {selectedMedicine.genericName}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedMedicine(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-blue-600">Uses</span>
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedMedicine.uses}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">Dosage</h4>
              <p className="text-green-900 text-sm leading-relaxed">
                {selectedMedicine.dosage}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Warnings
              </h4>
              <p className="text-red-900 text-sm leading-relaxed">
                {selectedMedicine.warnings}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-2">Side Effects</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedMedicine.sideEffects.map((effect, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">
                    {effect}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This information is for educational purposes
                only. Always consult your doctor or pharmacist before taking any
                medication. Do not self-medicate.
              </p>
            </div>
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">
            No medicine found with name "{searchQuery}". Try a different spelling or use
            the scan feature.
          </p>
        </div>
      )}
    </div>
  )
}

export default MedicineInfo

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbHelper, type EmergencyContact } from '../utils/indexedDB'
import { getNearbyHospitals, type Hospital, hospitals, calculateDistance } from '../data/hospitals'
import { firstAidInstructions } from '../data/firstAid'
import {
  FaHospital, FaHospitalAlt, FaPhoneAlt, FaHeartbeat, FaShieldAlt,
  FaMapMarkerAlt, FaTrash, FaPlus, FaCopy, FaShare, FaCheck, FaExternalLinkAlt, FaGlobe, FaMap,
} from 'react-icons/fa'

// =====================================================================
// HOW SMS/CALL WORKS:
// - On MOBILE (Android/iOS): tel: and sms: links open the phone/SMS app directly
// - On DESKTOP localhost: tel: links may open Skype/Teams; sms: won't work
//   → Use clipboard copy + Web Share API as fallback
// - After DEPLOYMENT on mobile: everything works perfectly
// =====================================================================

function SOSEmergency() {
  const [location, setLocation] = useState<{ lat: number; lon: number; accuracy?: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<(Hospital & { distance: number })[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [showFirstAid, setShowFirstAid] = useState(false)
  const [selectedFirstAid, setSelectedFirstAid] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sosActive, setSosActive] = useState(false)
  const [locationStatus, setLocationStatus] = useState<string>('Tap "Find Nearby" to detect your GPS location')
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sosLog, setSosLog] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareData, setShareData] = useState<{ title: string; text: string; phone: string } | null>(null)
  const [showLiveMap, setShowLiveMap] = useState(false)
  const [isOnline] = useState(navigator.onLine)

  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', relationship: '' })

  useEffect(() => {
    dbHelper.init().then(() => loadEmergencyContacts())
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Auto-load last known location from storage
    const savedLoc = localStorage.getItem('lastLocation')
    const savedAddr = localStorage.getItem('lastAddress')
    if (savedLoc) setLocation(JSON.parse(savedLoc))
    if (savedAddr) setCurrentAddress(savedAddr)

    // Auto-start GPS tracking
    startLocationTracking()

    return () => clearInterval(timer)
  }, [])

  const startLocationTracking = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('❌ GPS not supported')
      return
    }

    setLocationStatus('📡 Initializing GPS...')
    
    // Initial quick fix
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePositionUpdate(pos, true),
      (err) => console.warn('Initial GPS failed:', err),
      { enableHighAccuracy: true, timeout: 10000 }
    )

    // Continuous watch
    const watchId = navigator.geolocation.watchPosition(
      (pos) => handlePositionUpdate(pos, false),
      (err) => {
        console.error('GPS Watch Error:', err)
        if (err.code === 1) setLocationStatus('❌ GPS Permission Denied')
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }

  const handlePositionUpdate = async (position: GeolocationPosition, isInitial: boolean) => {
    const { latitude, longitude, accuracy } = position.coords
    const loc = { lat: latitude, lon: longitude, accuracy }
    
    setLocation(loc)
    localStorage.setItem('lastLocation', JSON.stringify(loc))
    
    // 1. Get Static + Cached Hospitals
    try {
      await dbHelper.init()
      const cached = await dbHelper.getCachedHospitals()
      const staticHospitals = getNearbyHospitals(latitude, longitude, 50)
      
      const mappedCached = cached.map(h => ({
        ...h,
        id: h.id!,
        distance: calculateDistance(latitude, longitude, h.latitude, h.longitude)
      }))

      const merged = [...staticHospitals, ...mappedCached]
      const unique = merged.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
      setNearbyHospitals(unique.sort((a, b) => a.distance - b.distance))
    } catch (err) {
      console.error("Local hospital fetch failed", err)
      setNearbyHospitals(getNearbyHospitals(latitude, longitude, 50))
    }
    
    const accStr = accuracy ? ` (±${Math.round(accuracy)}m)` : ''
    setLocationStatus(`✅ ${latitude.toFixed(5)}, ${longitude.toFixed(5)}${accStr}`)

    if (navigator.onLine && (isInitial || Math.random() > 0.8)) { 
      fetchRealTimeAddress(latitude, longitude)
      fetchRealTimeHospitals(latitude, longitude)
      fetchHospitalsFromOSM(latitude, longitude)
    }
  }

  const fetchRealTimeAddress = async (lat: number, lon: number) => {
    try {
      // Use Nominatim (OSM) for free reverse geocoding if online
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const data = await res.json()
      if (data && data.display_name) {
        const shortAddr = data.address.city || data.address.town || data.address.suburb || 'Nearby Location'
        const fullAddr = `${shortAddr}, ${data.address.state || data.address.country}`
        setCurrentAddress(fullAddr)
        localStorage.setItem('lastAddress', fullAddr)
      }
    } catch (e) {
      // Fallback to Gemini if Nominatim fails or for more detail
      fetchAddressWithAI(lat, lon)
    }
  }

  const fetchAddressWithAI = async (lat: number, lon: number) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) return
      const genAI = new (await import('@google/generative-ai')).GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const addressPrompt = `Identify the exact location/address for coordinates: ${lat}, ${lon}. Just return a short address (City, Area).`
      const result = await model.generateContent(addressPrompt)
      const addr = result.response.text().trim()
      setCurrentAddress(addr)
      localStorage.setItem('lastAddress', addr)
    } catch (err) {
      console.error('AI address fetch failed:', err)
    }
  }

  const getLocation = () => {
    setLoading(true)
    startLocationTracking()
    setTimeout(() => setLoading(false), 2000)
  }

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await dbHelper.getEmergencyContacts()
      setEmergencyContacts(contacts)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    }
  }

  const fetchRealTimeHospitals = async (lat: number, lon: number) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here') return

      const genAI = new (await import('@google/generative-ai')).GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })


      // 2. Get Real-time Nearby Hospitals
      const hospitalPrompt = `Find 5 real, major hospitals near coordinates ${lat}, ${lon}. 
      Include their real phone numbers and approximate coordinates.
      Respond ONLY with a JSON array: [{"name": string, "address": string, "phone": string, "latitude": number, "longitude": number}]. 
      No markdown, no text.`
      
      const result = await model.generateContent(hospitalPrompt)
      const text = result.response.text().replace(/```json|```/gi, '').trim()
      const realHospitals = JSON.parse(text)

      const formattedHospitals = realHospitals.map((h: any, i: number) => ({
        id: 9000 + i,
        ...h,
        distance: calculateDistance(lat, lon, h.latitude, h.longitude),
        services: ['24/7 Emergency', 'Real-time AI Found'],
        emergency247: true
      })).sort((a: any, b: any) => a.distance - b.distance)

      saveHospitalsToCache(formattedHospitals)
      updateHospitalsList(formattedHospitals)
    } catch (error) {
      console.warn("Real-time AI hospital search failed", error)
    }
  }

  const fetchHospitalsFromOSM = async (lat: number, lon: number) => {
    try {
      // Overpass API query for hospitals within 5km
      const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data && data.elements) {
        const osmHospitals = data.elements.map((el: any) => ({
          id: el.id,
          name: el.tags.name || 'Local Clinic/Hospital',
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Nearby Location',
          phone: el.tags['contact:phone'] || el.tags.phone || 'N/A',
          latitude: el.lat,
          longitude: el.lon,
          services: ['Local Emergency', 'OpenStreetMap Verified'],
          emergency247: el.tags['opening_hours'] === '24/7',
          distance: calculateDistance(lat, lon, el.lat, el.lon)
        }))
        
        saveHospitalsToCache(osmHospitals)
        updateHospitalsList(osmHospitals)
      }
    } catch (err) {
      console.error("OSM Fetch failed", err)
    }
  }

  const saveHospitalsToCache = async (hospitals: any[]) => {
    for (const h of hospitals) {
      await dbHelper.addCachedHospital({
        name: h.name,
        address: h.address,
        phone: h.phone,
        latitude: h.latitude,
        longitude: h.longitude,
        services: h.services,
        emergency247: h.emergency247,
        timestamp: Date.now(),
        externalId: `loc-${h.name}-${h.latitude}`
      })
    }
  }

  const updateHospitalsList = (newHospitals: any[]) => {
    setNearbyHospitals(prev => {
      const combined = [...newHospitals, ...prev]
      // Filter out duplicates and keep nearest 10
      const unique = Array.from(new Map(combined.map(item => [item.name, item])).values())
      return unique.sort((a, b) => a.distance - b.distance).slice(0, 10)
    })
  }

  // Copy phone number to clipboard
  const copyPhone = async (phone: string, id: number) => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      // Fallback for environments without clipboard API
      const input = document.createElement('input')
      input.value = phone
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2500)
    }
  }

  // Build the nearby hospitals block for SMS messages (fully offline - uses embedded DB)
  const buildHospitalBlock = (lat?: number, lon?: number): string => {
    const useLat = lat ?? location?.lat
    const useLon = lon ?? location?.lon
    if (!useLat || !useLon) return ''

    // Find top 3 nearest from embedded offline database
    const nearest = hospitals
      .map(h => ({
        ...h,
        distance: calculateDistance(useLat, useLon, h.latitude, h.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)

    if (nearest.length === 0) return ''

    const lines = nearest.map((h, i) =>
      `${i + 1}. ${h.name}\n   📞 ${h.phone}\n   📌 ${h.address}\n   🗺️ maps.google.com/?q=${h.latitude},${h.longitude}\n   Distance: ~${h.distance.toFixed(1)} km`
    )
    return `\n\n🏥 NEAREST HOSPITALS (offline database):\n${lines.join('\n\n')}`
  }

  // Share message using Web Share API (works on mobile) or show modal fallback
  const shareEmergencySMS = async (contact: EmergencyContact) => {
    const locationText = location
      ? `My GPS: https://maps.google.com/?q=${location.lat},${location.lon}\nCoordinates: ${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`
      : 'Location: Could not determine GPS position'

    const hospitalBlock = buildHospitalBlock()

    const message = `🚨 EMERGENCY ALERT!\nI need immediate help!\n\n${locationText}${hospitalBlock}\n\n☎️ Emergency: 112 | Ambulance: 108\nPlease come or send help immediately!`

    // Try Web Share API first (works natively on Android/iOS)
    if (navigator.share) {
      try {
        await navigator.share({ title: '🚨 SOS Emergency Alert', text: message })
        return
      } catch {
        // User cancelled or not supported, fall through to modal
      }
    }

    // On desktop: show a share modal with copy option
    setShareData({ title: `SOS to ${contact.name}`, text: message, phone: contact.phone })
    setShowShareModal(true)
  }

  // Build a full SOS message to share/copy (includes offline hospital data)
  const buildSOSMessage = () => {
    const locText = location
      ? `GPS: https://maps.google.com/?q=${location.lat},${location.lon}\nCoordinates: ${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`
      : 'Location unavailable — enable GPS'

    const hospitalBlock = buildHospitalBlock()
    const contactList = emergencyContacts.map(c => `• ${c.name}: ${c.phone}`).join('\n')

    return `🚨 SOS EMERGENCY ALERT\n\n${locText}${hospitalBlock}\n\nNotify contacts:\n${contactList}\n\n☎️ Emergency: 112 | Ambulance: 108`
  }

  const handleSOSClick = async () => {
    if (emergencyContacts.length === 0) {
      alert('Please add at least one emergency contact first.')
      return
    }

    setSosActive(true)
    const log: string[] = []

    // Refresh location
    log.push('🔍 Getting GPS coordinates...')
    setSosLog([...log])

    let currentLoc = location
    try {
      currentLoc = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
          reject,
          { timeout: 8000 }
        )
      })
      setLocation(currentLoc!)
      log.push(`✅ GPS: ${currentLoc!.lat.toFixed(5)}, ${currentLoc!.lon.toFixed(5)}`)
    } catch {
      log.push('⚠️ GPS unavailable — sending alert without location')
    }
    setSosLog([...log])

    // Find nearest hospitals from offline embedded database using current GPS
    let hospitalBlock = ''
    if (currentLoc) {
      const nearest = hospitals
        .map(h => ({
          ...h,
          distance: calculateDistance(currentLoc!.lat, currentLoc!.lon, h.latitude, h.longitude),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)

      if (nearest.length > 0) {
        log.push(`🏥 Found ${nearest.length} nearby hospitals`)
        setSosLog([...log])
        const lines = nearest.map((h, i) =>
          `${i + 1}. ${h.name}\n   📞 ${h.phone}\n   📌 ${h.address}\n   🗺️ maps.google.com/?q=${h.latitude},${h.longitude}\n   ~${h.distance.toFixed(1)} km away`
        )
        hospitalBlock = `\n\n🏥 NEAREST HOSPITALS:\n${lines.join('\n\n')}`

        // Update the nearbyHospitals state so UI also shows them
        setNearbyHospitals(nearest)
      }
    }

    // Generate the full SOS message with hospital details
    const locationText = currentLoc
      ? `https://maps.google.com/?q=${currentLoc.lat},${currentLoc.lon}`
      : 'No GPS available'

    const msg = `🚨 EMERGENCY ALERT!\nI need immediate help!\n\nMy location: ${locationText}${hospitalBlock}\n\n☎️ Call 112 (Emergency) or 108 (Ambulance) NOW!`

    // Build SMS URI for all contacts (works on mobile devices after deployment)
    const phones = emergencyContacts.map(c => c.phone.replace(/\s|-/g, '')).join(',')
    const encodedMsg = encodeURIComponent(msg)

    log.push(`📱 Launching SOS to ${emergencyContacts.length} contact(s)...`)
    setSosLog([...log])

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({ title: '🚨 SOS Emergency', text: msg })
        log.push('✅ SOS shared via device share menu')
        setSosLog([...log])
        setSosActive(false)
        return
      } catch { /* user cancelled, fall through */ }
    }

    // SMS link - works on mobile browsers after deployment
    const smsUri = `sms:${phones}?body=${encodedMsg}`
    window.location.href = smsUri

    emergencyContacts.forEach(c => {
      log.push(`✅ SMS launched to ${c.name} (${c.phone})`)
    })
    log.push('')
    log.push('📌 On desktop: use "Copy SOS Message" button below to copy & send manually')
    setSosLog([...log])
    setSosActive(false)
  }

  const addEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContact.name || !newContact.phone) { alert('Name and phone are required'); return }
    try {
      await dbHelper.addEmergencyContact(newContact)
      setNewContact({ name: '', phone: '', email: '', relationship: '' })
      setShowAddContact(false)
      loadEmergencyContacts()
    } catch { alert('Failed to save contact. Please try again.') }
  }

  const deleteContact = async (id: number | undefined) => {
    if (!id || !confirm('Delete this emergency contact?')) return
    try {
      await dbHelper.deleteEmergencyContact(id)
      loadEmergencyContacts()
    } catch { console.error('Failed to delete contact') }
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Share/SMS Modal (desktop fallback) */}
      <AnimatePresence>
        {showShareModal && shareData && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
              onClick={() => setShowShareModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{shareData.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">On desktop, copy this message and send via WhatsApp/SMS manually. On mobile, SMS sends automatically.</p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono border border-slate-200 dark:border-slate-700 mb-4">
                  {shareData.text}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await copyPhone(shareData.text, -1)
                      setShowShareModal(false)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all"
                  >
                    <FaCopy /> Copy SOS Message
                  </button>
                  <a
                    href={`tel:${shareData.phone.replace(/\s|-/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all"
                    onClick={() => setShowShareModal(false)}
                  >
                    <FaPhoneAlt /> Call Now
                  </a>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SOS Hero */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FaHeartbeat className="text-[120px] rotate-12" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight mb-1">🚨 EMERGENCY ASSIST</h2>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Current Time</p>
                <p className="text-xl font-black">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
              {currentAddress && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">
                    {navigator.onLine ? 'Live Location' : 'Cached Location'}
                  </p>
                  <p className="text-sm font-bold truncate max-w-[150px]">{currentAddress}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-red-100 text-sm opacity-80 mt-3 mb-3">One-tap SOS • AI Powered Real-time Emergency Response</p>
          {locationStatus && (
            <span className={`text-xs font-bold inline-block px-3 py-1 rounded-full ${
              locationStatus.startsWith('✅')
                ? 'bg-green-500/30 border border-green-400/40 text-green-100'
                : locationStatus.startsWith('❌')
                  ? 'bg-red-800/50 border border-red-400/40 text-red-100'
                  : 'bg-white/10 border border-white/20 text-white'
            }`}>
              {locationStatus}
            </span>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Dial Buttons - Always work on mobile */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:112"
              className="flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              <FaPhoneAlt /> Call 112
            </a>
            <a
              href="tel:108"
              className="flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <FaPhoneAlt /> Ambulance 108
            </a>
          </div>

          {/* SOS Alert Button */}
          <motion.button
            onClick={handleSOSClick}
            disabled={sosActive || emergencyContacts.length === 0}
            className={`w-full py-8 rounded-[2rem] text-white font-black text-2xl shadow-2xl transition-all relative overflow-hidden ${
              sosActive
                ? 'bg-slate-400 cursor-not-allowed'
                : emergencyContacts.length === 0
                  ? 'bg-red-400/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/40 active:scale-95'
            }`}
            whileHover={emergencyContacts.length > 0 ? { scale: 1.01 } : {}}
            whileTap={emergencyContacts.length > 0 ? { scale: 0.98 } : {}}
          >
            {sosActive && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <FaHeartbeat className={`text-4xl ${!sosActive && 'animate-pulse'}`} />
              <span>{sosActive ? 'SENDING...' : '📨 SEND SOS TO ALL CONTACTS'}</span>
              <span className="text-sm font-medium opacity-70">Opens SMS / Share on your device</span>
            </div>
          </motion.button>

          {emergencyContacts.length === 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-2xl text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-3">
              <span className="text-xl">⚠️</span> Add emergency contacts below to enable SOS alerts
            </div>
          )}

          {/* Desktop Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 p-4 rounded-2xl">
            <p className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">📱 Mobile vs Desktop</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>On Mobile (after deployment):</strong> "Call 112" and "Send SOS" open your phone's dialer and SMS app directly. <br/>
              <strong>On Desktop browser (localhost):</strong> Use the copy/share buttons to manually send via WhatsApp or phone.
            </p>
          </div>

          {/* SOS Log */}
          <AnimatePresence>
            {sosLog.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-xs space-y-1"
              >
                {sosLog.map((line, i) => <p key={i}>{line}</p>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" /> Emergency Contacts
            </h3>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-800/20"
            >
              <FaPlus className="text-xs" /> {showAddContact ? 'Cancel' : 'Add Contact'}
            </button>
          </div>

          <AnimatePresence>
            {showAddContact && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={addEmergencyContact}
                className="mb-6 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3 overflow-hidden"
              >
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'e.g. Ravi Kumar', type: 'text', required: true },
                  { label: 'Phone (with country code) *', key: 'phone', placeholder: '+91 98765 43210', type: 'tel', required: true },
                  { label: 'Relationship', key: 'relationship', placeholder: 'Family / Friend / Doctor', type: 'text', required: false },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={(newContact as any)[field.key]}
                      onChange={e => setNewContact({ ...newContact, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                ))}
                <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold mt-1">
                  💾 Save Contact Offline
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {emergencyContacts.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <FaPhoneAlt className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No contacts saved</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add contacts to enable SOS alerts</p>
              </div>
            ) : (
              emergencyContacts.map(contact => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-black">
                        {contact.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{contact.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{contact.phone} • {contact.relationship || 'Contact'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center justify-center"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Call - works on mobile */}
                    <a
                      href={`tel:${contact.phone.replace(/\s|-/g, '')}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs border border-green-100 dark:border-green-800/30 hover:bg-green-100 transition-all"
                    >
                      <FaPhoneAlt className="text-[10px]" /> Call
                    </a>
                    {/* Copy phone (works on desktop) */}
                    <button
                      onClick={() => copyPhone(contact.phone, contact.id!)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all"
                    >
                      {copiedId === contact.id ? <FaCheck className="text-green-500 text-[10px]" /> : <FaCopy className="text-[10px]" />}
                      {copiedId === contact.id ? 'Copied!' : 'Copy'}
                    </button>
                    {/* Share SOS message (Web Share API / modal) */}
                    <button
                      onClick={() => shareEmergencySMS(contact)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-bold text-xs border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 transition-all"
                    >
                      <FaShare className="text-[10px]" /> Share
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaHospital className="text-red-500" /> Nearby Hospitals
            </h3>
            <div className="flex gap-2">
              {isOnline && (
                <button
                  onClick={() => setShowLiveMap(!showLiveMap)}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-xl border border-blue-200 dark:border-blue-800/20 hover:bg-blue-200 transition-all"
                  title="Toggle Live Map"
                >
                  <FaMap />
                </button>
              )}
              <button
                onClick={getLocation}
                disabled={loading}
                className="btn-success flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaMapMarkerAlt />
                )}
                {loading ? 'Locating...' : 'Find Nearby'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4">
            📍 {isOnline ? 'Connected to Live Maps' : 'Offline Mode Active'} — uses high-precision GPS to find hospitals.
          </p>

          <AnimatePresence>
            {showLiveMap && location && isOnline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 300 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800"
              >
                <iframe
                  title="Live Hospital Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=hospitals+near+me&center=${location.lat},${location.lon}&zoom=14`}
                  className="bg-slate-100"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isOnline && (
            <a
              href={`https://www.google.com/maps/search/hospitals+near+me/@${location?.lat || ''},${location?.lon || ''},14z`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-2xl font-black text-xs border-2 border-dashed border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all"
            >
              <FaGlobe /> SEARCH ON REAL-TIME GOOGLE MAPS
            </a>
          )}

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {nearbyHospitals.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <FaHospitalAlt className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  {location ? 'No hospitals found within 50km' : 'Tap "Find Nearby" to locate hospitals'}
                </p>
              </div>
            ) : (
              nearbyHospitals.map(hospital => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm pr-2 leading-tight">{hospital.name}</h4>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg">
                        {hospital.distance.toFixed(1)} km
                      </span>
                      <span className="text-[8px] font-bold text-green-600 dark:text-green-400 mt-1">
                        ⏱️ ~{Math.round(hospital.distance * 2 + 5)} mins
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{hospital.address}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${hospital.phone.replace(/[-\s]/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold text-xs border border-green-100 dark:border-green-800/30 hover:bg-green-100 transition-all"
                    >
                      <FaPhoneAlt className="text-[10px]" /> {hospital.phone}
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 transition-all flex items-center gap-2"
                    >
                      <FaExternalLinkAlt className="text-[10px]" /> Navigate
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SOS Copy Card */}
      <div className="glass-card bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-1">📋 Copy Full SOS Message</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Copy this pre-built emergency message with your location to send manually via WhatsApp, SMS, or any app.</p>
          </div>
          <button
            onClick={async () => {
              const msg = buildSOSMessage()
              await copyPhone(msg, -99)
              alert('✅ SOS message copied! Paste it in WhatsApp or SMS to your contacts.')
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 shrink-0"
          >
            <FaCopy /> {copiedId === -99 ? '✅ Copied!' : 'Copy SOS Message'}
          </button>
        </div>
      </div>

      {/* First Aid Guide */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <FaShieldAlt className="text-orange-600" />
            </div>
            First Aid Guide
          </h3>
          <button onClick={() => setShowFirstAid(!showFirstAid)} className="btn-success px-6">
            {showFirstAid ? 'Minimize' : 'Expand Guide'}
          </button>
        </div>

        {showFirstAid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstAidInstructions.map(instruction => (
              <motion.div
                key={instruction.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  selectedFirstAid === instruction.id
                    ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-900/10'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-orange-200'
                }`}
              >
                <button
                  onClick={() => setSelectedFirstAid(selectedFirstAid === instruction.id ? null : instruction.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">{instruction.title}</span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-transform ${
                      selectedFirstAid === instruction.id
                        ? 'bg-orange-500 text-white rotate-180'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>↓</span>
                  </div>
                </button>

                <AnimatePresence>
                  {selectedFirstAid === instruction.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 space-y-4"
                    >
                      {instruction.callEmergency && (
                        <a
                          href="tel:112"
                          className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl transition-colors"
                        >
                          <FaPhoneAlt />
                          <p className="font-black uppercase tracking-wide text-sm">📞 Call 112 — Emergency Now</p>
                        </a>
                      )}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signs & Symptoms</h5>
                        <ul className="space-y-1">
                          {instruction.symptoms.map((s, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <span className="text-orange-500">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Immediate Actions</h5>
                        <ol className="space-y-2">
                          {instruction.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                              <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/20 text-red-700 dark:text-red-300 text-xs font-medium italic">
                        ⚠️ {instruction.warnings.join(' • ')}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SOSEmergency

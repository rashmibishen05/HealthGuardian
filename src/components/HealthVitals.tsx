import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeartbeat, FaPlus, FaTrash } from 'react-icons/fa'
import { dbHelper } from '../utils/indexedDB'

interface VitalEntry {
  id?: number
  type: string
  value: string
  unit: string
  notes: string
  timestamp: string
}

const vitalTypes = [
  { type: 'Blood Pressure', unit: 'mmHg', icon: '🩺', placeholder: 'e.g. 120/80', color: 'red' },
  { type: 'Heart Rate', unit: 'bpm', icon: '❤️', placeholder: 'e.g. 72', color: 'rose' },
  { type: 'Blood Sugar', unit: 'mg/dL', icon: '🩸', placeholder: 'e.g. 110', color: 'amber' },
  { type: 'Temperature', unit: '°C', icon: '🌡️', placeholder: 'e.g. 36.8', color: 'orange' },
  { type: 'Weight', unit: 'kg', icon: '⚖️', placeholder: 'e.g. 65', color: 'blue' },
  { type: 'SpO2 (Oxygen)', unit: '%', icon: '💨', placeholder: 'e.g. 98', color: 'cyan' },
]

function HealthVitals() {
  const [entries, setEntries] = useState<VitalEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<VitalEntry>({
    type: 'Blood Pressure',
    value: '',
    unit: 'mmHg',
    notes: '',
    timestamp: new Date().toISOString(),
  })
  const [filterType, setFilterType] = useState<string>('All')

  useEffect(() => {
    loadVitals()
  }, [])

  const loadVitals = async () => {
    try {
      await dbHelper.init()
      // Load from localStorage as a simple offline store
      const stored = localStorage.getItem('health_vitals')
      if (stored) {
        setEntries(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load vitals:', e)
    }
  }

  const saveEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.value) return

    const newEntry: VitalEntry = {
      ...form,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('health_vitals', JSON.stringify(updated))

    setForm({ type: 'Blood Pressure', value: '', unit: 'mmHg', notes: '', timestamp: '' })
    setShowForm(false)
  }

  const deleteEntry = (id?: number) => {
    if (!id) return
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('health_vitals', JSON.stringify(updated))
  }

  const filtered = filterType === 'All' ? entries : entries.filter(e => e.type === filterType)

  const getStatus = (type: string, value: string) => {
    const v = parseFloat(value)
    if (type === 'Heart Rate') {
      if (v < 60) return { text: 'Low', color: 'text-blue-600' }
      if (v > 100) return { text: 'High', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'Blood Sugar') {
      if (v < 70) return { text: 'Low', color: 'text-blue-600' }
      if (v > 140) return { text: 'High', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'Temperature') {
      if (v < 36) return { text: 'Low', color: 'text-blue-600' }
      if (v > 38) return { text: 'Fever', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'SpO2 (Oxygen)') {
      if (v < 95) return { text: 'Low', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    return { text: '', color: '' }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">HEALTH VITALS</h2>
              <p className="text-orange-100 text-sm opacity-80">Track your blood pressure, sugar, temperature & more. All data stored offline on your device.</p>
            </div>
            <FaHeartbeat className="text-6xl opacity-20" />
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-bold"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Log New Reading'}
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={saveEntry}
                className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Vital Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => {
                        const vt = vitalTypes.find(v => v.type === e.target.value)
                        setForm({ ...form, type: e.target.value, unit: vt?.unit || '' })
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    >
                      {vitalTypes.map(v => (
                        <option key={v.type} value={v.type}>{v.icon} {v.type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Value ({form.unit})
                    </label>
                    <input
                      type="text"
                      placeholder={vitalTypes.find(v => v.type === form.type)?.placeholder || ''}
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Notes (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. After exercise, fasting, morning reading..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary py-3 px-8 rounded-xl font-bold">
                  💾 Save Reading Offline
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {vitalTypes.map(vt => {
          const last = entries.find(e => e.type === vt.type)
          return (
            <div key={vt.type} className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setFilterType(filterType === vt.type ? 'All' : vt.type)}>
              <p className="text-2xl mb-1">{vt.icon}</p>
              <p className="text-xs font-black text-slate-500 dark:text-slate-400 mb-1 leading-tight">{vt.type}</p>
              {last ? (
                <>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{last.value}</p>
                  <p className="text-[10px] text-slate-400">{last.unit}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No data</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['All', ...vitalTypes.map(v => v.type)].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Entries List */}
      {filtered.length === 0 ? (
        <div className="glass-card text-center py-20">
          <FaHeartbeat className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No readings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start logging your health vitals using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => {
            const status = getStatus(entry.type, entry.value)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{vitalTypes.find(v => v.type === entry.type)?.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{entry.type}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{entry.value} <span className="text-sm font-medium text-slate-400">{entry.unit}</span></p>
                    {status.text && <p className={`text-xs font-bold ${status.color}`}>{status.text}</p>}
                    {entry.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{entry.notes}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <FaTrash className="text-sm" />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HealthVitals

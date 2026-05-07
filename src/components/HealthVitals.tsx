import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeartbeat, FaPlus, FaTrash } from 'react-icons/fa'
import { dbHelper, type HealthVital } from '../utils/indexedDB'

const vitalTypes = [
  { id: 'blood_pressure', type: 'Blood Pressure', unit: 'mmHg', icon: '🩺', placeholder: 'e.g. 120/80', color: 'red' },
  { id: 'heart_rate', type: 'Heart Rate', unit: 'bpm', icon: '❤️', placeholder: 'e.g. 72', color: 'rose' },
  { id: 'blood_sugar', type: 'Blood Sugar', unit: 'mg/dL', icon: '🩸', placeholder: 'e.g. 110', color: 'amber' },
  { id: 'temperature', type: 'Temperature', unit: '°C', icon: '🌡️', placeholder: 'e.g. 36.8', color: 'orange' },
  { id: 'weight', type: 'Weight', unit: 'kg', icon: '⚖️', placeholder: 'e.g. 65', color: 'blue' },
  { id: 'oxygen_level', type: 'SpO2 (Oxygen)', unit: '%', icon: '💨', placeholder: 'e.g. 98', color: 'cyan' },
]

function HealthVitals() {
  const [entries, setEntries] = useState<HealthVital[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HealthVital, 'id'>>({
    type: 'blood_pressure',
    value: '',
    unit: 'mmHg',
    notes: '',
    timestamp: Date.now(),
  })
  const [filterType, setFilterType] = useState<string>('All')

  useEffect(() => {
    loadVitals()
  }, [])

  const loadVitals = async () => {
    try {
      await dbHelper.init()
      const data = await dbHelper.getHealthVitals()
      setEntries(data.sort((a, b) => b.timestamp - a.timestamp))
    } catch (e) {
      console.error('Failed to load vitals:', e)
    }
  }

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.value) return

    try {
      const newEntry: HealthVital = {
        ...form,
        timestamp: Date.now(),
      }
      await dbHelper.addHealthVital(newEntry)
      setForm({ type: 'blood_pressure', value: '', unit: 'mmHg', notes: '', timestamp: Date.now() })
      setShowForm(false)
      loadVitals()
    } catch (e) {
      console.error('Failed to save vital:', e)
    }
  }

  const deleteEntry = async (id?: number) => {
    if (!id || !confirm('Delete this reading?')) return
    try {
      await dbHelper.deleteHealthVital(id)
      loadVitals()
    } catch (e) {
      console.error('Failed to delete vital:', e)
    }
  }

  const filtered = filterType === 'All' ? entries : entries.filter(e => e.type === filterType)

  const getStatus = (type: string, value: string) => {
    const v = parseFloat(value)
    if (type === 'heart_rate') {
      if (v < 60) return { text: 'Low', color: 'text-blue-600' }
      if (v > 100) return { text: 'High', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'blood_sugar') {
      if (v < 70) return { text: 'Low', color: 'text-blue-600' }
      if (v > 140) return { text: 'High', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'temperature') {
      if (v < 36) return { text: 'Low', color: 'text-blue-600' }
      if (v > 38) return { text: 'Fever', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    if (type === 'oxygen_level') {
      if (v < 95) return { text: 'Low', color: 'text-red-600' }
      return { text: 'Normal', color: 'text-green-600' }
    }
    return { text: '', color: '' }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">Health Vitals</h2>
              <p className="text-orange-100 text-sm opacity-80">Track your blood pressure, heart rate, temperature & more. All stored offline.</p>
            </div>
            <FaHeartbeat className="text-6xl opacity-20" />
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-bold bg-orange-600 hover:bg-orange-700 text-white"
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
                        const vt = vitalTypes.find(v => v.id === e.target.value)
                        setForm({ ...form, type: e.target.value as any, unit: vt?.unit || '' })
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    >
                      {vitalTypes.map(v => (
                        <option key={v.id} value={v.id}>{v.icon} {v.type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Value ({form.unit})
                    </label>
                    <input
                      type="text"
                      placeholder={vitalTypes.find(v => v.id === form.type)?.placeholder || ''}
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
                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-xl font-bold mt-4 shadow-lg transition-all">
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
          const last = entries.find(e => e.type === vt.id)
          return (
            <div key={vt.id} className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setFilterType(filterType === vt.id ? 'All' : vt.id)}>
              <p className="text-2xl mb-1">{vt.icon}</p>
              <p className="text-xs font-black text-slate-500 dark:text-slate-400 mb-1 leading-tight uppercase">{vt.type}</p>
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
        {['All', ...vitalTypes.map(v => v.id)].map(id => (
          <button
            key={id}
            onClick={() => setFilterType(id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === id
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700'
            }`}
          >
            {id === 'All' ? 'All Readings' : vitalTypes.find(v => v.id === id)?.type}
          </button>
        ))}
      </div>

      {/* Entries List */}
      {filtered.length === 0 ? (
        <div className="glass-card text-center py-20">
          <FaHeartbeat className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase">No readings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start logging your health vitals using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => {
            const vt = vitalTypes.find(v => v.id === entry.type)
            const status = getStatus(entry.type, entry.value)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 flex justify-between items-center border-l-4 border-l-orange-500"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{vt?.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{vt?.type || entry.type}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{entry.value} <span className="text-sm font-medium text-slate-400">{entry.unit}</span></p>
                    {status.text && <p className={`text-xs font-bold ${status.color}`}>{status.text}</p>}
                    {entry.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{entry.notes}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
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


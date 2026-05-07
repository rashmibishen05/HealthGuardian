import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFileMedical, FaPlus, FaTrash, FaDownload, FaUserMd, FaLightbulb, FaCheckCircle, FaExclamationCircle, FaSync } from 'react-icons/fa'
import { dbHelper, type HealthRecord } from '../utils/indexedDB'
import { analyzeVitals } from '../utils/healthAnalysis'
import { syncToCloud } from '../utils/sync'

const categories = [
  { id: 'prescription', label: 'Prescription', icon: '💊', color: 'blue' },
  { id: 'report', label: 'Lab Report', icon: '🧪', color: 'purple' },
  { id: 'radiology', label: 'X-Ray / Scan', icon: '🩻', color: 'cyan' },
  { id: 'vaccination', label: 'Vaccination', icon: '💉', color: 'green' },
  { id: 'surgery', label: 'Surgery / Procedure', icon: '🏥', color: 'red' },
  { id: 'allergy', label: 'Allergy Record', icon: '⚠️', color: 'amber' },
]

function HealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState<Omit<HealthRecord, 'id' | 'timestamp'>>({
    type: 'prescription',
    title: '',
    doctor: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const userEmail = localStorage.getItem('userEmail')

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      await dbHelper.init()
      const data = await dbHelper.getHealthRecords()
      setRecords(data.sort((a, b) => b.timestamp - a.timestamp))
    } catch (e) {
      console.error('Failed to load records:', e)
    }
  }

  const saveRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return

    try {
      const newRecord: HealthRecord = {
        ...form,
        timestamp: Date.now(),
      }
      await dbHelper.addHealthRecord(newRecord)
      setForm({ type: 'prescription', title: '', doctor: '', date: new Date().toISOString().slice(0, 10), notes: '' })
      setShowForm(false)
      loadRecords()
      
      // Sync to cloud
      if (userEmail) {
        setIsSyncing(true)
        await syncToCloud(userEmail)
        setIsSyncing(false)
      }
    } catch (e) {
      console.error('Failed to save record:', e)
      setIsSyncing(false)
    }
  }

  const deleteRecord = async (id?: number) => {
    if (!id || !confirm('Delete this health record?')) return
    try {
      await dbHelper.deleteHealthRecord(id)
      loadRecords()
    } catch (e) {
      console.error('Failed to delete record:', e)
    }
  }

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health_records_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = records
    .filter(r => filterCategory === 'All' || r.type === filterCategory)
    .filter(r =>
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.doctor && r.doctor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-black tracking-tight uppercase">Health Records</h2>
                {isSyncing && <FaSync className="animate-spin text-xs opacity-50" />}
              </div>
              <p className="text-purple-100 text-sm opacity-80">Store prescriptions, lab reports, and medical history. All stored offline.</p>
            </div>
            <FaFileMedical className="text-6xl opacity-20" />
          </div>
        </div>

        <div className="p-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Record'}
          </button>
          {records.length > 0 && (
            <button
              onClick={exportToJSON}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              <FaDownload /> Export Records
            </button>
          )}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={saveRecord}
              className="mx-6 mb-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Category</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Title / Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Test Report - Jan"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Doctor / Hospital</label>
                  <input
                    type="text"
                    placeholder="Dr. Sharma / Apollo Hospital"
                    value={form.doctor}
                    onChange={e => setForm({ ...form, doctor: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Notes / Description</label>
                  <textarea
                    placeholder="Diagnosis, medications, results, observations..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl font-bold mt-4 shadow-lg transition-all">
                💾 Save Record Offline
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => {
          const count = records.filter(r => r.type === cat.id).length
          return (
            <div
              key={cat.id}
              onClick={() => setFilterCategory(filterCategory === cat.id ? 'All' : cat.id)}
              className={`glass-card p-4 text-center cursor-pointer transition-all hover:scale-105 ${filterCategory === cat.id ? 'ring-2 ring-purple-500 shadow-xl' : ''}`}
            >
              <p className="text-2xl mb-1">{cat.icon}</p>
              <p className="text-xs font-black text-slate-500 dark:text-slate-400 leading-tight uppercase">{cat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['All', ...categories.map(c => c.id)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === cat
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat === 'All' ? 'All Records' : categories.find(c => c.id === cat)?.label}
          </button>
        ))}
      </div>

      {/* Records List */}
      {filtered.length === 0 ? (
        <div className="glass-card text-center py-20">
          <FaFileMedical className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase">No records yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Add prescriptions, lab reports, vaccination records, and more.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((record) => {
            const cat = categories.find(c => c.id === record.type)
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-l-4 border-l-purple-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat?.icon}</span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{cat?.label}</p>
                      <h4 className="font-black text-slate-900 dark:text-white leading-tight">{record.title}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>

                {record.doctor && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-2">
                    <FaUserMd className="text-purple-500 text-xs" /> {record.doctor}
                  </p>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{record.date}</p>

                {record.notes && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                      {record.notes}
                    </p>
                    
                    {/* Advanced Offline Insight */}
                    {analyzeVitals(record.notes).length > 0 && (
                      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-2">
                           <FaLightbulb /> AI Insight (Offline)
                        </div>
                        <div className="space-y-2">
                          {analyzeVitals(record.notes).map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              {insight.status === 'normal' ? <FaCheckCircle className="text-green-500 mt-1" /> : <FaExclamationCircle className="text-amber-500 mt-1" />}
                              <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white">
                                  {insight.type}: {insight.status.toUpperCase()}
                                </p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                  {insight.advice}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HealthRecords


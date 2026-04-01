import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFileMedical, FaPlus, FaTrash, FaDownload, FaUserMd } from 'react-icons/fa'

interface HealthRecord {
  id: number
  category: string
  title: string
  doctor: string
  date: string
  description: string
  tags: string[]
  createdAt: string
}

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
  const [form, setForm] = useState<Omit<HealthRecord, 'id' | 'createdAt'>>({
    category: 'prescription',
    title: '',
    doctor: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('health_records')
    if (stored) setRecords(JSON.parse(stored))
  }, [])

  const saveRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return

    const newRecord: HealthRecord = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    const updated = [newRecord, ...records]
    setRecords(updated)
    localStorage.setItem('health_records', JSON.stringify(updated))
    setForm({ category: 'prescription', title: '', doctor: '', date: new Date().toISOString().slice(0, 10), description: '', tags: [] })
    setTagInput('')
    setShowForm(false)
  }

  const deleteRecord = (id: number) => {
    if (!confirm('Delete this health record?')) return
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('health_records', JSON.stringify(updated))
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
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
    .filter(r => filterCategory === 'All' || r.category === filterCategory)
    .filter(r =>
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">HEALTH RECORDS</h2>
              <p className="text-purple-100 text-sm opacity-80">Store prescriptions, lab reports, and medical history. All stored offline on your device.</p>
            </div>
            <FaFileMedical className="text-6xl opacity-20" />
          </div>
        </div>

        <div className="p-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-bold"
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
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
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
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Tags (press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag, i) => (
                      <span key={i} onClick={() => setForm({ ...form, tags: form.tags.filter((_, j) => j !== i) })} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold cursor-pointer">
                        {tag} ×
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. diabetes, cardiology, fasting..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary py-3 px-8 rounded-xl font-bold">
                💾 Save Record Offline
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => {
          const count = records.filter(r => r.category === cat.id).length
          return (
            <div
              key={cat.id}
              onClick={() => setFilterCategory(filterCategory === cat.id ? 'All' : cat.id)}
              className={`glass-card p-4 text-center cursor-pointer transition-all hover:scale-105 ${filterCategory === cat.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              <p className="text-2xl mb-1">{cat.icon}</p>
              <p className="text-xs font-black text-slate-500 dark:text-slate-400 leading-tight">{cat.label}</p>
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No records yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Add prescriptions, lab reports, vaccination records, and more.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All data is saved offline, securely on your device only.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((record) => {
            const cat = categories.find(c => c.id === record.category)
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
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
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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

                {record.description && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                    {record.description}
                  </p>
                )}

                {record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {record.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-bold">
                        #{tag}
                      </span>
                    ))}
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

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClock, FaPlus, FaTrash, FaBell, FaBellSlash, FaPills } from 'react-icons/fa'
import { dbHelper, type MedicationReminder } from '../utils/indexedDB'

function MedicationReminders() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<MedicationReminder>({
    medicineName: '',
    dosage: '',
    frequency: 'Daily',
    times: ['08:00'],
    startDate: new Date().toISOString().slice(0, 10),
    notes: '',
    reminderEnabled: true
  })

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      await dbHelper.init()
      const data = await dbHelper.getMedicationReminders()
      setReminders(data)
    } catch (e) {
      console.error(e)
    }
  }

  const saveReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.medicineName) return
    try {
      await dbHelper.addMedicationReminder(form)
      setForm({
        medicineName: '',
        dosage: '',
        frequency: 'Daily',
        times: ['08:00'],
        startDate: new Date().toISOString().slice(0, 10),
        notes: '',
        reminderEnabled: true
      })
      setShowForm(false)
      loadReminders()
      
      if (form.reminderEnabled && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toggleReminder = async (id: number, current: boolean) => {
    const reminder = reminders.find(r => r.id === id)
    if (reminder) {
      try {
        await dbHelper.updateMedicationReminder(id, { ...reminder, reminderEnabled: !current })
        loadReminders()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const deleteReminder = async (id?: number) => {
    if (!id || !confirm('Delete this reminder?')) return
    try {
      await dbHelper.deleteMedicationReminder(id)
      loadReminders()
    } catch (e) {
      console.error(e)
    }
  }

  const addTime = () => setForm({ ...form, times: [...form.times, '12:00'] })
  const removeTime = (idx: number) => setForm({ ...form, times: form.times.filter((_, i) => i !== idx) })
  const updateTime = (idx: number, val: string) => {
    const newTimes = [...form.times]
    newTimes[idx] = val
    setForm({ ...form, times: newTimes })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-card overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-pink-600 to-rose-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">MEDICATION REMINDERS</h2>
              <p className="text-pink-100 text-sm opacity-80">Never miss a dose. Track your medicines and get notified.</p>
            </div>
            <FaClock className="text-6xl opacity-20" />
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-bold bg-pink-600 hover:bg-pink-700 text-white"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Reminder'}
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={saveReminder}
                className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Medicine Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol"
                      value={form.medicineName}
                      onChange={e => setForm({ ...form, medicineName: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Tablet (500mg)"
                      value={form.dosage}
                      onChange={e => setForm({ ...form, dosage: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Frequency</label>
                    <select
                      value={form.frequency}
                      onChange={e => setForm({ ...form, frequency: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    >
                      <option>Daily</option>
                      <option>Twice a Day</option>
                      <option>Weekly</option>
                      <option>As Needed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      Reminder Times
                      <button type="button" onClick={addTime} className="text-blue-500 hover:text-blue-600 font-bold">+ Add Time</button>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {form.times.map((time, i) => (
                        <div key={i} className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                          <input
                            type="time"
                            value={time}
                            onChange={e => updateTime(i, e.target.value)}
                            className="bg-transparent outline-none px-2 text-sm font-bold text-slate-900 dark:text-white"
                            required
                          />
                          {form.times.length > 1 && (
                            <button type="button" onClick={() => removeTime(i)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FaTrash className="text-xs" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={form.reminderEnabled}
                        onChange={e => setForm({ ...form, reminderEnabled: e.target.checked })}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Enable device notifications</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-xl font-bold mt-4 shadow-lg shadow-pink-600/20 transition-all">
                  💾 Save Reminder
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="glass-card text-center py-20">
          <FaPills className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No reminders set</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Add a medication to start tracking your doses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(reminder => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-l-pink-500 flex justify-between items-start"
            >
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FaPills className="text-pink-500" /> {reminder.medicineName}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{reminder.dosage} • {reminder.frequency}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {reminder.times.map((time, i) => (
                    <span key={i} className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-bold border border-pink-100 dark:border-pink-800/30 flex items-center gap-1">
                      <FaClock className="text-[10px]" /> {time}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleReminder(reminder.id!, reminder.reminderEnabled)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reminder.reminderEnabled ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  title={reminder.reminderEnabled ? 'Disable notifications' : 'Enable notifications'}
                >
                  {reminder.reminderEnabled ? <FaBell /> : <FaBellSlash />}
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MedicationReminders

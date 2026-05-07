import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dbHelper, type HealthVital } from '../utils/indexedDB'
import { vitalRanges, commonSymptoms } from '../data/healthTracking'

function HealthTracker() {
  const [vitals, setVitals] = useState<HealthVital[]>([])
  const [selectedType, setSelectedType] = useState<keyof typeof vitalRanges>('blood_pressure')
  const [newVital, setNewVital] = useState({ value: '', notes: '' })
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [selectedSymptom, setSelectedSymptom] = useState('')

  useEffect(() => {
    loadVitals()
  }, [])

  const loadVitals = async () => {
    try {
      const data = await dbHelper.getHealthVitals()
      setVitals(data.sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error('Failed to load vitals:', error)
    }
  }

  const addVital = async () => {
    if (!newVital.value.trim()) {
      alert('Please enter a value')
      return
    }

    try {
      const vital: HealthVital = {
        type: selectedType,
        value: newVital.value,
        unit: vitalRanges[selectedType].unit,
        timestamp: Date.now(),
        notes: newVital.notes
      }
      
      await dbHelper.addHealthVital(vital)
      setNewVital({ value: '', notes: '' })
      loadVitals()
    } catch (error) {
      console.error('Failed to add vital:', error)
    }
  }

  const addSymptom = () => {
    if (selectedSymptom && !symptoms.includes(selectedSymptom)) {
      setSymptoms([...symptoms, selectedSymptom])
      setSelectedSymptom('')
    }
  }

  const chartData = vitals
    .filter(v => v.type === selectedType)
    .slice(0, 7)
    .reverse()
    .map(v => ({
      date: new Date(v.timestamp).toLocaleDateString(),
      value: parseFloat(v.value.split('/')[0]) || parseFloat(v.value)
    }))

  const calculateHealthScore = () => {
    if (vitals.length === 0) return 0
    
    let score = 100
    const recentVitals = vitals.slice(0, 5)
    
    recentVitals.forEach(v => {
      const range = vitalRanges[v.type as keyof typeof vitalRanges]
      if (!range) return
      
      const val = parseFloat(v.value.split('/')[0]) || parseFloat(v.value)
      const [min, max] = range.normal.split('-').map(parseFloat)
      
      if (val < min || val > max) {
        score -= 10
      }
    })
    
    return Math.max(score, 20)
  }

  const healthScore = calculateHealthScore()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">Health Vitals Tracker</h2>
        
        {/* Advanced Health Score */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
           <div className="md:col-span-3 glass p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/5 flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-700" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * healthScore) / 100} className={`${healthScore > 80 ? 'text-green-500' : healthScore > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`} />
                 </svg>
                 <span className="absolute text-2xl font-black">{healthScore}%</span>
              </div>
              <div>
                 <h4 className="text-xl font-bold">Health Wellness Score</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {healthScore > 80 ? "Excellent! Your vitals are within normal range." : 
                     healthScore > 50 ? "Good, but some vitals need attention." : 
                     "Warning: Multiple vitals are outside normal range."}
                 </p>
              </div>
           </div>
           <div className="glass p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex flex-col justify-center">
              <span className="text-[10px] font-black tracking-widest uppercase opacity-70">Total Logs</span>
              <span className="text-4xl font-black">{vitals.length}</span>
              <span className="text-xs font-bold mt-2">Active Tracking</span>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {Object.entries(vitalRanges).map(([key, info]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedType(key as keyof typeof vitalRanges)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedType === key
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'glass hover:scale-105'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-2">{info.icon}</div>
              <div className="text-xs font-semibold">{key.replace('_', ' ').toUpperCase()}</div>
              <div className="text-xs opacity-80">{info.normal} {info.unit}</div>
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Record New Reading</h3>
            <input
              type="text"
              placeholder={`Enter ${selectedType.replace('_', ' ')} (${vitalRanges[selectedType].unit})`}
              value={newVital.value}
              onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
              className="input-glass w-full"
            />
            <textarea
              placeholder="Notes (optional)"
              value={newVital.notes}
              onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
              className="input-glass w-full h-20"
            />
            <button onClick={addVital} className="btn-success w-full">
              Save Reading
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Readings</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {vitals.filter(v => v.type === selectedType).slice(0, 5).map((vital) => (
                <motion.div
                  key={vital.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{vital.value} {vital.unit}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(vital.timestamp).toLocaleString()}
                      </p>
                      {vital.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{vital.notes}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 className="text-xl font-bold mb-4">7-Day Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h3 className="text-xl font-bold mb-4">Symptom Log</h3>
        <div className="flex gap-2 mb-4">
          <select
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            className="input-glass flex-1"
          >
            <option value="">Select symptom...</option>
            {commonSymptoms.map((symptom) => (
              <option key={symptom} value={symptom}>{symptom}</option>
            ))}
          </select>
          <button onClick={addSymptom} className="btn-primary">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="badge bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
            >
              {symptom}
              <button
                onClick={() => setSymptoms(symptoms.filter((_, i) => i !== idx))}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default HealthTracker

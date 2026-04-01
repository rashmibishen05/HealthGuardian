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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">Health Vitals Tracker</h2>

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

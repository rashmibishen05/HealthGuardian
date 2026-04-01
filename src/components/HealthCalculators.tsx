import { useState } from 'react'
import { motion } from 'framer-motion'

function HealthCalculators() {
  const [bmi, setBmi] = useState({ height: '', weight: '', result: 0, category: '' })
  const [bmr, setBmr] = useState({ age: '', height: '', weight: '', gender: 'male', result: 0 })
  const [water, setWater] = useState({ weight: '', result: 0 })

  const calculateBMI = () => {
    const h = parseFloat(bmi.height) / 100 // convert cm to m
    const w = parseFloat(bmi.weight)
    if (h && w) {
      const result = w / (h * h)
      setBmi({
        ...bmi,
        result: parseFloat(result.toFixed(1)),
        category: getBMICategory(result)
      })
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  const calculateBMR = () => {
    const w = parseFloat(bmr.weight)
    const h = parseFloat(bmr.height)
    const a = parseFloat(bmr.age)
    
    if (w && h && a) {
      let result = 0
      if (bmr.gender === 'male') {
        result = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      } else {
        result = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a)
      }
      setBmr({ ...bmr, result: parseInt(result.toString()) })
    }
  }

  const calculateWater = () => {
    const w = parseFloat(water.weight)
    if (w) {
      const result = w * 0.033 // liters per kg
      setWater({ ...water, result: parseFloat(result.toFixed(1)) })
    }
  }

  return (
    <div className="space-y-6">
      {/* BMI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">BMI Calculator</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Height (cm)"
              value={bmi.height}
              onChange={(e) => setBmi({ ...bmi, height: e.target.value })}
              className="input-glass w-full"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={bmi.weight}
              onChange={(e) => setBmi({ ...bmi, weight: e.target.value })}
              className="input-glass w-full"
            />
            <button onClick={calculateBMI} className="btn-primary w-full">
              Calculate BMI
            </button>
          </div>
          {bmi.result > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{bmi.result}</div>
              <div className="text-lg font-semibold">{bmi.category}</div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* BMR Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">BMR Calculator</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <select
              value={bmr.gender}
              onChange={(e) => setBmr({ ...bmr, gender: e.target.value })}
              className="input-glass w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="number"
              placeholder="Age (years)"
              value={bmr.age}
              onChange={(e) => setBmr({ ...bmr, age: e.target.value })}
              className="input-glass w-full"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={bmr.height}
              onChange={(e) => setBmr({ ...bmr, height: e.target.value })}
              className="input-glass w-full"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={bmr.weight}
              onChange={(e) => setBmr({ ...bmr, weight: e.target.value })}
              className="input-glass w-full"
            />
            <button onClick={calculateBMR} className="btn-primary w-full">
              Calculate BMR
            </button>
          </div>
          {bmr.result > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{bmr.result}</div>
              <div className="text-sm">calories/day</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Basal Metabolic Rate - calories burned at rest
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Water Intake Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">Daily Water Intake</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Weight (kg)"
              value={water.weight}
              onChange={(e) => setWater({ ...water, weight: e.target.value })}
              className="input-glass w-full"
            />
            <button onClick={calculateWater} className="btn-primary w-full">
              Calculate Water Intake
            </button>
          </div>
          {water.result > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass p-6 rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{water.result}</div>
              <div className="text-sm">liters/day</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Recommended daily water intake
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HealthCalculators

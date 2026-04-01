import { motion } from 'framer-motion'

function HealthRecords() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 className="text-2xl font-bold text-gradient mb-6">Health Records</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Store and manage your medical records securely on your device. Upload prescriptions, test results, and more!
      </p>
    </motion.div>
  )
}

export default HealthRecords

import { motion } from 'framer-motion'

function MedicationReminders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 className="text-2xl font-bold text-gradient mb-6">Medication Reminders</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Set up medication reminders to never miss a dose. Feature coming soon with full notification support!
      </p>
    </motion.div>
  )
}

export default MedicationReminders

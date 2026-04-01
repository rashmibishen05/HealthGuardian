import { useState } from 'react'
import { motion } from 'framer-motion'
import { doctors, specialties, searchDoctors } from '../data/doctors'
import { FaStar, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

function DoctorFinder() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [results, setResults] = useState(doctors)

  const handleSearch = (specialty: string) => {
    setSelectedSpecialty(specialty)
    if (specialty) {
      setResults(searchDoctors(specialty, undefined))
    } else {
      setResults(doctors)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-bold text-gradient mb-6">Find Doctors</h2>
        
        <select
          value={selectedSpecialty}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-glass w-full mb-6"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>

        <div className="grid md:grid-cols-2 gap-4">
          {results.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card card-hover"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{doctor.specialty}</p>
                  {doctor.subSpecialty && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">{doctor.subSpecialty}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{doctor.rating}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  <span>{doctor.phone}</span>
                </div>
                <p className="text-xs">
                  {doctor.experience} years experience • {doctor.languages.join(', ')}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {doctor.availability.map((day) => (
                    <span key={day} className="badge text-xs">{day}</span>
                  ))}
                </div>
                {doctor.accepting && (
                  <span className="inline-block mt-2 badge bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                    Accepting New Patients
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DoctorFinder

export interface Doctor {
  id: number
  name: string
  specialty: string
  subSpecialty?: string
  rating: number
  experience: number // years
  hospital: string
  address: string
  phone: string
  latitude: number
  longitude: number
  availability: string[]
  languages: string[]
  accepting: boolean
}

export const specialties = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedic',
  'Psychiatrist',
  'Gynecologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Dentist',
  'Gastroenterologist',
  'Endocrinologist',
  'Urologist',
  'Pulmonologist'
]

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'General Physician',
    rating: 4.8,
    experience: 15,
    hospital: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '555-0201',
    latitude: 28.6139,
    longitude: 77.2090,
    availability: ['Mon', 'Wed', 'Fri'],
    languages: ['English', 'Spanish'],
    accepting: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    subSpecialty: 'Interventional Cardiology',
    rating: 4.9,
    experience: 20,
    hospital: 'Memorial Hospital',
    address: '321 Pine Road, Westside',
    phone: '555-0202',
    latitude: 28.6239,
    longitude: 77.2190,
    availability: ['Tue', 'Thu', 'Sat'],
    languages: ['English', 'Mandarin'],
    accepting: true
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: 12,
    hospital: 'St. Mary Medical Center',
    address: '456 Oak Avenue, Midtown',
    phone: '555-0203',
    latitude: 28.6189,
    longitude: 77.2140,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    languages: ['English', 'Spanish'],
    accepting: true
  },
  {
    id: 4,
    name: 'Dr. Raj Patel',
    specialty: 'Neurologist',
    rating: 4.8,
    experience: 18,
    hospital: 'Central Medical Institute',
    address: '654 Maple Drive, Eastside',
    phone: '555-0204',
    latitude: 28.6039,
    longitude: 77.1990,
    availability: ['Wed', 'Thu', 'Fri'],
    languages: ['English', 'Hindi', 'Gujarati'],
    accepting: true
  },
  {
    id: 5,
    name: 'Dr. Amanda White',
    specialty: 'Dermatologist',
    rating: 4.6,
    experience: 10,
    hospital: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '555-0205',
    latitude: 28.6139,
    longitude: 77.2090,
    availability: ['Mon', 'Wed', 'Fri'],
    languages: ['English'],
    accepting: true
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic',
    subSpecialty: 'Sports Medicine',
    rating: 4.9,
    experience: 22,
    hospital: 'Memorial Hospital',
    address: '321 Pine Road, Westside',
    phone: '555-0206',
    latitude: 28.6239,
    longitude: 77.2190,
    availability: ['Tue', 'Thu'],
    languages: ['English'],
    accepting: false
  },
  {
    id: 7,
    name: 'Dr. Lisa Kim',
    specialty: 'Psychiatrist',
    rating: 4.8,
    experience: 14,
    hospital: 'Community Health Clinic',
    address: '789 Elm Street, Uptown',
    phone: '555-0207',
    latitude: 28.6089,
    longitude: 77.2040,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    languages: ['English', 'Korean'],
    accepting: true
  },
  {
    id: 8,
    name: 'Dr. Mohammed Ahmed',
    specialty: 'ENT Specialist',
    rating: 4.7,
    experience: 16,
    hospital: 'Central Medical Institute',
    address: '654 Maple Drive, Eastside',
    phone: '555-0208',
    latitude: 28.6039,
    longitude: 77.1990,
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    languages: ['English', 'Arabic'],
    accepting: true
  }
]

export function searchDoctors(specialty?: string, accepting?: boolean): Doctor[] {
  return doctors.filter(doc => {
    if (specialty && doc.specialty !== specialty) return false
    if (accepting !== undefined && doc.accepting !== accepting) return false
    return true
  })
}

export function getNearbyDoctors(userLat: number, userLon: number, maxDistance: number = 10): Doctor[] {
  return doctors
    .map(doctor => ({
      ...doctor,
      distance: calculateDistance(userLat, userLon, doctor.latitude, doctor.longitude)
    }))
    .filter(doctor => doctor.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  services: string[]
  emergency247: boolean
}

// Sample hospital data for different cities
export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '911',
    latitude: 28.6139,
    longitude: 77.2090,
    services: ['Emergency', 'ICU', 'Surgery', 'Cardiology'],
    emergency247: true,
  },
  {
    id: 2,
    name: 'St. Mary Medical Center',
    address: '456 Oak Avenue, Midtown',
    phone: '555-0102',
    latitude: 28.6189,
    longitude: 77.2140,
    services: ['Emergency', 'Pediatrics', 'Maternity', 'Orthopedics'],
    emergency247: true,
  },
  {
    id: 3,
    name: 'Community Health Clinic',
    address: '789 Elm Street, Uptown',
    phone: '555-0103',
    latitude: 28.6089,
    longitude: 77.2040,
    services: ['General Medicine', 'Pharmacy', 'Lab'],
    emergency247: false,
  },
  {
    id: 4,
    name: 'Memorial Hospital',
    address: '321 Pine Road, Westside',
    phone: '555-0104',
    latitude: 28.6239,
    longitude: 77.2190,
    services: ['Emergency', 'Trauma', 'Neurology', 'ICU'],
    emergency247: true,
  },
  {
    id: 5,
    name: 'Central Medical Institute',
    address: '654 Maple Drive, Eastside',
    phone: '555-0105',
    latitude: 28.6039,
    longitude: 77.1990,
    services: ['Emergency', 'Surgery', 'Radiology', 'Oncology'],
    emergency247: true,
  },
]

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

export function getNearbyHospitals(
  userLat: number,
  userLon: number,
  maxDistance: number = 10
): Hospital[] {
  return hospitals
    .map((hospital) => ({
      ...hospital,
      distance: calculateDistance(userLat, userLon, hospital.latitude, hospital.longitude),
    }))
    .filter((hospital) => hospital.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

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
  return R * c
}

// Large dataset of hospitals across major Indian cities with realistic coordinates
export const hospitals: Hospital[] = [
  // Delhi NCR
  { id: 1, name: 'All India Institute of Medical Sciences (AIIMS)', address: 'Ansari Nagar, New Delhi', phone: '011-26588500', latitude: 28.5672, longitude: 77.2100, services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology'], emergency247: true },
  { id: 2, name: 'Safdarjung Hospital', address: 'Ansari Nagar West, New Delhi', phone: '011-26707444', latitude: 28.5689, longitude: 77.2036, services: ['Emergency', 'Trauma', 'ICU', 'Surgery'], emergency247: true },
  { id: 3, name: 'Ram Manohar Lohia Hospital', address: 'Baba Kharak Singh Marg, New Delhi', phone: '011-23404000', latitude: 28.6245, longitude: 77.2082, services: ['Emergency', 'Cardiology', 'Orthopedics'], emergency247: true },
  { id: 4, name: 'Fortis Hospital Shalimar Bagh', address: 'Shalimar Bagh, North Delhi', phone: '011-46911111', latitude: 28.7190, longitude: 77.1618, services: ['Emergency', 'Cardiac', 'Neuro', 'Cancer'], emergency247: true },
  { id: 5, name: 'Max Super Specialty Hospital Saket', address: 'Saket, New Delhi', phone: '011-26515050', latitude: 28.5220, longitude: 77.2098, services: ['Emergency', 'Orthopedics', 'Cardiology', 'Oncology'], emergency247: true },
  { id: 6, name: 'Apollo Hospital Jasola', address: 'Jasola Vihar, New Delhi', phone: '011-71791000', latitude: 28.5365, longitude: 77.2953, services: ['Emergency', 'ICU', 'Transplant', 'Radiology'], emergency247: true },
  { id: 7, name: 'GTB Hospital', address: 'Dilshad Garden, Delhi', phone: '011-22581081', latitude: 28.6852, longitude: 77.3178, services: ['Emergency', 'General', 'Surgery'], emergency247: true },
  { id: 8, name: 'Lok Nayak Hospital', address: 'Jawaharlal Nehru Marg, Delhi', phone: '011-23232400', latitude: 28.6405, longitude: 77.2407, services: ['Emergency', 'Surgery', 'General Medicine'], emergency247: true },

  // Mumbai
  { id: 9, name: 'KEM Hospital', address: 'Acharya Donde Marg, Parel, Mumbai', phone: '022-24107000', latitude: 18.9922, longitude: 72.8404, services: ['Emergency', 'ICU', 'Trauma', 'Cardiology'], emergency247: true },
  { id: 10, name: 'Lilavati Hospital Bandra', address: 'A Marg, Bandra West, Mumbai', phone: '022-26751000', latitude: 19.0545, longitude: 72.8245, services: ['Emergency', 'Cardiac', 'Neuro', 'Oncology'], emergency247: true },
  { id: 11, name: 'Breach Candy Hospital', address: 'Bhulabhai Desai Road, Mumbai', phone: '022-23667888', latitude: 18.9719, longitude: 72.8092, services: ['Emergency', 'ICU', 'Maternity', 'Surgery'], emergency247: true },
  { id: 12, name: 'Jaslok Hospital', address: 'Peddar Road, Mumbai', phone: '022-66573333', latitude: 18.9681, longitude: 72.8069, services: ['Emergency', 'Cardiac', 'Neurology'], emergency247: true },

  // Bangalore
  { id: 13, name: 'Manipal Hospital Bangalore', address: 'HAL Airport Road, Bengaluru', phone: '080-25023456', latitude: 12.9699, longitude: 77.6399, services: ['Emergency', 'Cardiac', 'Ortho', 'Transplant'], emergency247: true },
  { id: 14, name: 'Fortis Hospital Rajajinagar', address: 'Rajajinagar, Bengaluru', phone: '080-66214444', latitude: 12.9907, longitude: 77.5539, services: ['Emergency', 'ICU', 'Cancer', 'Neuro'], emergency247: true },
  { id: 15, name: 'Victoria Hospital', address: 'Fort, Bengaluru', phone: '080-26703880', latitude: 12.9620, longitude: 77.5738, services: ['Emergency', 'General Medicine', 'Surgery'], emergency247: true },
  { id: 16, name: 'Narayana Health City', address: 'Bommasandra, Bengaluru', phone: '080-71222222', latitude: 12.8418, longitude: 77.6681, services: ['Cardiac', 'Transplant', 'Neurology', 'Emergency'], emergency247: true },
  { id: 17, name: 'Apollo Hospital Bannerghatta', address: 'Bannerghatta Road, Bengaluru', phone: '080-25533333', latitude: 12.8895, longitude: 77.5983, services: ['Emergency', 'IVF', 'Cardiac', 'Oncology'], emergency247: true },

  // Chennai
  { id: 18, name: 'Government General Hospital', address: 'Park Town, Chennai', phone: '044-25305000', latitude: 13.0814, longitude: 80.2787, services: ['Emergency', 'Trauma', 'ICU', 'Surgery'], emergency247: true },
  { id: 19, name: 'Apollo Hospital Chennai', address: 'Greams Road, Chennai', phone: '044-28296000', latitude: 13.0570, longitude: 80.2545, services: ['Emergency', 'Cardiac', 'Neurology', 'Cancer'], emergency247: true },
  { id: 20, name: 'Fortis Malar Hospital', address: 'Gandhi Irwin Bridge, Chennai', phone: '044-42890000', latitude: 13.0064, longitude: 80.2610, services: ['Emergency', 'Ortho', 'Cardiology'], emergency247: true },

  // Hyderabad
  { id: 21, name: 'Nizam\'s Institute of Medical Sciences (NIMS)', address: 'Punjagutta, Hyderabad', phone: '040-23489000', latitude: 17.4272, longitude: 78.4537, services: ['Emergency', 'Transplant', 'Cardiology', 'Neurology'], emergency247: true },
  { id: 22, name: 'Apollo Hospital Jubilee Hills', address: 'Jubilee Hills, Hyderabad', phone: '040-23607777', latitude: 17.4237, longitude: 78.4232, services: ['Emergency', 'ICU', 'Cancer', 'Cardiac'], emergency247: true },
  { id: 23, name: 'Yashoda Hospital Secunderabad', address: 'SP Road, Secunderabad', phone: '040-43567890', latitude: 17.4385, longitude: 78.4967, services: ['Emergency', 'Cardiac', 'Ortho'], emergency247: true },

  // Kolkata
  { id: 24, name: 'SSKM Hospital', address: 'AJC Bose Road, Kolkata', phone: '033-22044440', latitude: 22.5358, longitude: 88.3440, services: ['Emergency', 'ICU', 'Trauma', 'Surgery'], emergency247: true },
  { id: 25, name: 'Fortis Hospital Anandapur', address: 'Anandapur, Kolkata', phone: '033-66284444', latitude: 22.5099, longitude: 88.3984, services: ['Emergency', 'Cardiac', 'Neuro'], emergency247: true },

  // Pune
  { id: 26, name: 'Jehangir Hospital', address: 'Sassoon Road, Pune', phone: '020-66814444', latitude: 18.5193, longitude: 73.8701, services: ['Emergency', 'ICU', 'Cardiac', 'Ortho'], emergency247: true },
  { id: 27, name: 'Ruby Hall Clinic', address: 'Sassoon Road, Pune', phone: '020-26163391', latitude: 18.5288, longitude: 73.8787, services: ['Emergency', 'Cardiac', 'Neurology'], emergency247: true },
  { id: 28, name: 'Deenanath Mangeshkar Hospital', address: 'Erandwane, Pune', phone: '020-49150100', latitude: 18.5022, longitude: 73.8342, services: ['Emergency', 'Cancer', 'Maternity'], emergency247: true },

  // Ahmedabad
  { id: 29, name: 'Apollo Hospital Ahmedabad', address: 'Plot 1A, GIDC, Ahmedabad', phone: '079-66701800', latitude: 23.0395, longitude: 72.5504, services: ['Emergency', 'Cardiac', 'Neuro', 'Transplant'], emergency247: true },
  { id: 30, name: 'Civil Hospital Ahmedabad', address: 'Asarwa, Ahmedabad', phone: '079-22681111', latitude: 23.0566, longitude: 72.6050, services: ['Emergency', 'Trauma', 'ICU'], emergency247: true },
]

export function getNearbyHospitals(
  userLat: number,
  userLon: number,
  maxDistance: number = 50
): (Hospital & { distance: number })[] {
  return hospitals
    .map((hospital) => ({
      ...hospital,
      distance: calculateDistance(userLat, userLon, hospital.latitude, hospital.longitude),
    }))
    .filter((hospital) => hospital.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

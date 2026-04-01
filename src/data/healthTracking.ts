export interface HealthVital {
  id?: number
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_sugar' | 'weight' | 'oxygen_level'
  value: string
  unit: string
  timestamp: number
  notes?: string
}

export interface SymptomLog {
  id?: number
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  duration: string
  timestamp: number
  relatedSymptoms?: string[]
}

export const vitalRanges = {
  blood_pressure: {
    normal: '120/80',
    unit: 'mmHg',
    icon: '💓',
    color: 'red'
  },
  heart_rate: {
    normal: '60-100',
    unit: 'bpm',
    icon: '❤️',
    color: 'pink'
  },
  temperature: {
    normal: '98.6',
    unit: '°F',
    icon: '🌡️',
    color: 'orange'
  },
  blood_sugar: {
    normal: '70-100',
    unit: 'mg/dL',
    icon: '🩸',
    color: 'red'
  },
  weight: {
    normal: 'varies',
    unit: 'lbs',
    icon: '⚖️',
    color: 'blue'
  },
  oxygen_level: {
    normal: '95-100',
    unit: '%',
    icon: '💨',
    color: 'cyan'
  }
}

export const commonSymptoms = [
  'Fever',
  'Headache',
  'Cough',
  'Sore Throat',
  'Fatigue',
  'Body Aches',
  'Nausea',
  'Dizziness',
  'Chest Pain',
  'Shortness of Breath',
  'Abdominal Pain',
  'Diarrhea',
  'Vomiting',
  'Rash',
  'Joint Pain',
  'Back Pain',
  'Congestion',
  'Loss of Appetite',
  'Chills',
  'Night Sweats'
]

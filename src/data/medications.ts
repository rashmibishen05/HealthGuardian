export interface MedicationReminder {
  id?: number
  medicineName: string
  dosage: string
  frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'as_needed'
  times: string[] // e.g., ['08:00', '20:00']
  startDate: string
  endDate?: string
  notes?: string
  reminderEnabled: boolean
  lastTaken?: number
}

export interface MedicationHistory {
  id?: number
  reminderId: number
  medicineName: string
  takenAt: number
  skipped: boolean
  notes?: string
}

export const frequencyOptions = [
  { value: 'daily', label: 'Once Daily', times: 1 },
  { value: 'twice_daily', label: 'Twice Daily', times: 2 },
  { value: 'three_times_daily', label: 'Three Times Daily', times: 3 },
  { value: 'weekly', label: 'Weekly', times: 1 },
  { value: 'as_needed', label: 'As Needed', times: 0 }
]

export const defaultTimes = {
  daily: ['08:00'],
  twice_daily: ['08:00', '20:00'],
  three_times_daily: ['08:00', '14:00', '20:00'],
  weekly: ['08:00'],
  as_needed: []
}

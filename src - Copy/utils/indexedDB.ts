// Enhanced IndexedDB wrapper for offline storage
const DB_NAME = 'HealthGuardianDB'
const DB_VERSION = 2 // Incremented for new stores

export interface MedicineRecord {
  id?: number
  name: string
  uses: string
  dosage: string
  warnings: string
  timestamp: number
}

export interface EmergencyContact {
  id?: number
  name: string
  phone: string
  email?: string
  relationship: string
}

export interface HealthVital {
  id?: number
  type: string
  value: string
  unit: string
  timestamp: number
  notes?: string
}

export interface MedicationReminder {
  id?: number
  medicineName: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  notes?: string
  reminderEnabled: boolean
}

export interface HealthRecord {
  id?: number
  title: string
  type: 'test' | 'prescription' | 'diagnosis' | 'vaccine' | 'other'
  date: string
  doctor?: string
  notes: string
  files?: string[] // Base64 encoded files
  timestamp: number
}

class IndexedDBHelper {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create medicine store
        if (!db.objectStoreNames.contains('medicines')) {
          const medicineStore = db.createObjectStore('medicines', {
            keyPath: 'id',
            autoIncrement: true,
          })
          medicineStore.createIndex('name', 'name', { unique: false })
        }

        // Create emergency contacts store
        if (!db.objectStoreNames.contains('emergencyContacts')) {
          db.createObjectStore('emergencyContacts', {
            keyPath: 'id',
            autoIncrement: true,
          })
        }

        // Create chat history store
        if (!db.objectStoreNames.contains('chatHistory')) {
          db.createObjectStore('chatHistory', {
            keyPath: 'id',
            autoIncrement: true,
          })
        }

        // Create health vitals store
        if (!db.objectStoreNames.contains('healthVitals')) {
          const vitalsStore = db.createObjectStore('healthVitals', {
            keyPath: 'id',
            autoIncrement: true,
          })
          vitalsStore.createIndex('type', 'type', { unique: false })
          vitalsStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Create medication reminders store
        if (!db.objectStoreNames.contains('medicationReminders')) {
          db.createObjectStore('medicationReminders', {
            keyPath: 'id',
            autoIncrement: true,
          })
        }

        // Create health records store
        if (!db.objectStoreNames.contains('healthRecords')) {
          const recordsStore = db.createObjectStore('healthRecords', {
            keyPath: 'id',
            autoIncrement: true,
          })
          recordsStore.createIndex('type', 'type', { unique: false })
          recordsStore.createIndex('date', 'date', { unique: false })
        }
      }
    })
  }

  // Medicine methods
  async addMedicine(medicine: MedicineRecord): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicines'], 'readwrite')
      const store = transaction.objectStore('medicines')
      const request = store.add(medicine)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async searchMedicine(searchTerm: string): Promise<MedicineRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicines'], 'readonly')
      const store = transaction.objectStore('medicines')
      const request = store.getAll()

      request.onsuccess = () => {
        const results = (request.result as MedicineRecord[]).filter((med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Emergency contacts methods
  async addEmergencyContact(contact: EmergencyContact): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['emergencyContacts'], 'readwrite')
      const store = transaction.objectStore('emergencyContacts')
      const request = store.add(contact)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['emergencyContacts'], 'readonly')
      const store = transaction.objectStore('emergencyContacts')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as EmergencyContact[])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteEmergencyContact(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['emergencyContacts'], 'readwrite')
      const store = transaction.objectStore('emergencyContacts')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Chat history methods
  async saveChatMessage(message: { role: string; content: string }): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['chatHistory'], 'readwrite')
      const store = transaction.objectStore('chatHistory')
      const request = store.add({ ...message, timestamp: Date.now() })

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getChatHistory(): Promise<Array<{ role: string; content: string }>> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['chatHistory'], 'readonly')
      const store = transaction.objectStore('chatHistory')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Health vitals methods
  async addHealthVital(vital: HealthVital): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthVitals'], 'readwrite')
      const store = transaction.objectStore('healthVitals')
      const request = store.add(vital)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getHealthVitals(type?: string): Promise<HealthVital[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthVitals'], 'readonly')
      const store = transaction.objectStore('healthVitals')
      
      if (type) {
        const index = store.index('type')
        const request = index.getAll(type)
        request.onsuccess = () => resolve(request.result as HealthVital[])
        request.onerror = () => reject(request.error)
      } else {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result as HealthVital[])
        request.onerror = () => reject(request.error)
      }
    })
  }

  async deleteHealthVital(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthVitals'], 'readwrite')
      const store = transaction.objectStore('healthVitals')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Medication reminders methods
  async addMedicationReminder(reminder: MedicationReminder): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicationReminders'], 'readwrite')
      const store = transaction.objectStore('medicationReminders')
      const request = store.add(reminder)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getMedicationReminders(): Promise<MedicationReminder[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicationReminders'], 'readonly')
      const store = transaction.objectStore('medicationReminders')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as MedicationReminder[])
      request.onerror = () => reject(request.error)
    })
  }

  async updateMedicationReminder(id: number, reminder: MedicationReminder): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicationReminders'], 'readwrite')
      const store = transaction.objectStore('medicationReminders')
      const request = store.put({ ...reminder, id })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteMedicationReminder(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['medicationReminders'], 'readwrite')
      const store = transaction.objectStore('medicationReminders')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Health records methods
  async addHealthRecord(record: HealthRecord): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthRecords'], 'readwrite')
      const store = transaction.objectStore('healthRecords')
      const request = store.add(record)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getHealthRecords(type?: string): Promise<HealthRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthRecords'], 'readonly')
      const store = transaction.objectStore('healthRecords')
      
      if (type) {
        const index = store.index('type')
        const request = index.getAll(type)
        request.onsuccess = () => resolve(request.result as HealthRecord[])
        request.onerror = () => reject(request.error)
      } else {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result as HealthRecord[])
        request.onerror = () => reject(request.error)
      }
    })
  }

  async deleteHealthRecord(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(['healthRecords'], 'readwrite')
      const store = transaction.objectStore('healthRecords')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const dbHelper = new IndexedDBHelper()

import { dbHelper } from './indexedDB'

export async function syncToCloud(email: string) {
  if (!email || !navigator.onLine) return
  
  try {
    const data = await dbHelper.exportData()
    const parsedData = JSON.parse(data)
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/save-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        data: parsedData
      })
    })
    
    const result = await response.json()
    if (result.success) {
      console.log('✅ Health Vault synced to cloud')
    }
  } catch (error) {
    console.error('❌ Cloud sync failed:', error)
  }
}

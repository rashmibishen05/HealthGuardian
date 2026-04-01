import { useState, useEffect } from 'react'
import { dbHelper, type EmergencyContact } from '../utils/indexedDB'
import { getNearbyHospitals, type Hospital } from '../data/hospitals'
import { firstAidInstructions } from '../data/firstAid'

function SOSEmergency() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<(Hospital & { distance: number })[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [showFirstAid, setShowFirstAid] = useState(false)
  const [selectedFirstAid, setSelectedFirstAid] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sosActive, setSosActive] = useState(false)
  
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
  })

  useEffect(() => {
    dbHelper.init().then(() => {
      loadEmergencyContacts()
    })
  }, [])

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await dbHelper.getEmergencyContacts()
      setEmergencyContacts(contacts)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    }
  }

  const getLocation = () => {
    setLoading(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
          const nearby = getNearbyHospitals(latitude, longitude, 10) as (Hospital & { distance: number })[]
          setNearbyHospitals(nearby)
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
          setLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setLoading(false)
    }
  }

  const handleSOSClick = () => {
    setSosActive(true)
    getLocation()
    
    // Send emergency alerts
    emergencyContacts.forEach((contact) => {
      const message = `EMERGENCY ALERT! ${contact.name} needs help. Location: ${
        location ? `${location.lat}, ${location.lon}` : 'Location unavailable'
      }`
      
      // In a real app, this would call an SMS/Email API
      console.log(`Sending alert to ${contact.name} (${contact.phone}): ${message}`)
    })

    // Simulate alert sent
    setTimeout(() => {
      alert(
        `SOS Alert sent to ${emergencyContacts.length} contact(s)!\n\nLocation: ${
          location
            ? `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`
            : 'Getting location...'
        }`
      )
      setSosActive(false)
    }, 1000)
  }

  const addEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newContact.name || !newContact.phone) {
      alert('Name and phone are required')
      return
    }

    try {
      await dbHelper.addEmergencyContact(newContact)
      setNewContact({ name: '', phone: '', email: '', relationship: '' })
      setShowAddContact(false)
      loadEmergencyContacts()
    } catch (error) {
      console.error('Failed to add contact:', error)
      alert('Failed to add contact')
    }
  }

  const deleteContact = async (id: number | undefined) => {
    if (!id) return
    
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await dbHelper.deleteEmergencyContact(id)
        loadEmergencyContacts()
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Emergency SOS
        </h2>
        <button
          onClick={handleSOSClick}
          disabled={sosActive || emergencyContacts.length === 0}
          className={`w-full py-8 rounded-lg text-white font-bold text-2xl transition-all transform ${
            sosActive
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {sosActive ? 'SENDING SOS...' : 'SOS - SEND ALERT'}
        </button>
        {emergencyContacts.length === 0 && (
          <p className="text-center text-red-600 mt-4 text-sm">
            Please add emergency contacts first
          </p>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Emergency Contacts</h3>
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {showAddContact ? 'Cancel' : '+ Add Contact'}
          </button>
        </div>

        {showAddContact && (
          <form onSubmit={addEmergencyContact} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name *"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Save Contact
            </button>
          </form>
        )}

        <div className="space-y-3">
          {emergencyContacts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No emergency contacts added yet</p>
          ) : (
            emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  {contact.email && (
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  )}
                  {contact.relationship && (
                    <p className="text-xs text-gray-500">{contact.relationship}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Nearby Hospitals</h3>
          <button
            onClick={getLocation}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Find Nearby'}
          </button>
        </div>

        {location && (
          <p className="text-sm text-gray-600 mb-4">
            Your location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </p>
        )}

        <div className="space-y-3">
          {nearbyHospitals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Click "Find Nearby" to see hospitals near you
            </p>
          ) : (
            nearbyHospitals.map((hospital) => (
              <div key={hospital.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{hospital.name}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {hospital.distance.toFixed(1)} km
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{hospital.address}</p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Phone:</strong> {hospital.phone}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {hospital.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                {hospital.emergency247 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    24/7 Emergency
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* First Aid Instructions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">First Aid Guide</h3>
          <button
            onClick={() => setShowFirstAid(!showFirstAid)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {showFirstAid ? 'Hide' : 'Show'}
          </button>
        </div>

        {showFirstAid && (
          <div className="space-y-3">
            {firstAidInstructions.map((instruction) => (
              <div key={instruction.id} className="border rounded-lg">
                <button
                  onClick={() =>
                    setSelectedFirstAid(
                      selectedFirstAid === instruction.id ? null : instruction.id
                    )
                  }
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800">{instruction.title}</span>
                  <span className="text-gray-500">
                    {selectedFirstAid === instruction.id ? '−' : '+'}
                  </span>
                </button>

                {selectedFirstAid === instruction.id && (
                  <div className="p-4 pt-0 space-y-3">
                    {instruction.callEmergency && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-red-800 font-semibold">
                          CALL 911 IMMEDIATELY
                        </p>
                      </div>
                    )}

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Symptoms:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {instruction.symptoms.map((symptom, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Steps:</h5>
                      <ol className="list-decimal list-inside space-y-1">
                        {instruction.steps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-800 mb-2">Warnings:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {instruction.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-red-700">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SOSEmergency

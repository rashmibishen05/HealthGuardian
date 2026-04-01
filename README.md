# Offline Health Guardian

An offline-first Progressive Web App (PWA) health assistant built with React, TypeScript, Vite, and RunAnywhere SDK.

## Features

### 1. SOS Emergency System
- **Emergency SOS Button**: One-click emergency alert system
- **GPS Location Tracking**: Uses browser geolocation API to get current coordinates
- **Emergency Contacts**: Store and manage emergency contacts in IndexedDB
- **Nearby Hospitals**: Displays nearby hospitals based on your location with:
  - Distance calculation
  - Contact information
  - Available services
  - 24/7 emergency availability
- **First-Aid Instructions**: Comprehensive first-aid guide for:
  - Heart Attack
  - Choking
  - Severe Bleeding
  - Burns
  - Stroke
  - Seizure
  - Allergic Reactions
  - Fractures

### 2. Medicine Information
- **Medicine Search**: Search from a comprehensive database of common medicines
- **OCR Scanning**: Use camera to scan medicine names (powered by Tesseract.js)
- **Detailed Information**:
  - Uses and indications
  - Dosage instructions
  - Warnings and precautions
  - Side effects
- **Offline Storage**: Medicine searches cached in IndexedDB

### 3. AI Health Assistant
- **Offline AI Chatbot**: Health information assistant (powered by RunAnywhere SDK)
- **Voice Input**: Speak your questions using browser speech recognition
- **Health Knowledge Base**: Provides information on:
  - Common symptoms (fever, headache, cough, etc.)
  - First-aid guidance
  - General health advice
- **Chat History**: Conversations saved locally

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **AI SDK**: RunAnywhere Web SDK (LLM, STT, TTS, VAD)
- **OCR**: Tesseract.js
- **PWA**: vite-plugin-pwa + Workbox
- **Storage**: IndexedDB for offline data persistence

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Health_Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Running the App

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build
```bash
npm run build
npm run preview
```

## Browser Compatibility

- **Recommended**: Chrome/Edge 120+ for full functionality
- **Minimum**: Chrome/Edge 96+
- **Features requiring specific APIs**:
  - Geolocation API (for location tracking)
  - Camera API (for medicine scanning)
  - Web Speech API (for voice input)
  - IndexedDB (for offline storage)
  - Service Workers (for PWA functionality)

## Offline Functionality

The app works completely offline after the initial load:

1. **Service Worker**: Caches app assets for offline access
2. **IndexedDB**: Stores user data locally:
   - Emergency contacts
   - Medicine search history
   - Chat conversations
3. **Local Databases**: Pre-loaded data for:
   - Hospital locations
   - Medicine information
   - First-aid instructions
   - Health knowledge base

## Key Features Detail

### Cross-Origin Isolation
The app is configured with COOP/COEP headers for:
- Multi-threaded WebAssembly support
- SharedArrayBuffer access
- Optimal performance for AI inference

### RunAnywhere SDK Integration
- **LLM**: Offline text generation for health queries
- **STT**: Speech-to-text for voice input
- **TTS**: Text-to-speech for audio responses (optional)
- **VAD**: Voice activity detection

### Security & Privacy
- All data stays on device
- No external API calls required for core functionality
- Medical disclaimer prominently displayed
- User consent for camera and location access

## Important Disclaimer

**This is NOT a medical diagnosis tool.**

The information provided is for educational purposes only. Always consult a qualified healthcare professional for:
- Medical advice
- Diagnosis
- Treatment decisions
- Emergency medical situations

In case of emergency, always call your local emergency number (911 in the US).

## Project Structure

```
Health_Hub/
├── src/
│   ├── components/
│   │   ├── AIHealthAssistant.tsx    # AI chatbot component
│   │   ├── Disclaimer.tsx           # Medical disclaimer
│   │   ├── MedicineInfo.tsx         # Medicine search & OCR
│   │   └── SOSEmergency.tsx         # Emergency features
│   ├── data/
│   │   ├── firstAid.ts              # First-aid instructions
│   │   ├── hospitals.ts             # Hospital database
│   │   └── medicines.ts             # Medicine database
│   ├── utils/
│   │   └── indexedDB.ts             # IndexedDB helper
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
└── package.json                     # Dependencies
```

## Features in Detail

### SOS Emergency
- **Location Detection**: Automatic GPS coordinate retrieval
- **Hospital Finder**: Calculates distance to nearby hospitals using Haversine formula
- **Alert System**: Sends emergency information to saved contacts
- **Quick Access**: Accessible first-aid guide for common emergencies

### Medicine Scanner
- **Text Recognition**: OCR powered by Tesseract.js
- **Camera Integration**: Uses device camera to capture medicine packaging
- **Smart Search**: Matches extracted text against medicine database
- **Fallback**: Manual search if OCR fails

### AI Assistant
- **Context-Aware**: Understands health-related queries
- **Voice-Enabled**: Supports voice input via Web Speech API
- **Offline-First**: Uses local knowledge base with fallback to RunAnywhere LLM
- **Conversation Memory**: Maintains chat history locally

## Development Notes

### WASM Support
The app includes custom Vite plugin to copy WASM binaries:
- `racommons-llamacpp.wasm` - LLM inference
- `sherpa-onnx` - STT/TTS/VAD
- Automatic bundling in production builds

### PWA Configuration
- Service worker auto-updates
- Offline asset caching
- Custom manifest for app installation
- Works as standalone app on mobile devices

## Troubleshooting

### WASM Files Not Loading
- Ensure `optimizeDeps.exclude` includes RunAnywhere packages
- Check COOP/COEP headers are properly set
- Verify WASM files are in `dist/assets/` after build

### Camera Not Working
- Grant camera permissions in browser
- Use HTTPS or localhost (required for camera API)
- Check browser compatibility

### Voice Input Not Working
- Enable microphone permissions
- Only works in Chrome/Edge (Web Speech API)
- Requires user interaction to start

### Location Not Available
- Enable location services in browser and OS
- Grant location permission when prompted
- May not work in some browsers/environments

## Future Enhancements

- Actual RunAnywhere LLM integration with health-specific model
- Multi-language support
- More comprehensive medicine database
- Integration with health APIs (when online)
- Symptom checker with decision tree
- Medication reminders
- Health data tracking

## License

This project is for educational purposes. Please ensure compliance with medical information regulations in your jurisdiction.

## Credits

- Built with [RunAnywhere SDK](https://docs.runanywhere.ai/)
- OCR powered by [Tesseract.js](https://tesseract.projectnaptha.com/)
- UI built with [Tailwind CSS](https://tailwindcss.com/)
- PWA functionality via [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

---

**Remember: Always consult healthcare professionals for medical advice. This app is not a substitute for professional medical care.**

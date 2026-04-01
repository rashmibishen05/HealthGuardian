# Quick Start Guide - Offline Health Guardian

## Getting Started

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

### 2. Using the App

#### **SOS Emergency Tab**

**Add Emergency Contacts:**
1. Click "+ Add Contact" button
2. Fill in name, phone (required), email and relationship (optional)
3. Click "Save Contact"

**Send SOS Alert:**
1. Make sure you have at least one emergency contact
2. Click the red "SOS - SEND ALERT" button
3. Allow location access when prompted
4. Alert will be sent to all contacts with your GPS location

**Find Nearby Hospitals:**
1. Click "Find Nearby" button
2. Allow location access
3. See list of hospitals sorted by distance

**View First-Aid Instructions:**
1. Click "Show" button in First Aid Guide section
2. Click on any emergency type to expand
3. Follow step-by-step instructions

#### **Medicine Info Tab**

**Search Medicine:**
1. Type medicine name in search box
2. Select from results if multiple matches
3. View detailed information:
   - Uses
   - Dosage
   - Warnings
   - Side effects

**Scan Medicine (OCR):**
1. Click "Scan Medicine" button
2. Allow camera access when prompted
3. Point camera at medicine name/packaging
4. Click "Capture & Scan"
5. Wait for text recognition
6. App will automatically search for recognized medicine

#### **AI Assistant Tab**

**Text Chat:**
1. Type your health question in the input box
2. Press Enter or click "Send"
3. Read AI response
4. Continue conversation

**Voice Input:**
1. Click the microphone icon
2. Allow microphone access when prompted
3. Speak your question clearly
4. Text will appear in input box
5. Click Send or press Enter

**Sample Questions to Ask:**
- "What should I do for fever?"
- "How to treat a headache?"
- "First aid for burns"
- "Common cold remedies"
- "What to do for stomach ache?"

## Important Notes

### Permissions Required
- **Location**: For finding nearby hospitals and GPS in SOS alerts
- **Camera**: For scanning medicine names
- **Microphone**: For voice input in AI assistant

### Offline Usage
- After first load, the app works completely offline
- All data is stored locally on your device
- No internet connection needed for core features

### Medical Disclaimer
**Always remember**: This app is NOT a substitute for professional medical advice.
- For emergencies, call 911
- For medical advice, consult a doctor
- Do not self-medicate based on app information alone

## Troubleshooting

### Camera Not Working
- Check if camera permission is granted
- Try a different browser (Chrome/Edge recommended)
- Make sure you're using HTTPS or localhost

### Location Not Available
- Enable location services in your device settings
- Allow location permission in browser
- Try refreshing the page

### Voice Input Not Responding
- Grant microphone permission
- Speak clearly and close to microphone
- Currently works best in Chrome/Edge browsers

### App Not Working Offline
- Make sure you loaded the app at least once while online
- Check if Service Worker is registered (DevTools > Application)
- Clear cache and reload if issues persist

## Features at a Glance

| Feature | Description | Offline |
|---------|-------------|---------|
| SOS Button | Send emergency alerts with GPS location | ✓ |
| Emergency Contacts | Store contacts locally | ✓ |
| Nearby Hospitals | Find hospitals near you | Requires location |
| First-Aid Guide | Step-by-step emergency instructions | ✓ |
| Medicine Search | Search medicine database | ✓ |
| OCR Scanner | Scan medicine names with camera | Requires camera |
| AI Chatbot | Health information assistant | ✓ |
| Voice Input | Speak your questions | Requires microphone |

## Tips for Best Experience

1. **Add emergency contacts immediately** - Essential for SOS feature
2. **Enable all permissions** - For full functionality
3. **Use on mobile** - Install as PWA for app-like experience
4. **Bookmark/Install** - Quick access in emergencies
5. **Test offline** - Verify it works without internet before needing it

## Installing as App (PWA)

### On Mobile (Chrome/Edge):
1. Open the app in browser
2. Tap menu (⋮) > "Install app" or "Add to Home Screen"
3. Confirm installation
4. App icon will appear on home screen

### On Desktop (Chrome/Edge):
1. Open the app in browser
2. Click install icon in address bar (⊕)
3. Click "Install" in popup
4. App will open in its own window

## Safety Reminders

- Keep emergency contact list updated
- Review first-aid instructions regularly
- Don't rely solely on app for emergencies
- Always call 911 for life-threatening situations
- Verify medicine information with pharmacist
- The AI assistant provides general information only

## Next Steps

1. **Customize**: Add your actual emergency contacts
2. **Explore**: Try each feature to familiarize yourself
3. **Test**: Practice using it offline
4. **Share**: Recommend to family and friends
5. **Feedback**: Report any issues or suggestions

---

**Need Help?** Check the full README.md or DEPLOYMENT.md for more details.

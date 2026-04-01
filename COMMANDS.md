# Quick Commands Reference

## Development

### Start Development Server
```bash
npm run dev
```
**Opens at:** http://localhost:5173

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Testing

### Test Offline Mode
1. Start dev server: `npm run dev`
2. Open DevTools (F12)
3. Go to Application > Service Workers
4. Check "Offline"
5. Refresh page - should still work

### Test Individual Features
- **SOS Tab**: Add contact, click SOS, allow location
- **Medicine Tab**: Search "paracetamol" or click "Scan Medicine"
- **AI Tab**: Type "fever" or click microphone

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to Cloudflare Pages
Connect GitHub repo to Cloudflare Pages dashboard

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset Build
```bash
rm -rf dist
npm run build
```

## File Structure

```
Health_Hub/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── data/              # Local databases
│   ├── utils/             # Helper functions
│   └── App.tsx            # Main app
├── public/                # Static assets
├── dist/                  # Build output (created by npm run build)
├── README.md              # Main documentation
├── QUICKSTART.md          # User guide
├── DEPLOYMENT.md          # Deployment instructions
├── TESTING.md             # Testing checklist
└── PROJECT_SUMMARY.md     # This document

## Important URLs

- **Local Dev**: http://localhost:5173
- **RunAnywhere Docs**: https://docs.runanywhere.ai/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind Docs**: https://tailwindcss.com/

## Common Issues

### Camera Not Working
- Use HTTPS or localhost
- Grant camera permission
- Try Chrome/Edge browser

### Location Not Working
- Enable location services
- Grant location permission
- Refresh page

### Voice Input Not Working
- Grant microphone permission
- Use Chrome/Edge browser
- Click microphone, then speak

### App Not Working Offline
- Load app at least once online
- Check Service Worker registered
- Check DevTools > Application > Service Workers

## Environment

- **Node Version**: 18+
- **Package Manager**: npm
- **Browser (Dev)**: Chrome/Edge/Firefox
- **Browser (Prod)**: Chrome/Edge recommended

## Scripts Explained

- `npm run dev` - Starts Vite dev server with HMR
- `npm run build` - TypeScript compile + Vite production build
- `npm run preview` - Preview production build locally

## Key Dependencies

- `react` - UI framework
- `@runanywhere/web` - AI SDK core
- `@runanywhere/web-llamacpp` - LLM backend
- `@runanywhere/web-onnx` - STT/TTS backend
- `tesseract.js` - OCR for medicine scanning
- `vite-plugin-pwa` - PWA functionality
- `tailwindcss` - Styling

## Medical Disclaimer

**IMPORTANT:** This app is for educational purposes only.
- NOT a substitute for professional medical advice
- Always consult healthcare professionals
- Call 911 for emergencies
- Do not self-diagnose or self-medicate

---

**Need help?** Check the documentation files:
- For users: QUICKSTART.md
- For deployment: DEPLOYMENT.md
- For testing: TESTING.md
- For overview: README.md

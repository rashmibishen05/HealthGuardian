# Deployment Guide - Offline Health Guardian

## Prerequisites

Before deploying, ensure:
- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Local Build & Test

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Test production build locally**
   ```bash
   npm run preview
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Required Headers**
   
   The `vercel.json` file should be created in the root:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
           { "key": "Cross-Origin-Embedder-Policy", "value": "credentialless" }
         ]
       },
       {
         "source": "/assets/(.*).wasm",
         "headers": [
           { "key": "Content-Type", "value": "application/wasm" },
           { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
         ]
       }
     ]
   }
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

3. **Add Required Headers**
   
   Create `netlify.toml` in root:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       Cross-Origin-Opener-Policy = "same-origin"
       Cross-Origin-Embedder-Policy = "credentialless"

   [[headers]]
     for = "/assets/*.wasm"
     [headers.values]
       Content-Type = "application/wasm"
       Cache-Control = "public, max-age=31536000, immutable"
   ```

### Option 3: Cloudflare Pages

1. **Connect GitHub repository** to Cloudflare Pages

2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`

3. **Add Required Headers**
   
   Create `_headers` file in `public/`:
   ```
   /*
     Cross-Origin-Opener-Policy: same-origin
     Cross-Origin-Embedder-Policy: credentialless

   /assets/*.wasm
     Content-Type: application/wasm
     Cache-Control: public, max-age=31536000, immutable
   ```

### Option 4: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -g gh-pages
   ```

2. **Update vite.config.ts** to add base path:
   ```typescript
   export default defineConfig({
     base: '/Health_Hub/', // Your repo name
     // ... rest of config
   })
   ```

3. **Deploy**
   ```bash
   npm run build
   gh-pages -d dist
   ```

   **Note**: GitHub Pages doesn't support custom headers, so SharedArrayBuffer won't work. The app will fall back to single-threaded mode.

### Option 5: Self-Hosted (Nginx)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Copy `dist` folder** to your server

3. **Configure Nginx**:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       root /path/to/dist;
       index index.html;

       # CORS Headers for SharedArrayBuffer
       add_header Cross-Origin-Opener-Policy "same-origin" always;
       add_header Cross-Origin-Embedder-Policy "credentialless" always;

       # WASM MIME type
       types {
           application/wasm wasm;
       }

       # Cache WASM files
       location ~* \.wasm$ {
           add_header Cross-Origin-Opener-Policy "same-origin" always;
           add_header Cross-Origin-Embedder-Policy "credentialless" always;
           add_header Cache-Control "public, max-age=31536000, immutable";
       }

       # SPA fallback
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Important Deployment Considerations

### 1. HTTPS Required
- Camera API requires HTTPS
- Geolocation API requires HTTPS
- Service Workers require HTTPS (except localhost)

### 2. Cross-Origin Isolation Headers
- **Required for multi-threaded WASM**:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: credentialless`
- Without these, the app runs in single-threaded fallback mode

### 3. WASM MIME Type
- Ensure `.wasm` files are served with `Content-Type: application/wasm`
- Add aggressive caching for WASM files

### 4. SPA Routing
- Configure catch-all route to serve `index.html`
- Ensure static assets are served before catch-all

### 5. File Size Considerations
- RunAnywhere SDK WASM files are ~15-20MB total
- Consider lazy loading for better initial load time
- Use CDN for optimal performance

## Environment-Specific Configuration

### Development
```bash
npm run dev
```
- Hot module replacement
- No WASM caching
- Detailed error messages

### Production
```bash
npm run build
npm run preview
```
- Minified bundles
- WASM files copied to assets
- Service worker active
- Optimized for performance

## Post-Deployment Checklist

- [ ] App loads over HTTPS
- [ ] PWA installable (shows install prompt)
- [ ] Service worker registers successfully
- [ ] Camera access works (for medicine scanning)
- [ ] Geolocation works (for hospital finder)
- [ ] Voice input works (for AI assistant)
- [ ] App works offline after first load
- [ ] Medical disclaimer visible on all tabs
- [ ] Emergency contacts can be saved
- [ ] Medicine search returns results
- [ ] First-aid guide is accessible

## Testing Offline Mode

1. Load the app in browser
2. Open DevTools > Application > Service Workers
3. Check "Offline" checkbox
4. Refresh the page
5. App should still work

## Performance Optimization

1. **Enable Compression**
   - Gzip or Brotli compression on server
   - Reduces WASM file transfer size

2. **Use CDN**
   - Serve static assets from CDN
   - Faster global access

3. **Lazy Load WASM**
   - Load AI models only when needed
   - Improves initial load time

4. **Optimize Images**
   - Compress PWA icons
   - Use WebP format where possible

## Troubleshooting Deployment

### Issue: WASM files return 404
- Check `copyWasmPlugin` in `vite.config.ts`
- Verify files in `dist/assets/` after build
- Ensure catch-all route doesn't intercept `.wasm` requests

### Issue: SharedArrayBuffer not available
- Verify COOP/COEP headers are set correctly
- Check in DevTools > Console for security warnings
- Test with `window.crossOriginIsolated` (should be `true`)

### Issue: App doesn't work offline
- Check Service Worker registration in DevTools
- Verify all assets are cached
- Test cache-first strategy for WASM files

### Issue: Camera/Location not working
- Ensure HTTPS is enabled
- Check browser permissions
- Test on different browsers

## Monitoring & Analytics

Consider adding:
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Web Vitals)
- Usage analytics (privacy-respecting)

## Security Considerations

- All data stored locally (privacy-first)
- No external API calls for core features
- Camera/location require explicit user consent
- Medical disclaimer prominently displayed
- Regular security audits recommended

## Maintenance

- Update dependencies regularly
- Monitor browser compatibility
- Test on new browser versions
- Update medical information database
- Review and update first-aid instructions

---

**Questions or Issues?**
Check the main README.md or open an issue on GitHub.

const CACHE_NAME = 'workout-tracker-v1';
   const urlsToCache = [
     './',
     './index.html',
     './manifest.json'
   ];

   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then(cache => cache.addAll(urlsToCache))
     );
   });

   self.addEventListener('fetch', event => {
     event.respondWith(
       caches.match(event.request)
         .then(response => response || fetch(event.request))
     );
   });
```
   - Click **"Commit changes"**

### Step 4: Create App Icons (Simple Approach)
For now, we'll create placeholder icons:

1. Go to https://www.favicon-generator.org/
2. Upload any image (or create a simple colored square in Paint/Preview)
3. Download the generated icons
4. Upload `favicon-192.png` and rename it to `icon-192.png`
5. Upload `favicon-512.png` and rename it to `icon-512.png`

**OR** skip icons for now - the app will work without them, just won't have a custom icon.

### Step 5: Enable GitHub Pages
1. In your repository, click **"Settings"** (top navigation)
2. Scroll down to **"Pages"** (left sidebar)
3. Under "Source", select **"main"** branch
4. Click **"Save"**
5. Wait 1-2 minutes

### Step 6: Access Your App
Your app will be live at:
```
https://ShadowMage22.github.io/workout-tracker/

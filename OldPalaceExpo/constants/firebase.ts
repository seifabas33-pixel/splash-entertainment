import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// ─── Firebase Setup Instructions ─────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com → Add project → "SplashEntertainment"
// 2. Left panel → Build → Realtime Database → Create database → Start in test mode
// 3. ⚙️ Project settings → Your apps → </> Web → Register app → copy firebaseConfig
// 4. Paste each value below replacing the REPLACE_WITH_YOUR_... placeholders
// 5. (Android) Get a Google Maps API key and paste it in app.json → android.config.googleMaps.apiKey

const firebaseConfig = {
  apiKey:            'AIzaSyDn5M_ljK0w3OBsv7WOZ4cd8oasayNqf8U',
  authDomain:        'splash-91063.firebaseapp.com',
  databaseURL:       'https://splash-91063-default-rtdb.firebaseio.com',
  projectId:         'splash-91063',
  storageBucket:     'splash-91063.firebasestorage.app',
  messagingSenderId: '264830974631',
  appId:             '1:264830974631:web:b9f82449d737322361b982',
};

// Guard against duplicate initialisation (React Native fast refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db   = getDatabase(app);
export const auth = getAuth(app);

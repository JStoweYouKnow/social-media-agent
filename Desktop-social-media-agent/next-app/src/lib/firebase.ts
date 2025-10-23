// Initialize Firebase from an environment variable.
// NEXT_PUBLIC_FIREBASE_CONFIG should be a JSON string like:
// '{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp = null;
let auth = null;
let firestore = null;

try {
  const cfg = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : null;
  if (cfg && Object.keys(cfg).length > 0) {
    if (!getApps().length) {
      firebaseApp = initializeApp(cfg);
    }
    auth = getAuth();
    firestore = getFirestore();
  }
} catch (e) {
  // swallow parse/init errors — app should still run without Firebase
  // but log to console for debugging.
  // eslint-disable-next-line no-console
  console.error('Failed to initialize Firebase from NEXT_PUBLIC_FIREBASE_CONFIG', e);
}

export { firebaseApp as default, auth, firestore };

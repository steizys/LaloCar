// src/firebase.js (para Javascript puro)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAq8RThCrfuzWr_q8n4n-tV3ixfdsMGGDU",
  authDomain: "lalocar-7a78a.firebaseapp.com",
  projectId: "lalocar-7a78a",
  storageBucket: "lalocar-7a78a.firebasestorage.app",
  messagingSenderId: "69927942766",
  appId: "1:69927942766:web:2cc2069158636d5999c47f",
  measurementId: "G-ZESYJYH9VE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, storage, googleProvider };



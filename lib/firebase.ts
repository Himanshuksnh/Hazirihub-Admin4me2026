import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnwmslgQ2oIf2gVV1NDDbm5ILLsYYvCl4",
  authDomain: "hazirihub.firebaseapp.com",
  projectId: "hazirihub",
  storageBucket: "hazirihub.firebasestorage.app",
  messagingSenderId: "644386389721",
  appId: "1:644386389721:web:ba6d5669c0e81d6142c8c8",
  measurementId: "G-4H1J8X9J83"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

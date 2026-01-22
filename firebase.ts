import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper function to safely get environment variables
const getEnv = (key: string, fallback: string): string => {
  try {
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    console.warn(`Error reading env var ${key}:`, e);
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_API_KEY", "AIzaSyA2QmYQyH9mAcJGiewgudZiXB1LmDs7Ues"),
  authDomain: getEnv("VITE_AUTH_DOMAIN", "couching-app-f8eb6.firebaseapp.com"),
  projectId: getEnv("VITE_PROJECT_ID", "couching-app-f8eb6"),
  storageBucket: "couching-app-f8eb6.firebasestorage.app",
  messagingSenderId: "331701779099",
  appId: "1:331701779099:web:75ebf50d76847032ec643e",
  measurementId: "G-DBK61QRR3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Changed to process.env to fix 'Property env does not exist on type ImportMeta' errors
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY || "AIzaSyDmE4yvLQFxKnjofSTr29RuStzRkYU_i54",
  authDomain: process.env.VITE_AUTH_DOMAIN || "couching-app-f8eb6.firebaseapp.com",
  projectId: process.env.VITE_PROJECT_ID || "couching-app-f8eb6",
  storageBucket: process.env.VITE_STORAGE_BUCKET || "couching-app-f8eb6.firebasestorage.app",
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID || "331701779099",
  appId: process.env.VITE_APP_ID || "1:331701779099:web:75ebf50d76847032ec643e",
  measurementId: process.env.VITE_MEASUREMENT_ID || "G-DBK61QRR3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configuración recomendada para Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

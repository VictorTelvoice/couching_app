import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2QmYQyH9mAcJGiewgudZiXB1LmDs7Ues",
  authDomain: "couching-app-f8eb6.firebaseapp.com",
  projectId: "couching-app-f8eb6",
  storageBucket: "couching-app-f8eb6.firebasestorage.app",
  messagingSenderId: "331701779099",
  appId: "1:331701779099:web:75ebf50d76847032ec643e",
  measurementId: "G-DBK61QRR3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
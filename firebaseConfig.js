import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Added Auth import

const firebaseConfig = {
  apiKey: "AIzaSyDHbQw3XVF5XTwkF3Gd3Ven5s38d2Vt3IA",
  authDomain: "pulse-app-b244f.firebaseapp.com",
  projectId: "pulse-app-b244f",
  storageBucket: "pulse-app-b244f.firebasestorage.app",
  messagingSenderId: "1058030567269",
  appId: "1:1058030567269:web:76df84bf3a3d84e543eb8c",
  measurementId: "G-NHDTHYY21Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

export { db, auth }; // Export db and auth instances


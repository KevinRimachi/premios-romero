// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyA7e7owToOWTyyu-Rv9G3fNhsVEPW6eMgc",
//   authDomain: "ultimate-task-407605.firebaseapp.com",
//   projectId: "ultimate-task-407605",
//   storageBucket: "ultimate-task-407605.firebasestorage.app",
//   messagingSenderId: "1071650049201",
//   appId: "1:1071650049201:web:9ae5d44baba8ee612e2690"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// -----------------------------------------------------

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita errores de inicialización duplicada durante el desarrollo local con Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
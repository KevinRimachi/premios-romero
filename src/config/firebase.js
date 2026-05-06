import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7e7owToOWTyyu-Rv9G3fNhsVEPW6eMgc",
  authDomain: "ultimate-task-407605.firebaseapp.com",
  projectId: "ultimate-task-407605",
  storageBucket: "ultimate-task-407605.firebasestorage.app",
  messagingSenderId: "1071650049201",
  appId: "1:1071650049201:web:9ae5d44baba8ee612e2690"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

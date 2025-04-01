// src/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Substitua estes valores pelos valores do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7rLD2BbkgExlwd6hhABPqvl39SfcrtFo",
  authDomain: "metalive-8b9e7.firebaseapp.com",
  projectId: "metalive-8b9e7",
  storageBucket: "metalive-8b9e7.appspot.com",
  messagingSenderId: "1052735217691",
  appId: "1:1052735217691:web:53d5aaccbb01b2bad1d8be",
  measurementId: "G-1GJLL3P14D"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

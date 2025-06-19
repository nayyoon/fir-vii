// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ Replace these with your own Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDtT6cuPMwQCqk4AIs8Fiv1N1cv4FG-5oo",
  authDomain: "fir-vii.firebaseapp.com",
  projectId: "fir-vii",
  storageBucket: "fir-vii.firebasestorage.app",
  messagingSenderId: "721685340182",
  appId: "1:721685340182:web:e64ca17dc837915c47d537",
  measurementId: "G-T6M9FK2S8P",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

export { auth, db, googleProvider, appleProvider };

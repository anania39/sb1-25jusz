import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNLtHR9NAxyqyCZbaGWfIfq3iUrZlWzoU",
  authDomain: "extension-5c90b.firebaseapp.com",
  projectId: "extension-5c90b",
  storageBucket: "extension-5c90b.firebasestorage.app",
  messagingSenderId: "96269215505",
  appId: "1:96269215505:web:19d159223d959b723a0eb0",
  measurementId: "G-NH9MDSHR6W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set persistence to LOCAL to keep the user signed in
setPersistence(auth, browserLocalPersistence);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore
export const db = getFirestore(app);
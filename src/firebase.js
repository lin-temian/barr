import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8u0Cuy57I31Yi3i7gnBpfK7U3PvNQizE",
  authDomain: "barr-8f75d.firebaseapp.com",
  projectId: "barr-8f75d",
  storageBucket: "barr-8f75d.firebasestorage.app",
  messagingSenderId: "212851006412",
  appId: "1:212851006412:web:a2ff696ff7145fd39ddb69",
  measurementId: "G-VQM631Q426"
}

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}

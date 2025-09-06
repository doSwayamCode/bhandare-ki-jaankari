import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyApFM5mZWpp3sG4zAKC4Kcu-YDlC6B0PEs",
  authDomain: "bhandare-ki-jankari.firebaseapp.com",
  projectId: "bhandare-ki-jankari",
  storageBucket: "bhandare-ki-jankari.firebasestorage.app",
  messagingSenderId: "414768655761",
  appId: "1:414768655761:web:e4e41d19fcb20066f57e30",
  measurementId: "G-44P8P6JT6X"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Analytics only if supported (for browser environments)
let analytics: any = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export { analytics }

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApFM5mZWpp3sG4zAKC4Kcu-YDlC6B0PEs",
  authDomain: "bhandare-ki-jankari.firebaseapp.com",
  projectId: "bhandare-ki-jankari",
  storageBucket: "bhandare-ki-jankari.firebasestorage.app",
  messagingSenderId: "414768655761",
  appId: "1:414768655761:web:e4e41d19fcb20066f57e30",
  measurementId: "G-44P8P6JT6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

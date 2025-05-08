// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore"; // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlzbBiRn7R5D4UnEHDcdhoXb9HmPDf0cc", // Consider environment variables for this in production
  authDomain: "gamemain-828d5.firebaseapp.com",
  projectId: "gamemain-828d5",
  storageBucket: "gamemain-828d5.appspot.com", // Corrected from firebasestorage.app
  messagingSenderId: "642715710374",
  appId: "1:642715710374:web:a319bb3bb73f640bf5d567",
  measurementId: "G-MS7F53BGLH"
};

// Initialize Firebase
let app: FirebaseApp;
let firestore: Firestore;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') { // Ensure this only runs on the client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]; // Use the existing app if already initialized
  }
  firestore = getFirestore(app);

  // Check if measurementId is present before initializing analytics
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} else {
  // Handle server-side initialization if needed, or ensure firestore is defined for server components
  // For now, we are focusing on client-side Firestore usage.
  // A proper server-side setup would use the Firebase Admin SDK.
  // To avoid errors if 'firestore' is used in server components without this client-side check,
  // we can initialize a default app instance here, though direct client SDK usage on server is not typical.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  firestore = getFirestore(app);
}


export { app, firestore, analytics };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { config } from "dotenv";

config();  // Loads environment variables from .env file

// Your Firebase configuration object (you can find it in Firebase console)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore instance
const auth = getAuth(app);     // Authentication instance

// Firebase connection test
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Firebase connected and authenticated user: ", user.email);
    } else {
        console.log("No user is authenticated");
    }
});

export { db, auth };

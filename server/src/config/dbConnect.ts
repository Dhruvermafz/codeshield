import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { config } from "dotenv";

config();  // Load environment variables from .env file

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAqSzk3jZTE35RzDg7haSFmbL2R1E2pArA",
    authDomain: "itsablog.firebaseapp.com",
    projectId: "itsablog",
    storageBucket: "itsablog.appspot.com",
    messagingSenderId: "484951461735",
    appId: "1:484951461735:web:e3814930162375936929c2",
    measurementId: "G-1JY3BNSHMG"
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

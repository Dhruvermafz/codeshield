"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Loads environment variables from .env file
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
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app); // Firestore instance
exports.db = db;
const auth = (0, auth_1.getAuth)(app); // Authentication instance
exports.auth = auth;
// Firebase connection test
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Firebase connected and authenticated user: ", user.email);
    }
    else {
        console.log("No user is authenticated");
    }
});
//# sourceMappingURL=dbConnect.js.map
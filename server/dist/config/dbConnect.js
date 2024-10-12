"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load environment variables from .env file
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
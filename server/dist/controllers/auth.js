"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.resetPassword = exports.login = exports.register = void 0;
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const dbConnect_1 = require("../config/dbConnect"); // Initialize Firestore here
const auth_2 = require("../utils/auth"); // Validation utility
const auth_3 = require("firebase/auth");
const auth_4 = require("firebase/auth");
const auth_5 = require("firebase/auth");
const auth = (0, auth_1.getAuth)();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        if (!(0, auth_2.isValidEmail)(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        // Create user in Firebase Auth
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
        const user = userCredential.user;
        // Store additional user info in Firestore
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(dbConnect_1.db, "users", user.uid), {
            name,
            email,
            created_at: new Date(),
            updated_at: new Date(),
        });
        return res.status(201).json({ message: "User registered successfully", uid: user.uid });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        if (!(0, auth_2.isValidEmail)(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        const userCredential = yield (0, auth_4.signInWithEmailAndPassword)(auth, email, password);
        const user = userCredential.user;
        // Generate JWT token using Firebase (if needed for custom logic)
        const token = yield user.getIdToken();
        return res.status(200).json({ token, message: "User logged-in successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!(0, auth_2.isValidEmail)(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        yield (0, auth_5.sendPasswordResetEmail)(auth, email);
        return res.status(200).json({ message: "Reset password link sent" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const user = auth.currentUser; // Get currently authenticated user
    try {
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (user) {
            yield (0, auth_3.updatePassword)(user, password);
            return res.status(200).json({ message: "Password reset successful" });
        }
        else {
            return res.status(401).json({ message: "User is not authenticated" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.js.map
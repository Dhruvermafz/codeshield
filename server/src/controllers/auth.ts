import { Request, Response } from "express";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "../config/dbConnect";  // Initialize Firestore here
import { isValidEmail } from "../utils/auth";  // Validation utility
import { updatePassword } from "firebase/auth";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";

interface AuthenticatedRequest extends Request {
  _id?: string;
}
const auth = getAuth();

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully", uid: user.uid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate JWT token using Firebase (if needed for custom logic)
    const token = await user.getIdToken();

    return res.status(200).json({ token, message: "User logged-in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    await sendPasswordResetEmail(auth, email);

    return res.status(200).json({ message: "Reset password link sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
  const { password } = req.body;
  const user = auth.currentUser; // Get currently authenticated user

  try {
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (user) {
      await updatePassword(user, password);
      return res.status(200).json({ message: "Password reset successful" });
    } else {
      return res.status(401).json({ message: "User is not authenticated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {register, login, resetPassword, forgotPassword}
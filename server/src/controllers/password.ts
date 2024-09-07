import { Request, Response } from "express";
import { getFirestore, collection, query, where, getDocs, limit, orderBy, startAfter } from "firebase/firestore";
import { db } from "../config/dbConnect";  // Firestore instance
import { doc, setDoc } from "firebase/firestore";
import { encrypt } from "../utils/encryption";
import {  updateDoc } from "firebase/firestore";
import {  deleteDoc } from "firebase/firestore";

interface AuthenticatedRequest extends Request {
  _id?: string;
}

const getAllPasswords = async (req: AuthenticatedRequest, res: Response) => {
  const { search, limit: limitQuery, offset } = req.query;
  const userId = req._id;

  try {
    const passwordsRef = collection(db, "passwords");
    let q = query(passwordsRef, where("user_id", "==", userId), orderBy("created_at"));

    if (search) {
      q = query(q, where("website_name", ">=", search), where("website_name", "<=", search + '\uf8ff'));
    }

    if (limitQuery) {
      q = query(q, limit(parseInt(limitQuery as string)));
    }

    if (offset) {
      q = query(q, startAfter(offset));
    }

    const querySnapshot = await getDocs(q);
    const passwords = querySnapshot.docs.map(doc => doc.data());

    return res.status(200).json({ data: passwords, message: "All saved passwords details" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const createPassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req._id;
  const { title, description, websiteName, password } = req.body;

  if (!websiteName || !password) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Encrypt the password
    const { encryptedData, base64data } = encrypt(password);

    const newPasswordDoc = doc(collection(db, "passwords"));
    await setDoc(newPasswordDoc, {
      user_id: userId,
      title,
      description,
      website_name: websiteName,
      password: encryptedData,
      iv: base64data,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Password data saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req._id;
  const passwordId = req.params.id;
  const { title, description, websiteName, password } = req.body;

  try {
    const passwordRef = doc(db, "passwords", passwordId);
    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (websiteName) updateData.website_name = websiteName;
    if (password) {
      const { encryptedData, base64data } = encrypt(password);
      updateData.password = encryptedData;
      updateData.iv = base64data;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date();
      await updateDoc(passwordRef, updateData);
      return res.status(200).json({ message: "Data updated successfully" });
    } else {
      return res.status(200).json({ message: "No fields to update" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const deletePassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req._id;
  const passwordId = req.params.id;

  try {
    const passwordRef = doc(db, "passwords", passwordId);
    await deleteDoc(passwordRef);
    return res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {getAllPasswords, createPassword, deletePassword, updatePassword}
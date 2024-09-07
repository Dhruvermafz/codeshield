import { Request, Response } from "express";
import { db } from "../config/dbConnect";  // Firestore instance
import { v4 as uuidv4 } from "uuid";  // For generating UUIDs
import { collection, doc, setDoc, addDoc } from "firebase/firestore";  // Firestore methods

const createDocuments = async (req: Request, res: Response) => {
  try {
    const userId = uuidv4(); // Generate a new UUID for the user

    // Example user data
    const userData = {
      _id: userId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Add user data to the 'users' collection
    await setDoc(doc(db, "users", userId), userData);

    // Example password data
    const passwordData = {
      _id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      website_name: req.body.website_name,
      password: req.body.password,
      iv: req.body.iv,  // Assuming iv is for encryption
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId,  // Reference to the user
    };

    // Add password data to the 'passwords' collection
    await addDoc(collection(db, "passwords"), passwordData);

    res.status(200).json("Documents created successfully!");
  } catch (error) {
    console.error("Error creating documents:", error);
    res.status(500).json("Internal server error");
  }
};

export default createDocuments;

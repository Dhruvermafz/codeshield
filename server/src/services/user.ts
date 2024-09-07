import { db } from "../config/dbConnect";  // Your Firebase initialization file
import { collection, query, where, getDocs } from "firebase/firestore";

interface UserDetails {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
    created_at?: any;  // Use Firestore Timestamp or Date
    updated_at?: any;  // Use Firestore Timestamp or Date
}

const getDetails = async (queryKey: string, queryValue: string): Promise<UserDetails | null> => {
    // Validate or whitelist queryKey if needed
    const validKeys = ['_id', 'email'];  // Add valid column names here
    if (!validKeys.includes(queryKey)) {
        console.error("Invalid query key");
        return null;
    }

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where(queryKey, "==", queryValue));
        const querySnapshot = await getDocs(q);

        // Return the first matching document or null if no documents found
        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            return {
                _id: docData._id,
                name: docData.name,
                email: docData.email,
                password: docData.password,
                created_at: docData.created_at,
                updated_at: docData.updated_at,
            } as UserDetails;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};

export { getDetails };

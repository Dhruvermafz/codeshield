import { db } from "../config/dbConnect";  // Your Firebase initialization file
import { collection, query, where, getDocs} from "firebase/firestore";

interface PasswordDetails {
    _id: string;
    title?: string;
    description?: string;
    website_name: string;
    password: string;
    iv: string;
    created_at: any;  // Use Firestore Timestamp or Date
    updated_at: any;  // Use Firestore Timestamp or Date
    user_id: string;
}

const getPasswordDetails = async (queryKey: string, queryValue: string): Promise<PasswordDetails | null> => {
    // Validate or whitelist queryKey if needed
    const validKeys = ['_id', 'title', 'website_name'];  // Add valid column names here
    if (!validKeys.includes(queryKey)) {
        console.error("Invalid query key");
        return null;
    }

    try {
        const passwordsRef = collection(db, "passwords");
        const querySnapshot = await getDocs(query(passwordsRef, where(queryKey, "==", queryValue)));

        // Return the first matching document or null if no documents found
        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            return {
                _id: docData._id,
                title: docData.title,
                description: docData.description,
                website_name: docData.website_name,
                password: docData.password,
                iv: docData.iv,
                created_at: docData.created_at,
                updated_at: docData.updated_at,
                user_id: docData.user_id,
            } as PasswordDetails;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching password details:", error);
        return null;
    }
};

export { getPasswordDetails };

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
exports.getPasswordDetails = void 0;
const dbConnect_1 = require("../config/dbConnect"); // Your Firebase initialization file
const firestore_1 = require("firebase/firestore");
const getPasswordDetails = (queryKey, queryValue) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate or whitelist queryKey if needed
    const validKeys = ['_id', 'title', 'website_name']; // Add valid column names here
    if (!validKeys.includes(queryKey)) {
        console.error("Invalid query key");
        return null;
    }
    try {
        const passwordsRef = (0, firestore_1.collection)(dbConnect_1.db, "passwords");
        const querySnapshot = yield (0, firestore_1.getDocs)((0, firestore_1.query)(passwordsRef, (0, firestore_1.where)(queryKey, "==", queryValue)));
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
            };
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching password details:", error);
        return null;
    }
});
exports.getPasswordDetails = getPasswordDetails;
//# sourceMappingURL=passwords.js.map
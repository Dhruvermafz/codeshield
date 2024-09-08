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
const dbConnect_1 = require("../config/dbConnect"); // Firestore instance
const uuid_1 = require("uuid"); // For generating UUIDs
const firestore_1 = require("firebase/firestore"); // Firestore methods
const createDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, uuid_1.v4)(); // Generate a new UUID for the user
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
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(dbConnect_1.db, "users", userId), userData);
        // Example password data
        const passwordData = {
            _id: (0, uuid_1.v4)(),
            title: req.body.title,
            description: req.body.description,
            website_name: req.body.website_name,
            password: req.body.password,
            iv: req.body.iv, // Assuming iv is for encryption
            created_at: new Date(),
            updated_at: new Date(),
            user_id: userId, // Reference to the user
        };
        // Add password data to the 'passwords' collection
        yield (0, firestore_1.addDoc)((0, firestore_1.collection)(dbConnect_1.db, "passwords"), passwordData);
        res.status(200).json("Documents created successfully!");
    }
    catch (error) {
        console.error("Error creating documents:", error);
        res.status(500).json("Internal server error");
    }
});
exports.default = createDocuments;
//# sourceMappingURL=schemas.js.map
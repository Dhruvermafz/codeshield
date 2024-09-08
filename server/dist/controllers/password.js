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
exports.updatePassword = exports.deletePassword = exports.createPassword = exports.getAllPasswords = void 0;
const firestore_1 = require("firebase/firestore");
const dbConnect_1 = require("../config/dbConnect"); // Firestore instance
const firestore_2 = require("firebase/firestore");
const encryption_1 = require("../utils/encryption");
const firestore_3 = require("firebase/firestore");
const firestore_4 = require("firebase/firestore");
const getAllPasswords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, limit: limitQuery, offset } = req.query;
    const userId = req._id;
    try {
        const passwordsRef = (0, firestore_1.collection)(dbConnect_1.db, "passwords");
        let q = (0, firestore_1.query)(passwordsRef, (0, firestore_1.where)("user_id", "==", userId), (0, firestore_1.orderBy)("created_at"));
        if (search) {
            q = (0, firestore_1.query)(q, (0, firestore_1.where)("website_name", ">=", search), (0, firestore_1.where)("website_name", "<=", search + '\uf8ff'));
        }
        if (limitQuery) {
            q = (0, firestore_1.query)(q, (0, firestore_1.limit)(parseInt(limitQuery)));
        }
        if (offset) {
            q = (0, firestore_1.query)(q, (0, firestore_1.startAfter)(offset));
        }
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const passwords = querySnapshot.docs.map(doc => doc.data());
        return res.status(200).json({ data: passwords, message: "All saved passwords details" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllPasswords = getAllPasswords;
const createPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req._id;
    const { title, description, websiteName, password } = req.body;
    if (!websiteName || !password) {
        return res.status(400).json({ message: "Required fields missing" });
    }
    try {
        // Encrypt the password
        const { encryptedData, base64data } = (0, encryption_1.encrypt)(password);
        const newPasswordDoc = (0, firestore_2.doc)((0, firestore_1.collection)(dbConnect_1.db, "passwords"));
        yield (0, firestore_2.setDoc)(newPasswordDoc, {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createPassword = createPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req._id;
    const passwordId = req.params.id;
    const { title, description, websiteName, password } = req.body;
    try {
        const passwordRef = (0, firestore_2.doc)(dbConnect_1.db, "passwords", passwordId);
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (websiteName)
            updateData.website_name = websiteName;
        if (password) {
            const { encryptedData, base64data } = (0, encryption_1.encrypt)(password);
            updateData.password = encryptedData;
            updateData.iv = base64data;
        }
        if (Object.keys(updateData).length > 0) {
            updateData.updated_at = new Date();
            yield (0, firestore_3.updateDoc)(passwordRef, updateData);
            return res.status(200).json({ message: "Data updated successfully" });
        }
        else {
            return res.status(200).json({ message: "No fields to update" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updatePassword = updatePassword;
const deletePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req._id;
    const passwordId = req.params.id;
    try {
        const passwordRef = (0, firestore_2.doc)(dbConnect_1.db, "passwords", passwordId);
        yield (0, firestore_4.deleteDoc)(passwordRef);
        return res.status(200).json({ message: "Password deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deletePassword = deletePassword;
//# sourceMappingURL=password.js.map
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
exports.getUserDetails = void 0;
const user_1 = require("../services/user");
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req._id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const data = yield (0, user_1.getDetails)("_id", req._id);
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ data: data, message: "User details retrieved successfully" });
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserDetails = getUserDetails;
//# sourceMappingURL=user.js.map
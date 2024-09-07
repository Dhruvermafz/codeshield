import { Request, Response } from "express";
import { getDetails } from "../services/user";

interface AuthenticatedRequest extends Request {
    _id?: string;
}

const getUserDetails = async (req: AuthenticatedRequest, res: Response) => {
    if (!req._id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const data = await getDetails("_id", req._id);

        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ data: data, message: "User details retrieved successfully" });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getUserDetails };

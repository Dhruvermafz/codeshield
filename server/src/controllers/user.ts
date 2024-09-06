import { Request, Response } from "express";
import { getDetails } from "../services/user";

interface AuthenticatedRequest extends Request {
    _id?: string;
}

const getUserDetails = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getDetails("_id", req._id)

    return res.status(200).json({data: data, message: "User details"})
}


export {getUserDetails}
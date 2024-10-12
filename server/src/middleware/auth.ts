import { NextFunction, Request, Response } from "express";
import { verifyJWTToken } from "../utils/auth"; // Import your JWT verification utility

// Define interface for AuthenticatedRequest
interface AuthenticatedRequest extends Request {
  _id?: string; // Optional _id field to hold the user ID
}

const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get access token from request header
    const token = req.header("auth-token") || req.header("Authorization");

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    // If the token is prefixed with 'Bearer ', remove it
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the token
    const decoded = verifyJWTToken(actualToken); // Ensure this function returns _id in the decoded payload

    if (decoded && decoded._id) {
      req._id = decoded._id; // Assign the userId from the decoded token to req._id
      next();
    } else {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default isAuthenticated;

import jwt from "jsonwebtoken";

// Define type for DecodedToken
interface DecodedToken {
  _id: string;
}

// Define type for UserDetails (optional, depending on your requirements)
interface UserDetails {
  _id: string;
  email?: string;
  role?: string;
  // Add any other fields relevant to your token payload
}

// Generate JWT Token
const generateJWTToken = (
  userDetails: UserDetails, 
  options: jwt.SignOptions = {}
) => {
  return jwt.sign(userDetails, process.env.JWT_SECRET_KEY as string, options);
};

// Verify JWT Token
const verifyJWTToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null; // Return null instead of false for clarity
  }
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export { isValidEmail, generateJWTToken, verifyJWTToken };

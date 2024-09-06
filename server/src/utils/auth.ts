import jwt from "jsonwebtoken"
interface DecodedToken {
    _id: string;
}

const generateJWTToken = (userDetails: any, options: jwt.SignOptions = {}) => {
    return jwt.sign(userDetails, process.env.JWT_SECRET_KEY, options)
}

const verifyJWTToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedToken
    } catch (error) {
        return false
    }
}


const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}


export {isValidEmail, generateJWTToken, verifyJWTToken}
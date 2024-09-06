import nodemailer from 'nodemailer'
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
    }
})


export {transporter}
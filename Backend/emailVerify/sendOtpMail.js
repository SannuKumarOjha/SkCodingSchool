import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handlebars from "handlebars";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const emailTemplate = handlebars.compile(
    fs.readFileSync(path.join(__dirname, "template.hbs"), "utf8")
);

export const sendOtpMail = async (
    email,
    otp,
    username = "there",
    purpose = "verify your email address"
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your SKCodingSchool security code",
        html: emailTemplate({ username, otp, purpose }),
    };
    await transporter.sendMail(mailOptions);
};
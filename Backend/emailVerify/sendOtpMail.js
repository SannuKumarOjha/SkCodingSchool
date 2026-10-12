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
    const isPasswordReset = purpose === "reset your password";
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
        from: `"SKCodingSchool" <${process.env.MAIL_USER}>`,
        to: email,
        subject: isPasswordReset
            ? "SKCodingSchool | Password reset code"
            : "SKCodingSchool | Verify your email",
        html: emailTemplate({ username, otp, purpose }),
        text: [
            "SKCodingSchool account security",
            "",
            `Hello ${username},`,
            "",
            `Use this one-time code to ${purpose}:`,
            "",
            `  ${otp}`,
            "",
            "This code expires in 10 minutes. Enter it only on the SKCodingSchool website.",
            "Never share this code with anyone.",
            "",
            "If you did not request this code, you can ignore this email.",
            "",
            "Automated message from SKCodingSchool. Please do not reply.",
        ].join("\n"),
    };
    await transporter.sendMail(mailOptions);
};
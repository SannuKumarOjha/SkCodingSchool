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
    const subject = isPasswordReset
        ? "SKCodingSchool | Password reset code"
        : "SKCodingSchool | Verify your email";
    const html = emailTemplate({ username, otp, purpose });
    const text = [
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
    ].join("\n");

    if (process.env.RESEND_API_KEY) {
        if (!process.env.MAIL_FROM) {
            throw new Error("MAIL_FROM must be set to a verified sender address for Resend.");
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM,
                to: [email],
                subject,
                html,
                text,
            }),
            signal: AbortSignal.timeout(15_000),
        });

        if (!response.ok) {
            const providerError = await response.json().catch(() => ({}));
            const detail = typeof providerError.message === "string"
                ? providerError.message
                : `HTTP ${response.status}`;
            throw new Error(`Resend email delivery failed: ${detail}`);
        }
        return;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error(
            "Email delivery is not configured. Set RESEND_API_KEY and MAIL_FROM; Render Free does not allow outbound SMTP."
        );
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        throw new Error(
            "Email delivery is not configured. Set RESEND_API_KEY and MAIL_FROM, or configure MAIL_USER and MAIL_PASS for local Gmail SMTP."
        );
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"SKCodingSchool" <${process.env.MAIL_USER}>`,
        to: email,
        subject,
        html,
        text,
    });
};
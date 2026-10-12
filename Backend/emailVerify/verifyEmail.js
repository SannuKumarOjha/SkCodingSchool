import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyEmail = async (token, email) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "template.hbs"),
    "utf-8",
  ); 
  const template = handlebars.compile(emailTemplateSource);
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  const htmlToSend = template({
    token: encodeURIComponent(token),
    frontendUrl,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailsConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify your email",
    html : htmlToSend,
  };

  await transporter.sendMail(mailsConfiguration);
  console.log("Verification email sent successfully");
};

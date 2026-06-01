// lib/email/send-session-submission.ts

import { transporter } from "./transporter";
import nodemailer from "nodemailer";

type SendEmailParams = {
  subject: string;
  html: string;
};

export async function sendSessionSubmissionEmail({
  subject,
  html,
}: SendEmailParams) {
  const info =await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TO,
    subject,
    html,
  });

  console.log("Message ID:", info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log("Preview URL:", previewUrl);

  return info;
}
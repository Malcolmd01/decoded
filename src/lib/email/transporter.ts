import { EmailClient } from "@azure/communication-email";

if (!process.env.AZURE_COMMUNICATION_CONNECTION_STRING) {
  throw new Error("Missing env: AZURE_COMMUNICATION_CONNECTION_STRING");
}

export const emailClient = new EmailClient(
  process.env.AZURE_COMMUNICATION_CONNECTION_STRING,
);

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "DoNotReply@egsync.com";

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "storeadmin@eg.dk")
  .split(",")
  .map((a) => ({ address: a.trim() }));

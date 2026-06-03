import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// No credentials passed in — the SDK picks up the ECS task role automatically
// via the container credentials endpoint. Just set the region.
const ses = new SESv2Client({ region: "eu-central-1" });

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const command = new SendEmailCommand({
    FromEmailAddress: "no-reply@insights.amplify.egsync.com",
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          Text: { Data: text ?? "", Charset: "UTF-8" },
        },
      },
    },
  });

  const res = await ses.send(command);
  return res.MessageId;
}

export const SENDER_EMAIL = "no-reply@insights.amplify.egsync.com";

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "gcx@eg.dk")
  .split(",")
  .map((a) => a.trim());

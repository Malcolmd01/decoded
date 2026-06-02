import { emailClient, SENDER_EMAIL, ADMIN_EMAILS } from "./transporter";

export async function sendSessionSubmissionEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const poller = await emailClient.beginSend({
    senderAddress: SENDER_EMAIL,
    recipients: { to: ADMIN_EMAILS },
    content: { subject, html },
  });
  return poller.pollUntilDone();
}

export async function sendConfirmationEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const poller = await emailClient.beginSend({
    senderAddress: SENDER_EMAIL,
    recipients: { to: [{ address: to }] },
    content: {
      subject: "We received your proposal — Decoded",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0e0e0c">
          <div style="background:#e81a2d;padding:32px;text-align:center">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/red-logo.svg" alt="Decoded" width="48" height="48" style="filter:brightness(0) invert(1)" />
          </div>
          <div style="padding:40px 32px;background:#ffffff">
            <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">Hi ${name}, we got your proposal!</h1>
            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">
              Thanks for submitting your session proposal to <strong>Decoded</strong>. Our team will review it and get back to you soon.
            </p>
            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">
              In the meantime, if you have any questions feel free to reach out at
              <a href="mailto:${ADMIN_EMAILS[0]?.address}" style="color:#e81a2d">${ADMIN_EMAILS[0]?.address}</a>.
            </p>
            <p style="font-size:14px;color:#888;margin:40px 0 0">
              © 2026 EG. All rights reserved.
            </p>
          </div>
        </div>
      `,
    },
  });
  return poller.pollUntilDone();
}

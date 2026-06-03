import { sendMail, ADMIN_EMAILS } from "./transporter";

export async function sendSessionSubmissionEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  // Demo mode — remove the log line and uncomment sendMail to go live.
  console.log("[demo] sendSessionSubmissionEmail", { subject, to: ADMIN_EMAILS });
  // return sendMail({ to: ADMIN_EMAILS, subject, html });
}

export async function sendConfirmationEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const safeName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    @font-face{font-family:'Clash Display';src:url('${base}/fonts/ClashDisplay-Semibold.woff2')format('woff2');font-weight:600;font-style:normal}
    @font-face{font-family:'Aileron';src:url('${base}/fonts/Aileron-600.woff2')format('woff2');font-weight:600;font-style:normal}
    @font-face{font-family:'Aileron';src:url('${base}/fonts/Aileron-700.woff2')format('woff2');font-weight:700;font-style:normal}
    @media only screen and (max-width:600px){
      .outer{padding:0!important}
      .card{width:100%!important}
      .content{padding:32px 24px 0!important}
      .step-label{display:block!important;width:100%!important;padding-bottom:2px!important;padding-right:0!important;white-space:normal!important}
      .step-value{display:block!important;width:100%!important;padding-bottom:14px!important}
      .cta-text{display:block!important;width:100%!important;padding:14px 16px 10px!important}
      .cta-btn{display:block!important;width:100%!important;padding:0 16px 14px!important;text-align:left!important}
      .footer-logo{display:block!important;padding-bottom:8px!important}
      .footer-copy{display:block!important;text-align:left!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#1e1e1e;-webkit-font-smoothing:antialiased">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:#1e1e1e;padding:40px 16px">
<tr><td align="center">
<table role="presentation" class="card" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#1e1e1e">

  <!-- Red header bar -->
  <tr><td style="background:#e81a2d;overflow:visible;padding:0">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;padding:16px 24px 0;overflow:visible">
      <div style="display:flex;align-items:center;gap:14px;padding-bottom:16px">
        <img src="${base}/Decoded Logo V4 1.png" alt="Decoded" width="80" height="12" style="display:block;border:0;filter:brightness(0)invert(1)">
        <img src="${base}/EG Logo V2 1.png" alt="EG" height="20" style="display:block;border:0;filter:brightness(0)invert(1)">
      </div>
      <img src="${base}/Decoded Icon V3 1.png" alt="" width="56" height="56" style="display:block;border:0;margin-bottom:-28px">
    </div>
  </td></tr>

  <!-- Greeting -->
  <tr><td class="content" style="padding:40px 48px 0">
    <h1 style="margin:0 0 16px;font-family:'Clash Display',sans-serif;font-size:22px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#f0ede6;line-height:1.25">WE GOT YOUR PROPOSAL,<br>${safeName}</h1>
    <p style="margin:0;font-family:'Aileron',sans-serif;font-size:15px;line-height:1.7;color:#9aa0ac">Thanks for submitting to Decoded. Our team reviews every proposal carefully and will be in touch within 5 working days.</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:28px 48px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:#6d7585;line-height:0;font-size:0">&nbsp;</td></tr></table>
  </td></tr>

  <!-- What happens next -->
  <tr><td class="content" style="padding:32px 48px 0">
    <p style="margin:0 0 20px;font-family:'Clash Display',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6d7585">WHAT HAPPENS NEXT</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="step-label" width="130" valign="top" style="padding:0 20px 16px 0;font-family:'Aileron',sans-serif;font-size:13px;font-weight:600;color:#f0ede6;white-space:nowrap">Review</td>
        <td class="step-value" valign="top" style="padding:0 0 16px;font-family:'Aileron',sans-serif;font-size:14px;line-height:1.65;color:#9aa0ac">Your proposal lands with the Decoded programme team for a first read.</td>
      </tr>
      <tr>
        <td class="step-label" width="130" valign="top" style="padding:0 20px 16px 0;font-family:'Aileron',sans-serif;font-size:13px;font-weight:600;color:#f0ede6;white-space:nowrap">Discovery call</td>
        <td class="step-value" valign="top" style="padding:0 0 16px;font-family:'Aileron',sans-serif;font-size:14px;line-height:1.65;color:#9aa0ac">If it&#8217;s a fit, we&#8217;ll reach out to schedule a 30-minute conversation about your session.</td>
      </tr>
      <tr>
        <td class="step-label" width="130" valign="top" style="padding:0 20px 0 0;font-family:'Aileron',sans-serif;font-size:13px;font-weight:600;color:#f0ede6;white-space:nowrap">Confirmed</td>
        <td class="step-value" valign="top" style="padding:0;font-family:'Aileron',sans-serif;font-size:14px;line-height:1.65;color:#9aa0ac">Format, date, and logistics locked. We handle everything from here.</td>
      </tr>
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:24px 48px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:#6d7585;line-height:0;font-size:0">&nbsp;</td></tr></table>
  </td></tr>

  <!-- CTA banner -->
  <tr><td style="padding:24px 48px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgb(72,18,18)">
      <tr>
        <td class="cta-text" valign="middle" style="padding:14px 12px 14px 16px">
          <p style="margin:0 0 3px;font-family:'Aileron',sans-serif;font-size:14px;font-weight:600;color:#f0ede6">Questions in the meantime?</p>
          <p style="margin:0;font-family:'Aileron',sans-serif;font-size:12px;color:#9aa0ac">Reach the Decoded team at <a href="mailto:gcx@eg.dk" style="font-family:'Aileron',sans-serif;color:#e81a2d;text-decoration:none">gcx@eg.dk</a></p>
        </td>
        <td class="cta-btn" align="right" valign="middle" style="padding:14px 16px 14px 12px;white-space:nowrap">
          <a href="mailto:gcx@eg.dk" style="display:inline-block;background:rgb(152,42,42);padding:10px 18px;font-family:'Clash Display',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#f0ede6;text-decoration:none">GET IN TOUCH</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#000;padding:12px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="footer-logo" valign="middle" style="padding-right:8px">
          <img src="${base}/Decoded Logo V4 1.png" alt="Decoded" width="80" height="12" style="display:block;border:0">
        </td>
        <td class="footer-copy" align="right" valign="middle" style="font-family:'Aileron',sans-serif;font-size:11px;color:#6d7585;white-space:nowrap">&#169; 2026 EG. All rights reserved</td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
;

  // Demo mode — remove the log line and uncomment sendMail to go live.
  console.log("[demo] sendConfirmationEmail", { to, name });
  // return sendMail({
  //   to,
  //   subject: "We received your proposal — Decoded",
  //   html,
  // });
}

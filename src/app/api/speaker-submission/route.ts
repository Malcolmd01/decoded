import { NextResponse } from "next/server";
import {
  sendSessionSubmissionEmail,
  sendConfirmationEmail,
} from "@/lib/email/send-session-submission";
import { sessionSubmissionSchema, type SessionSubmissionFormValues } from "@/lib/validation/schema";

function esc(val: unknown): string {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FIELD_LABELS: Record<string, string> = {
  speakerType:            "Speaker Type",
  fullName:               "Full Name",
  businessUnit:           "Business Unit",
  team:                   "Team",
  jobTitle:               "Job Title",
  company:                "Company",
  email:                  "Email",
  linkedin:               "LinkedIn",
  phoneNumber:            "Phone Number",
  proposedTopic:          "Proposed Topic",
  deliveryPreference:     "Delivery Preference",
  preferredSessionFormat: "Session Format",
  sessionAbstract:        "Session Abstract",
  speakerBio:             "Speaker Bio",
  avRequirements:         "AV / Tech Requirements",
  heardAboutDecoded:      "How They Heard About Decoded",
};

const SPEAKER_FIELDS  = ["speakerType","fullName","businessUnit","team","jobTitle","company","email","linkedin","phoneNumber"] as const;
const SESSION_FIELDS  = ["proposedTopic","deliveryPreference","preferredSessionFormat","sessionAbstract","speakerBio","avRequirements","heardAboutDecoded"] as const;

function row(label: string, value: unknown, shade: boolean): string {
  const bg = shade ? "#f9f9f9" : "#ffffff";
  return `
    <tr>
      <td style="padding:10px 16px;font-weight:600;white-space:nowrap;background:${bg};border-bottom:1px solid #e8e8e8;color:#333;width:220px">${esc(label)}</td>
      <td style="padding:10px 16px;background:${bg};border-bottom:1px solid #e8e8e8;color:#111;white-space:pre-wrap">${esc(value)}</td>
    </tr>`;
}

function section(title: string, fields: readonly string[], data: Record<string, unknown>): string {
  const rows = fields
    .filter((k) => k in data && data[k] !== undefined && data[k] !== "")
    .map((k, i) => row(FIELD_LABELS[k] ?? k, data[k], i % 2 === 1))
    .join("");

  return `
    <tr>
      <td colspan="2" style="padding:10px 16px;background:#1a1a12;color:#fff;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase">
        ${esc(title)}
      </td>
    </tr>
    ${rows}`;
}

function buildAdminEmail(data: SessionSubmissionFormValues): string {
  const d = data as unknown as Record<string, unknown>;
  const submitted = new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" });

  return `
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto">
      <div style="background:#e81a2d;padding:20px 24px;display:flex;align-items:center;justify-content:space-between">
        <span style="color:#fff;font-size:18px;font-weight:700">New Session Submission</span>
        <span style="color:rgba(255,255,255,0.75);font-size:12px">${esc(submitted)}</span>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #e8e8e8">
        <tbody>
          ${section("About the Speaker", SPEAKER_FIELDS, d)}
          ${section("Session Details",   SESSION_FIELDS,  d)}
        </tbody>
      </table>
    </div>`;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const result = sessionSubmissionSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
  }

  try {
    await sendSessionSubmissionEmail({
      subject: `New Session Submission — ${result.data.fullName}`,
      html: buildAdminEmail(result.data),
    });
  } catch (err) {
    console.error("Failed to send submission email:", err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }

  sendConfirmationEmail({ to: result.data.email, name: result.data.fullName }).catch((err) =>
    console.error("Failed to send confirmation email:", err),
  );

  return NextResponse.json({ success: true });
}

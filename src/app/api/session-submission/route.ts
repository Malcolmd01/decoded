// app/api/session-submission/route.ts

import { NextResponse } from "next/server";

import { sendSessionSubmissionEmail } from "@/lib/email/send-session-submission";

export async function POST(request: Request) {
  const body = await request.json();

  await sendSessionSubmissionEmail({
    subject: "New Session Submission",
    html: `
      <h1>New Submission</h1>

      <pre>
${JSON.stringify(body, null, 2)}
      </pre>
    `,
  });

  return NextResponse.json({
    success: true,
  });
}
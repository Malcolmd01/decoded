// app/submit-session/page.tsx

import { SessionSubmissionForm } from "@/features/session-submission-form";


export default function SubmitSessionPage() {
  return (
    <main className="container mx-auto py-12">
      <h1>Submit a Session</h1>

      <SessionSubmissionForm />
    </main>
  );
}
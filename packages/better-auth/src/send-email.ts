import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  text,
  apiKey
}: {
  to: string;
  subject: string;
  text: string;
  apiKey: string;
}) {
  const resend = new Resend(apiKey);
  
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
  });
}

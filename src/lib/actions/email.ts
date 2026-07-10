"use server";

import { Resend } from "resend";
import { getSiteSettings } from "./settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: { name: string; email: string; body: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return { error: "Email configuration is missing." };
  }

  try {
    const settings = await getSiteSettings();
    // Default to a fallback email if not configured in settings
    const toEmail = settings.email || "test@example.com";

    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      subject: `New Message from ${formData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${formData.body}</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return { error: data.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { error: error.message || "Failed to send email." };
  }
}

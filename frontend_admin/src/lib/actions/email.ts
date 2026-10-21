"use server";

import { Resend } from "resend";
import { getSiteSettings } from "./settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: { name: string; email: string; body: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set in environment variables");
    return { error: "Email configuration is missing on server." };
  }

  try {
    let settingsEmail: string | undefined;
    try {
      const settings = await getSiteSettings();
      settingsEmail = settings?.email;
    } catch (e) {
      console.warn("Could not fetch site settings email:", e);
    }

    // Default to verified Resend recipient or configured email
    const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || settingsEmail || "nanicomlekan111@gmail.com";

    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: formData.email,
      subject: `💼 New Message from ${formData.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">New Message Received</h2>
          <p style="color: #64748b; font-size: 14px;">Someone submitted the contact form on your portfolio website.</p>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #1e293b;"><strong>Name:</strong> ${formData.name}</p>
            <p style="margin: 0; color: #1e293b;"><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #2563eb;">${formData.email}</a></p>
          </div>

          <div style="margin: 20px 0;">
            <strong style="color: #334155;">Message:</strong>
            <p style="white-space: pre-wrap; color: #1e293b; background: #f1f5f9; padding: 16px; border-radius: 8px; line-height: 1.6;">${formData.body}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Sent automatically from your Portfolio CMS via Resend.</p>
        </div>
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

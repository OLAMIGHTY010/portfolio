import { NextResponse } from "next/server";
import { isPlaceholderConfig } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, body } = await req.json();

    if (!name || !email || !body) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Save message to Supabase if configured
    if (!isPlaceholderConfig()) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { error: dbError } = await supabase.from("messages").insert([
          {
            name,
            email,
            body,
          },
        ]);
        if (dbError) {
          console.warn("Database insert warning:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Could not insert message into DB:", dbErr);
      }
    }

    // 2. Dispatch email notification via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const toEmail =
          process.env.CONTACT_NOTIFICATION_EMAIL || "nanicomlekan111@gmail.com";

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [toEmail],
            reply_to: email,
            subject: `💼 New Message from ${name}`,
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0;">New Message Received</h2>
              <p style="color: #64748b; font-size: 14px;">Someone submitted the contact form on your portfolio website.</p>
              
              <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; color: #1e293b;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0; color: #1e293b;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              </div>

              <div style="margin: 20px 0;">
                <strong style="color: #334155;">Message:</strong>
                <p style="white-space: pre-wrap; color: #1e293b; background: #f1f5f9; padding: 16px; border-radius: 8px; line-height: 1.6;">${body}</p>
              </div>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Sent automatically from your Portfolio website via Resend.</p>
            </div>
            `,
          }),
        });

        if (!resendRes.ok) {
          const errData = await resendRes.json().catch(() => ({}));
          console.error("Resend API returned error:", errData);
        }
      } catch (emailErr) {
        console.error("Failed to send Resend email:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY is not configured; skipping email dispatch.");
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact API handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

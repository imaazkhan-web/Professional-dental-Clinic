import "server-only";
import { Resend } from "resend";

interface AppointmentEmailData {
  fullName: string;
  phone: string;
  treatment: string;
  preferredTime: string;
}

/**
 * Escapes unsafe HTML characters to prevent XSS injection in email templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendAppointmentEmail(
  data: AppointmentEmailData
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFY_EMAIL;

  if (!apiKey || !toEmail) {
    console.error("Resend notification skipped: missing API key or recipient email");
    return;
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(data.fullName);
  const safePhone = escapeHtml(data.phone);
  const safeTreatment = escapeHtml(data.treatment);
  const safeTime = escapeHtml(data.preferredTime);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0F2A4A; margin-bottom: 16px;">New Appointment Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Name:</td>
          <td style="padding: 8px 0; color: #0F2A4A;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0; color: #0F2A4A;"><a href="tel:${safePhone}">${safePhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Treatment:</td>
          <td style="padding: 8px 0; color: #0F2A4A;">${safeTreatment}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Preferred Time:</td>
          <td style="padding: 8px 0; color: #0F2A4A;">${safeTime}</td>
        </tr>
      </table>
      <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
        Sent automatically from Dental Clinic Website
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Dental Clinic <onboarding@resend.dev>",
      to: toEmail,
      subject: "New Appointment Request",
      html,
    });

    if (error) {
      console.error(error.name);
    }
  } catch (err) {
    console.error(err instanceof Error ? err.name : "Error");
  }
}
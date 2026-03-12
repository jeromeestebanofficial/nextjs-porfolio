import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  service?: string;
  projectDetails?: string;
  name?: string;
  email?: string;
  phone?: string;
};

function readRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const service = payload.service?.trim() ?? "";
  const projectDetails = payload.projectDetails?.trim() ?? "";
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";

  if (!service || !projectDetails || !name || !email) {
    return NextResponse.json(
      { error: "Service, project details, name, and email are required." },
      { status: 400 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "jeromeesteban.dev@gmail.com";

  try {
    const host = readRequiredEnv("SMTP_HOST");
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || "false") === "true";
    const user = readRequiredEnv("SMTP_USER");
    const pass = readRequiredEnv("SMTP_PASS");
    const fromEmail = process.env.SMTP_FROM_EMAIL || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${service} - ${name}`,
      text: [
        `Service: ${service}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Project Details:",
        projectDetails,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin-bottom:8px;">New Portfolio Contact Message</h2>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p style="margin-top:16px;"><strong>Project Details:</strong></p>
          <p style="white-space:pre-wrap;">${projectDetails}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

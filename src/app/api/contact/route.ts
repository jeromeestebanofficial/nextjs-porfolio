import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  category?: string;
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  extraInfo?: string;
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

  const category = payload.category?.trim() ?? "";
  const date = payload.date?.trim() ?? "";
  const time = payload.time?.trim() ?? "";
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const extraInfo = payload.extraInfo?.trim() ?? "";

  if (!category || !date || !time || !name || !email) {
    return NextResponse.json(
      { error: "Category, date, time, name, and email are required." },
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

    const parsedDate = new Date(date);
    const safeDateLabel = Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toISOString().slice(0, 10);
    const safeTimeLabel = time;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Service Request: ${category} - ${name}`,
      text: [
        `Category: ${category}`,
        `Date: ${safeDateLabel}`,
        `Time: ${safeTimeLabel}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Additional information:",
        extraInfo || "None provided",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin-bottom:8px;">New Service Request</h2>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Date:</strong> ${safeDateLabel}</p>
          <p><strong>Time:</strong> ${safeTimeLabel}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p style="margin-top:16px;"><strong>Additional information:</strong></p>
          <p style="white-space:pre-wrap;">${extraInfo || "None provided"}</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Request received",
      text: [
        `Hi ${name || "there"},`,
        "",
        "Thanks for reaching out — I’ve received your service request and will get back to you shortly.",
        "",
        `Category: ${category}`,
        `Requested date: ${safeDateLabel}`,
        `Requested time: ${safeTimeLabel}`,
        "",
        "— Jerome",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
          <p>Hi ${name || "there"},</p>
          <p>
            Thanks for reaching out — I’ve received your service request and will get back to you shortly.
          </p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Requested date:</strong> ${safeDateLabel}</p>
          <p><strong>Requested time:</strong> ${safeTimeLabel}</p>
          <p style="margin-top:18px;">— Jerome</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

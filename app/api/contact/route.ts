import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/content";
import { z } from "zod";

const messageSchema = z.object({ name: z.string().trim().min(1).max(150), email: z.email().max(254), subject: z.string().trim().min(1).max(200), message: z.string().trim().min(20).max(5000), website: z.string().optional() });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 12000) return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid message." }, { status: 400 }); }
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please complete every field with a valid email and a message of 20–5,000 characters." }, { status: 400 });
  const { name, email, subject, message, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true });
  const { profile } = await getPortfolioContent();
  if (!profile.email) return NextResponse.json({ error: "Contact details are not available yet." }, { status: 503 });
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ mailto: true });
  const to = profile.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) return NextResponse.json({ mailto: true });
  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", { method: "POST", signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], reply_to: email, subject: `[Portfolio] ${subject}`, text: `From: ${name} <${email}>\n\n${message}` }) });
  } catch { return NextResponse.json({ error: "The message service is temporarily unavailable. Please email me directly." }, { status: 502 }); }
  if (!response.ok) return NextResponse.json({ error: "The message service is temporarily unavailable. Please email me directly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

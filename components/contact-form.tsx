"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.mailto) { window.location.href = `mailto:${email}?subject=${encodeURIComponent(String(payload.subject || "Portfolio enquiry"))}&body=${encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`)}`; setStatus("Opening your email app…"); }
      else if (!response.ok) throw new Error(result.error || "Unable to send message.");
      else { form.reset(); setStatus("Message sent. Thank you — I will get back to you soon."); }
    } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to send message."); }
    finally { setBusy(false); }
  }
  return <form className="contact-form" onSubmit={submit}><div className="form-grid">
    <div className="contact-trap" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="field"><label htmlFor="name">Name</label><input className="input" id="name" name="name" required autoComplete="name" /></div>
    <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div>
    <div className="field full"><label htmlFor="subject">Subject</label><input className="input" id="subject" name="subject" required /></div>
    <div className="field full"><label htmlFor="message">Message</label><textarea className="textarea" id="message" name="message" required minLength={20} /></div>
    <div className="field full"><button className="button" disabled={busy} type="submit">{busy ? "Sending…" : "Send message"}<Send size={17} /></button>{status ? <p className="form-message" role="status">{status}</p> : null}</div>
  </div></form>;
}

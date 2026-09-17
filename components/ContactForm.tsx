"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ContactResponse = { message?: string; delivery?: "resend" | "mailto"; mailtoUrl?: string };

export function ContactForm({ subject = "Yhteydenotto verkkosivulta", locale = "fi" }: { subject?: string; locale?: "fi" | "en" }) {
  const en = locale === "en";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setMessage("");
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, subject, startedAt: startedAt.current }) });
      const payload = (await response.json()) as ContactResponse;
      if (!response.ok) throw new Error(payload.message || (en ? "Message could not be sent." : "Viestin lähetys epäonnistui."));
      form.reset(); startedAt.current = Date.now(); setStatus("success");
      if (payload.delivery === "mailto" && payload.mailtoUrl) { setMessage(payload.message || (en ? "Opening your email application." : "Sähköpostiohjelma avataan.")); window.location.assign(payload.mailtoUrl); return; }
      setMessage(payload.message || (en ? "Thank you. Your message has been received." : "Kiitos. Viesti on vastaanotettu."));
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : (en ? "Message could not be sent." : "Viestin lähetys epäonnistui.")); }
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row"><label>{en ? "Name" : "Nimi"}<input name="name" autoComplete="name" required maxLength={100} /></label><label>{en ? "Email" : "Sähköposti"}<input name="email" type="email" autoComplete="email" required maxLength={180} /></label></div>
    <div className="form-row"><label>{en ? "Company" : "Yritys"}<input name="company" autoComplete="organization" maxLength={120} /></label><label>{en ? "Phone" : "Puhelin"}<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label></div>
    <label>{en ? "Message" : "Viesti"}<textarea name="message" required minLength={10} maxLength={3000} rows={6} /></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="privacy-row"><input name="privacyConsent" type="checkbox" value="Hyväksytty" required />{en ? "I agree to my information being processed to respond to this enquiry." : "Hyväksyn tietojeni käsittelyn yhteydenottoon vastaamista varten."}</label>
    <button className="button button-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? (en ? "Sending…" : "Lähetetään…") : (en ? "Send message" : "Lähetä viesti")}</button>
    {message ? <p className={`form-status ${status}`} role="status">{message}</p> : null}
  </form>;
}

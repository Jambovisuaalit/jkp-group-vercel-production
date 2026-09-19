"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

function EnglishRentalForm({ subject, label, children }: { subject: string; label: string; children: ReactNode }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");
    try {
      const values = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subject, startedAt: startedAt.current }),
      });
      const data = (await response.json()) as { message?: string; delivery?: "resend" | "stored" };
      if (!response.ok) throw new Error(data.message || "Your enquiry could not be received.");
      form.reset();
      startedAt.current = Date.now();
      setStatus("success");
      setMessage(data.delivery === "stored"
        ? "Your information was saved, but an email notification could not be confirmed. Please phone JKP Group if the matter is urgent."
        : "Thank you. Your enquiry has been received.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your enquiry could not be received.");
    }
  }

  return <form className="contact-form" onSubmit={submit} lang="en">
    {children}
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="privacy-row"><input name="privacyConsent" type="checkbox" value="Hyväksytty" required />
      <span>I have read the <a href="/en/privacy" target="_blank" rel="noopener noreferrer">privacy notice</a> and agree to the processing of my enquiry details.</span>
    </label>
    <button className="button button-submit" disabled={status === "loading"} type="submit">{status === "loading" ? "Sending…" : label}</button>
    {message && <p className={`form-status ${status}`} role="status">{message}</p>}
  </form>;
}

export function EnglishBusinessPremisesForm() {
  return <EnglishRentalForm subject="B2B-toimitilan tarjouspyyntö" label="Send premises enquiry">
    <div className="form-row">
      <label>Company<input name="company" autoComplete="organization" required maxLength={160} /></label>
      <label>Finnish Business ID (if applicable)<input name="businessId" maxLength={20} /></label>
    </div>
    <div className="form-row">
      <label>Contact person<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>Telephone<input name="phone" type="tel" autoComplete="tel" required maxLength={40} /></label>
    </div>
    <label>Email<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
    <div className="form-row">
      <label>Type of premises<input name="spaceType" required maxLength={120} /></label>
      <label>Required floor area<input name="areaNeed" required maxLength={80} placeholder="e.g. 150–250 m²" /></label>
    </div>
    <div className="form-row">
      <label>Preferred location<input name="preferredLocation" required maxLength={160} /></label>
      <label>Preferred start date<input name="startDate" type="date" /></label>
    </div>
    <label>Intended use and additional details<textarea name="message" required minLength={10} maxLength={3000} rows={5} /></label>
  </EnglishRentalForm>;
}

export function EnglishApartmentApplicationForm() {
  return <EnglishRentalForm subject="Asuntovuokrauksen hakemus" label="Send rental application">
    <div className="form-row">
      <label>Applicant name<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>Telephone<input name="phone" type="tel" autoComplete="tel" required maxLength={40} /></label>
    </div>
    <label>Email<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
    <label>Property applied for<input name="property" required maxLength={180} /></label>
    <div className="form-row">
      <label>Number of occupants<input name="occupants" type="number" min="1" max="20" required /></label>
      <label>Preferred move-in date<input name="moveInDate" type="date" required /></label>
    </div>
    <div className="form-row">
      <label>Expected rental duration<input name="rentalDuration" required maxLength={100} /></label>
      <label>Pets<input name="pets" maxLength={180} placeholder="No / yes, specify" /></label>
    </div>
    <label>Smoking<select name="smoking" required defaultValue=""><option value="" disabled>Select</option><option value="Ei">No</option><option value="Kyllä">Yes</option></select></label>
    <label>Additional details<textarea name="message" required minLength={10} maxLength={3000} rows={5} /></label>
    <p>Do not submit national identity numbers, bank details or sensitive documents through this form.</p>
  </EnglishRentalForm>;
}

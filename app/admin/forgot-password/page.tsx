"use client";

import { FormEvent, useState } from "react";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message || "Palautuspyyntö käsiteltiin.");
    } catch {
      setMessage("Palautuspyynnön lähettäminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>JKP Hallinta</p>
        <h1 className={styles.title}>Palauta salasana</h1>
        <p className={styles.lead}>
          Saat sähköpostiin kertakäyttöisen palautuslinkin, jos osoitteella on aktiivinen hallintatili.
        </p>
        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>
            Sähköposti
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Lähetetään…" : "Lähetä palautuslinkki"}
          </button>
        </form>
        {message ? <p className={styles.notice} role="status">{message}</p> : null}
        <a className={styles.backLink} href="/admin">← Takaisin kirjautumiseen</a>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "../auth.module.css";

export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const access = params.get("access_token") || "";
    const refresh = params.get("refresh_token") || "";
    const errorDescription = params.get("error_description") || "";

    window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);

    if (errorDescription) {
      setMessage(errorDescription);
    } else if (!access || !refresh) {
      setMessage("Palautuslinkki on virheellinen tai vanhentunut.");
    } else {
      setAccessToken(access);
      setRefreshToken(refresh);
      setReady(true);
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmation) {
      setMessage("Uudet salasanat eivät täsmää.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/password/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken, newPassword }),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message || "Salasanan palautus käsiteltiin.");
      if (response.ok) {
        setSuccess(true);
        setAccessToken("");
        setRefreshToken("");
      }
    } catch {
      setMessage("Salasanan palauttaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>JKP Hallinta</p>
        <h1 className={styles.title}>Aseta uusi salasana</h1>
        <p className={styles.lead}>
          Käytä vähintään 12 merkin salasanaa, jota ei käytetä muissa palveluissa.
        </p>

        {ready && !success ? (
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              Uusi salasana
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={12}
                required
                autoComplete="new-password"
              />
            </label>
            <label className={styles.field}>
              Uusi salasana uudelleen
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={12}
                required
                autoComplete="new-password"
              />
            </label>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Tallennetaan…" : "Vaihda salasana"}
            </button>
          </form>
        ) : null}

        {message ? (
          <p className={`${styles.notice} ${success ? styles.success : ""}`} role="status">
            {message}
          </p>
        ) : null}
        <a className={styles.backLink} href="/admin">
          {success ? "Siirry hallintaan →" : "← Takaisin kirjautumiseen"}
        </a>
      </section>
    </main>
  );
}

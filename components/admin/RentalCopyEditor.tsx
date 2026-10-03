"use client";
import type { SiteContent } from "@/content/defaults";
export function RentalCopyEditor({ content, onChange }: { content: SiteContent; onChange: (value: SiteContent) => void }) {
  const input = { padding: 12, border: "1px solid #bacbd4", background: "#fff", color: "#243e4b", width: "100%" } as const;
  return <section>
    <h2>Vuokraussivun esittelytekstit</h2>
    <p>Vuokrakohteiden julkaisu ja kohdekuvat ovat Vuokrakohteet-osiossa. Tämä osio muuttaa vain FI/EN-esittelytekstit.</p>
    {(["fi", "en"] as const).map(locale => {
      const copy = locale === "fi" ? content.rental : content.rentalEn;
      const change = (key: "title" | "lead", value: string) => onChange(locale === "fi"
        ? { ...content, rental: { ...content.rental, [key]: value } }
        : { ...content, rentalEn: { ...content.rentalEn, [key]: value } });
      return <section key={locale} style={{ padding: 18, marginBlock: 20, border: "1px solid #dbe6ec" }}>
        <h3>{locale === "fi" ? "Suomi" : "English"}</h3>
        <label style={{ display: "grid", gap: 8, marginBlock: 16 }}>Pääotsikko<input style={input} value={copy.title} onChange={e => change("title", e.target.value)} /></label>
        <label style={{ display: "grid", gap: 8, marginBlock: 16 }}>Ingressi<textarea style={input} rows={4} value={copy.lead} onChange={e => change("lead", e.target.value)} /></label>
      </section>;
    })}
  </section>;
}

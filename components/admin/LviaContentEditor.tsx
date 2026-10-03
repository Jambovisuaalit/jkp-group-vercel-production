"use client";
import type { SiteContent, LviaPageCopy } from "@/content/defaults";

export function LviaContentEditor({ content, onChange }: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  const locales = [{ code: "fi", label: "Suomi" }, { code: "en", label: "English" }] as const;
  const fieldStyle = { display: "grid", gap: 6, marginBlock: 14 } as const;
  const inputStyle = { padding: 12, width: "100%", maxWidth: "100%", border: "1px solid #bacbd4", background: "#fff", color: "#243e4b" } as const;
  return <section>
    <h2>LVIA-valvonnan FI/EN-sivusisällöt</h2>
    {locales.map(({ code, label }) => {
      const copy = content.lviaPage[code];
      const set = (patch: Partial<LviaPageCopy>) => onChange({ ...content, lviaPage: { ...content.lviaPage, [code]: { ...copy, ...patch } } });
      const input = (title: string, value: string, change: (v: string) => void, rows = 0) => <label style={fieldStyle} key={title}>
        <strong>{title}</strong>
        {rows ? <textarea style={inputStyle} rows={rows} value={value} onChange={event => change(event.target.value)} />
          : <input style={inputStyle} value={value} onChange={event => change(event.target.value)} />}
      </label>;
      return <section key={code} style={{ background: "#fff", border: "1px solid #dbe6ec", padding: 24, marginBlock: 20 }}>
        <h3>{label}</h3>
        {input("Pääotsikko", copy.title, title => set({ title }), 2)}
        {input("Johdanto", copy.lead, lead => set({ lead }), 4)}
        {input("Valvonnan vaiheiden otsikko", copy.phasesHeading, phasesHeading => set({ phasesHeading }), 2)}
        {input("Valvonnan vaiheiden johdanto", copy.phasesLead, phasesLead => set({ phasesLead }), 3)}
        {copy.phases.map((phase, index) => <fieldset key={index} style={{ padding: 16, marginBlock: 14, border: "1px solid #dbe6ec" }}>
          <legend>Vaihe {index + 1}</legend>
          {input("Numero", phase.number, number => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, number } : p) }))}
          {input("Vaiheen otsikko", phase.title, title => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, title } : p) }))}
          {input("Vaiheen kuvaus", phase.description, description => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, description } : p) }), 3)}
          {input("Vaiheen tehtävät (yksi per rivi)", phase.items.join("\n"), value => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, items: value.split("\n").map(v => v.trim()).filter(Boolean) } : p) }), 4)}
        </fieldset>)}
        {input("Kokemusosion otsikko", copy.proofTitle, proofTitle => set({ proofTitle }), 2)}
        {input("Kokemusosion kuvaus", copy.proofLead, proofLead => set({ proofLead }), 3)}
        {input("Yhteydenoton otsikko", copy.contactTitle, contactTitle => set({ contactTitle }))}
        {input("Yhteydenoton kuvaus", copy.contactLead, contactLead => set({ contactLead }), 3)}
      </section>;
    })}
  </section>;
}

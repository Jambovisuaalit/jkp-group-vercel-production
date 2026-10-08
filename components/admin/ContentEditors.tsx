"use client";
import type { SiteContent, CompanyPageCopy, TechnicalPageCopy } from "@/content/defaults";

const locales = [{ code: "fi", label: "Suomi (FI)" }, { code: "en", label: "English (EN)" }] as const;
const box = { display: "grid", gap: 8, marginBlock: 16 } as const;
const group = { border: "1px solid #dbe6ec", padding: "22px", marginBlock: 20, background: "#fff" } as const;
const input = { width: "100%", maxWidth: "100%", padding: "12px", border: "1px solid #bacbd4", color: "#243e4b", background: "#fff" } as const;

function Field({ title, value, change, lines = 0 }: { title: string; value: string; change: (text: string) => void; lines?: number }) {
  return <label style={box}><strong>{title}</strong>
    {lines ? <textarea style={input} rows={lines} value={value} onChange={e => change(e.target.value)} />
      : <input style={input} value={value} onChange={e => change(e.target.value)} />}
  </label>;
}

/* Controlled editors receive the same SiteContent object used by the public
 * server-rendered FI/EN pages; save only through the existing authenticated API. */
export function CompanyContentEditor({ content, onChange }: { content: SiteContent; onChange: (next: SiteContent) => void }) {
  function update(locale: "fi" | "en", copy: CompanyPageCopy) {
    onChange({ ...content, companyPage: { ...content.companyPage, [locale]: copy } });
  }
  return <section>
    <h2>Yritysesittely ja historia</h2>
    <p>Muokkaa molempia kieliä erikseen. Vuosiluvut julkaistaan vasta asiakkaan vahvistuksen mukaisina.</p>
    {locales.map(({ code, label }) => {
      const copy = content.companyPage[code];
      const set = (patch: Partial<CompanyPageCopy>) => update(code, { ...copy, ...patch });
      return <section style={group} key={code}>
        <h3>{label}</h3>
        <Field title="Yritys-sivun pääotsikko" value={copy.title} change={title => set({ title })} />
        {copy.intro.map((paragraph, index) => <Field key={index} title={"Esittelyteksti " + (index + 1)} lines={4} value={paragraph}
          change={text => set({ intro: copy.intro.map((old, i) => i === index ? text : old) })} />)}
        <button type="button" onClick={() => set({ intro: [...copy.intro, ""] })}>Lisää esittelykappale</button>
        {copy.intro.length > 1 ? <button type="button" onClick={() => set({ intro: copy.intro.slice(0, -1) })}>Poista viimeinen kappale</button> : null}
        <Field title="Historiaosion otsikko" value={copy.historyTitle} change={historyTitle => set({ historyTitle })} />
        {copy.history.map((step, index) => <fieldset style={group} key={index}>
          <legend>Historian vaihe {index + 1}</legend>
          <Field title="Ajanjakso / vaihe" value={step.era} change={era => set({ history: copy.history.map((old, i) => i === index ? { ...old, era } : old) })} />
          <Field title="Kappaleet, tyhjä rivi erottaa kappaleet" lines={5} value={step.texts.join("\n\n")}
            change={value => set({ history: copy.history.map((old, i) => i === index ? { ...old, texts: value.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) } : old) })} />
          <button type="button" onClick={() => set({ history: copy.history.filter((_, i) => i !== index) })}>Poista vaihe</button>
        </fieldset>)}
        <button type="button" onClick={() => set({ history: [...copy.history, { era: "", texts: [""] }] })}>Lisää historian vaihe</button>
      </section>;
    })}
  </section>;
}

export function HomeCopyEditor({ content, onChange }: { content: SiteContent; onChange: (next: SiteContent) => void }) {
  return <section>
    <h2>Etusivun palvelunostot ja kieliversiot</h2>
    {locales.map(({ code, label }) => {
      const copy = content.homeCopy[code];
      const set = (patch: Partial<typeof copy>) => onChange({ ...content, homeCopy: { ...content.homeCopy, [code]: { ...copy, ...patch } } });
      return <section style={group} key={code}>
        <h3>{label}</h3>
        <Field title="Palveluosion otsikko" lines={2} value={copy.serviceHeading} change={serviceHeading => set({ serviceHeading })} />
        {copy.tiles.map((title, i) => <Field key={i} title={"Palvelukortin " + (i + 1) + " otsikko"} value={title}
          change={next => set({ tiles: copy.tiles.map((old, n) => n === i ? next : old) })} />)}
        <Field title="Referenssigallerian otsikko" value={copy.referenceHeading} change={referenceHeading => set({ referenceHeading })} />
      </section>;
    })}
    <section style={group}><h3>English: etusivun pääviesti ja yhteydenotto</h3>
      <Field title="EN hero heading" value={content.heroEn.title} change={title => onChange({ ...content, heroEn: { ...content.heroEn, title } })} />
      <Field title="EN hero introduction" lines={3} value={content.heroEn.lead} change={lead => onChange({ ...content, heroEn: { ...content.heroEn, lead } })} />
      <Field title="EN contact heading" value={content.contactEn.title} change={title => onChange({ ...content, contactEn: { ...content.contactEn, title } })} />
      <Field title="EN contact body" lines={3} value={content.contactEn.body} change={body => onChange({ ...content, contactEn: { ...content.contactEn, body } })} />
    </section>
  </section>;
}

export function TechnicalContentEditor({ content, onChange }: { content: SiteContent; onChange: (next: SiteContent) => void }) {
  function update(locale: "fi" | "en", copy: TechnicalPageCopy) {
    onChange({ ...content, technicalPage: { ...content.technicalPage, [locale]: copy } });
  }
  return <section>
    <h2>Talotekniikan rakennuttaminen ja valvonta — sivusisältö</h2>
    {locales.map(({ code, label }) => {
      const copy = content.technicalPage[code];
      const set = (patch: Partial<TechnicalPageCopy>) => update(code, { ...copy, ...patch });
      return <section style={group} key={code}>
        <h3>{label}</h3>
        <Field title="Pääotsikko" lines={2} value={copy.title} change={title => set({ title })} />
        <Field title="Johdantoteksti" lines={4} value={copy.lead} change={lead => set({ lead })} />
        {copy.phases.map((phase, index) => <fieldset style={group} key={index}><legend>Hankevaihe {index + 1}</legend>
          <Field title="Numero" value={phase.number} change={number => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, number } : p) })} />
          <Field title="Vaiheen nimi" value={phase.title} change={title => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, title } : p) })} />
          <Field title="Tehtävät, yksi rivi per kohta" lines={5} value={phase.items.join("\n")}
            change={v => set({ phases: copy.phases.map((p, i) => i === index ? { ...p, items: v.split("\n").map(t => t.trim()).filter(Boolean) } : p) })} />
        </fieldset>)}
        <Field title="Valvontaosion otsikko" lines={3} value={copy.supervisionTitle} change={supervisionTitle => set({ supervisionTitle })} />
        <Field title="Valvontaosion kuvaus" lines={4} value={copy.supervisionLead} change={supervisionLead => set({ supervisionLead })} />
        <Field title="Tarjouspyyntöosion otsikko" value={copy.contactTitle} change={contactTitle => set({ contactTitle })} />
        <Field title="Tarjouspyyntöosion kuvaus" lines={3} value={copy.contactLead} change={contactLead => set({ contactLead })} />
      </section>;
    })}
  </section>;
}

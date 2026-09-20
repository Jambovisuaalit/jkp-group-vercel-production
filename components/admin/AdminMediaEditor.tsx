"use client";
import { useState } from "react";
import type { SiteContent } from "@/content/defaults";

type Media = SiteContent["media"];
type Slot = { key: string; label: string; value: string; update: (url: string) => Media };

export function AdminMediaEditor({
  scope, media, onChange, upload,
}: {
  scope: "home" | "tech" | "company" | "contact";
  media: Media;
  onChange: (media: Media) => void;
  upload: (file: File, folder: string) => Promise<string>;
}) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const slots: Slot[] = [];
  if (scope === "home") {
    (["Rakennuttamispalvelun kuva", "Valvontapalvelun kuva", "Vuokrauspalvelun kuva"] as const)
      .forEach((label, index) => slots.push({
        key: "service-" + index, label, value: media.serviceImages[index] || "",
        update: url => {
          const serviceImages = [...media.serviceImages];
          serviceImages[index] = url;
          return { ...media, serviceImages };
        },
      }));
    slots.push({
      key: "rental", label: "Asiakkaan vuokrakohdekuva (molemmat paikat ja EN)",
      value: media.rentalImageUrl,
      update: url => ({ ...media, rentalImageUrl: url }),
    });
    Array.from({ length: 9 }, (_, index) => index).forEach(index => slots.push({
      key: "reference-" + index, label: "Etusivun referenssikuva " + (index + 1),
      value: media.referenceImages[index] || "",
      update: url => {
        const referenceImages = [...media.referenceImages];
        referenceImages[index] = url;
        return { ...media, referenceImages };
      },
    }));
  }
  if (scope === "company") slots.push({
    key: "company", label: "Yritys-sivun kuvituskuva",
    value: media.companyImageUrl,
    update: url => ({ ...media, companyImageUrl: url }),
  });
  if (scope === "tech") slots.push({
    key: "technical", label: "Talotekniikan yläosan esimerkkikuva",
    value: media.technicalImageUrl, update: url => ({ ...media, technicalImageUrl: url }),
  });
  if (scope === "contact") slots.push({
    key: "contact", label: "Yhteystietojen henkilö- tai yrityskuva",
    value: media.contactImageUrl, update: url => ({ ...media, contactImageUrl: url }),
  });

  return <section className="admin-media-editor">
    <h2>{scope === "tech" ? "Talotekniikan kuva" : scope === "company" ? "Yritys-sivun kuva" : scope === "contact" ? "Yhteystietojen kuva" : "Etusivun vaihdettavat kuvat"}</h2>
    <p>Valitse asiakkaan hyväksymä JPEG-, PNG- tai WebP-kuva. Lataa kuva, ja paina sen jälkeen sivun Tallenna muutokset -painiketta.</p>
    <div className="admin-media-grid">
      {slots.map(slot => <div className="admin-media-field" key={slot.key}>
        <strong>{slot.label}</strong>
        {slot.value ? <img src={slot.value} alt={"Nykyinen kuva: " + slot.label} loading="lazy" /> : <span className="admin-media-empty">Kuvaa ei ole vielä lisätty.</span>}
        <label className="admin-media-button">
          {busy === slot.key ? "Ladataan…" : "Vaihda kuva"}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(busy)} onChange={event => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            event.currentTarget.value = "";
            setBusy(slot.key);
            setMessage("");
            void upload(file, "customer-images").then(url => {
              onChange(slot.update(url));
              setMessage("Kuva ladattu. Tallenna muutokset julkaistaksesi sen.");
            }).catch(error => setMessage(error instanceof Error ? error.message : "Kuvan lataus epäonnistui."))
              .finally(() => setBusy(""));
          }} />
        </label>
        {slot.value && <button type="button" className="admin-media-remove" onClick={() => onChange(slot.update(""))}>Poista kuva</button>}
      </div>)}
    </div>
    {message && <p role="status">{message}</p>}
  </section>;
}

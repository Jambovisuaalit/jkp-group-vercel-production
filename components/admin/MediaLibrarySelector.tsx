"use client";
import { useState } from "react";

type LibraryImage = { name: string; url: string; path: string; source: "default" | "uploaded" };

export function MediaLibrarySelector({ onSelect, label = "Valitse mediakirjastosta" }: {
  onSelect: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [error, setError] = useState("");
  async function showLibrary() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      if (!response.ok) throw new Error("Mediakirjaston avaaminen epäonnistui.");
      const payload = await response.json() as { items?: LibraryImage[] };
      setItems(payload.items || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Mediakirjastoa ei voitu avata.");
    } finally {
      setLoading(false);
    }
  }
  return <div style={{ marginTop: 10 }}>
    <button type="button" onClick={() => void showLibrary()} aria-expanded={open}>{open ? "Sulje mediakirjasto" : label}</button>
    {open ? <div style={{ padding: 14, marginTop: 10, border: "1px solid #dbe6ec", background: "#fff" }}>
      {loading ? <p>Haetaan kuvia…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!loading && !error && !items.length ? <p>Kirjastossa ei ole vielä kuvia.</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12, maxHeight: 430, overflowY: "auto" }}>
        {items.map(item => <button type="button" key={item.path}
          aria-label={"Käytä kuvaa " + item.name}
          style={{ minWidth: 0, padding: 6, border: "1px solid #dbe6ec", background: "#fff", cursor: "pointer" }}
          onClick={() => { onSelect(item.url); setOpen(false); }}>
          <img src={item.url} alt="" loading="lazy" style={{ width: "100%", height: 90, objectFit: "cover", display: "block", background: "#f3f7fa" }} />
          <small style={{ display: "block", overflowWrap: "anywhere", marginTop: 6 }}>{item.name}</small>
        </button>)}
      </div>
    </div> : null}
  </div>;
}

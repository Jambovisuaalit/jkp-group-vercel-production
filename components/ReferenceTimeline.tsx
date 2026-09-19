import { clientReferences } from "@/content/client-references";

export function ReferenceTimeline({ locale = "fi" }: { locale?: "fi" | "en" }) {
  const en = locale === "en";
  return (
    <div className="shell client-reference-list">
      {clientReferences.map((item) => (
        <article className="client-reference" key={item.period + item.client}>
          <div className="client-reference-period">{item.period}</div>
          <div className="client-reference-main">
            <h2>{item.client}</h2>
            {item.project && <p className="client-reference-project">{item.project}</p>}
            <p className="client-reference-role">{item.role}</p>
            {item.scope && <p>{item.scope}</p>}
            {item.areas?.length ? (
              <details className="client-reference-areas">
                <summary>{en ? "Responsibility areas" : "Vastuualueet"} ({item.areas.length})</summary>
                <ul>{item.areas.map((area) => <li key={area}>{area}</li>)}</ul>
              </details>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

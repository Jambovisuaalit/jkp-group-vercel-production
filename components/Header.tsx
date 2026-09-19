import Link from "next/link";

export function Header({ email, variant = "light", locale = "fi" }: { email: string; variant?: "dark" | "light"; locale?: "fi" | "en" }) {
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  return (
    <header className={`site-header ${variant === "light" ? "site-header-light" : ""}`}>
      <div className="shell nav-shell">
        <Link className="brand" href={prefix || "/"} aria-label="JKP Group Oy home">
          <span className="brand-mark" aria-hidden="true">JKP</span>
          <span className="brand-copy">
            <strong>JKP Group Oy</strong>
            <small>{en ? "Building Services · Properties" : "Talotekniikka · Kiinteistöt"}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={en ? "Main navigation" : "Päänavigaatio"}>
          <Link href={prefix || "/"}>{en ? "Home" : "Etusivu"}</Link>
          <Link href={`${prefix}/yritys`}>{en ? "Company" : "Yritys"}</Link>
          <Link href={`${prefix}/talotekniikka`}>{en ? "Services" : "Palvelut"}</Link>
          <Link href={`${prefix}/vuokraus`}>{en ? "Properties" : "Vuokraus"}</Link>
          <Link href={`${prefix}/referenssit`}>{en ? "References" : "Referenssit"}</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="language-switcher" aria-label="Language">
            <Link href="/" aria-current={!en ? "page" : undefined}>FI</Link>
            <span aria-hidden="true">/</span>
            <Link href="/en" aria-current={en ? "page" : undefined}>EN</Link>
          </div>
          <a className="button button-small header-contact" href={en ? "/en#contact" : "/#yhteys"}>
            {en ? "Contact" : "Ota yhteyttä"}
          </a>
        </div>
      </div>
    </header>
  );
}

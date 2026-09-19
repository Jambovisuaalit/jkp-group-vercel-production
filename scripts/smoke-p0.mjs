import assert from "node:assert/strict";
const base = process.env.JKP_BASE_URL || "http://127.0.0.1:3100";
const get = async path => {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path + " is not HTTP 200");
  return response.text();
};
for (const path of ["/tietosuoja", "/en/privacy", "/yritys", "/en/yritys", "/talotekniikka", "/en/talotekniikka"]) {
  const html = await get(path);
  assert.match(html, /<h1/, "Missing H1 at " + path);
  assert.match(html, /class="site-header/, "Header missing at " + path);
}
for (const path of ["/vuokraus", "/en/vuokraus"]) {
  const html = await get(path);
  assert.equal((html.match(/<form\s+class="contact-form"/g) || []).length, 2, path + " must contain two forms");
  assert.match(html, /name="privacyConsent"/, path + " privacy checkbox missing");
}
const fi = await get("/talotekniikka");
for (const phrase of ["Suunnittelijoiden ja urakoitsijoiden valinta ja ohjaus", "LVI-valvonta", "Talotekniikan asennusvalvonta", "Vastaan- ja käyttöönottoon liittyvät tehtävät"]) {
  assert.ok(fi.includes(phrase), "Customer correction not found: " + phrase);
}
const response = await fetch(base + "/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "QA (no delivery)", email: "qa@example.invalid", message: "This is a local non-production fail-closed test.",
    privacyConsent: "Hyväksytty", startedAt: Date.now() - 8000,
  }),
});
assert.equal(response.status, 503, "Static QA must fail closed without sending a form");
console.log("JKP_P0_SUMMARY=" + JSON.stringify({passed:true,privacy:2,forms:4,customerCopy:true,staticApi:503}));

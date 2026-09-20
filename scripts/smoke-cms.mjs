import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = process.env.JKP_BASE_URL || "http://127.0.0.1:3100";
const use = [
  ["app/page.tsx", ["content.hero.title", "content.hero.lead", "content.hero.imageUrl", "HomeSections content={content}"]],
  ["app/en/page.tsx", ["content.heroEn.title", "content.heroEn.lead", "content.contactEn"]],
  ["components/HomeSections.tsx", ["content.homeCopy.fi", "content.homeCopy.en", "content.media.serviceImages", "content.media.referenceImages"]],
  ["app/yritys/page.tsx", ["content.companyPage.fi.title", "content.companyPage.fi.intro", "content.companyPage.fi.history"]],
  ["app/en/yritys/page.tsx", ["content.companyPage.en.title", "content.companyPage.en.intro", "content.companyPage.en.history"]],
  ["app/talotekniikka/page.tsx", ["content.technicalPage.fi.title", "content.technicalPage.fi.phases"]],
  ["app/en/talotekniikka/page.tsx", ["content.technicalPage.en.title", "content.technicalPage.en.phases"]],
  ["app/lvia-valvonta/page.tsx", ["content.lviaPage.fi.title", "content.lviaPage.fi.phases"]],
  ["app/en/lvia-valvonta/page.tsx", ["content.lviaPage.en.title", "content.lviaPage.en.phases"]],
  ["app/vuokraus/page.tsx", ["content.rental.title", "content.rental.lead", "getPublishedRentals()"]],
  ["app/en/vuokraus/page.tsx", ["content.rentalEn.title", "content.rentalEn.lead", "getPublishedRentals()"]],
  ["app/referenssit/page.tsx", ["items={content.references}"]],
  ["app/en/referenssit/page.tsx", ["items={content.references}"]],
];
for (const [file, fields] of use) {
  const code = await readFile(file, "utf8");
  assert.ok(code.includes('export const dynamic = "force-dynamic"') || file.startsWith("components/"), file + " must use dynamic server rendering");
  for (const field of fields) assert.ok(code.includes(field), file + " bypasses CMS field: " + field);
}
const admin = await readFile("components/admin/AdminDashboard.tsx", "utf8");
for (const editor of ["CompanyContentEditor", "HomeCopyEditor", "TechnicalContentEditor", "LviaContentEditor", "RentalCopyEditor", "AdminMediaEditor", "MediaLibrarySelector"]) {
  assert.ok(admin.includes(editor), "Admin editor missing: " + editor);
}
assert.ok(!admin.includes('references.map((item) => <button className={styles.referenceCard}'), "Legacy reference database remains in visible public reference editor");

const pages = [
  ["/", ["Toimivaa talotekniikkaa vuodesta 1993", "TALOTEKNIIKAN RAKENNUTTAMIS"]],
  ["/en", ["Functional building services since 1993", "BUILDING SERVICES PROJECT"]],
  ["/yritys", ["Palvelua vuosien kokemuksella", "1990-luku", "2016 ja sen jälkeen"]],
  ["/en/yritys", ["Service backed by years of experience", "Origins", "2016 onwards"]],
  ["/talotekniikka", ["Suunnittelijoiden ja urakoitsijoiden valinta ja ohjaus"]],
  ["/en/talotekniikka", ["Selection and management of designers and contractors"]],
  ["/lvia-valvonta", ["Suunnitelmat ja toteutettavuus", "Vastaanotto ja takuuaika"]],
  ["/en/lvia-valvonta", ["Design review and feasibility", "Handover and warranty period"]],
  ["/vuokraus", ["Liike- ja toimitiloja, asuntoja sekä loma-asuntoja"]],
  ["/en/vuokraus", ["Commercial premises, apartments and holiday properties"]],
  ["/referenssit", ["GOOGLE Oy", "FIMPEC"]],
  ["/en/referenssit", ["GOOGLE Oy", "FIMPEC"]],
];
for (const [route, terms] of pages) {
  const res = await fetch(base + route);
  assert.equal(res.status, 200, route + " failed");
  const html = await res.text();
  for (const text of terms) assert.ok(html.includes(text), route + " missing CMS default " + text);
}
// This test only checks read paths and access control without an admin login.
// Actual Supabase write/read/restore and Resend delivery remain separate gates.
for (const route of ["/api/admin/content", "/api/admin/media"]) {
  const res = await fetch(base + route);
  assert.equal(res.status, 401, route + " must not disclose data without admin authentication");
}
const write = await fetch(base + "/api/admin/content", {
  method: "PUT", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ hero: { title: "Unauthorized QA write" } }),
});
assert.equal(write.status, 401, "Anonymous admin write must be denied");
console.log("JKP_CMS_STATIC_SUMMARY=" + JSON.stringify({ passed: true, pages: pages.length, bindings: use.length, authenticatedWriteTest: "not run", productionWriteTest: "not run" }));

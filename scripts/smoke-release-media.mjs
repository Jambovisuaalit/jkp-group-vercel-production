import assert from "node:assert/strict";

const base = (process.env.JKP_BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const photoNames = Array.from({ length: 9 }, (_, i) => "/images/jkp-pdf-reference-" + String(i + 1).padStart(2, "0") + ".jpg");
const servicePhotos = [photoNames[0], photoNames[5], "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg"];

for (const path of [...photoNames, "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg", "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path + " image missing");
  assert.match(response.headers.get("content-type") || "", /image\/jpeg/, path + " wrong mime");
}
for (const locale of ["fi", "en"]) {
  const home = await fetch(base + (locale === "fi" ? "/" : "/en"));
  assert.equal(home.status, 200);
  const html = await home.text();
  for (const src of servicePhotos) {
    assert.ok(html.includes(src), locale + " missing service photo " + src);
  }
  assert.ok(html.includes('class="home-reference-gallery"'), locale + " approved gallery missing");
  assert.ok(!html.includes("home-reference-empty"), locale + " still shows pending approval");
  for (const src of photoNames) assert.ok(html.includes(src), locale + " missing approved photo " + src);
  assert.ok(!html.includes("home-contact-image"), locale + " contact section must have no image");
  assert.ok(!html.includes("DSC05408"), locale + " unconfirmed asset exposed");
  assert.ok(!/1992|1995|1993-05-12/.test(html), locale + " unconfirmed founding date");
  assert.ok(!html.includes("home-image-placeholder"), locale + " shows service placeholders");
  assert.ok(html.includes("home-service-grid"), locale + " service grid not rendered");
  const page = await fetch(base + (locale === "fi" ? "/yritys" : "/en/yritys"));
  assert.equal(page.status, 200);
  const company = await page.text();
  const expected = locale === "fi"
    ? ["1993", "LVI-insinööritoimisto Mikroplast Oy", "1990-luku", "2000-luku", "2010-luku", "Fimpec Talotekniikka Oy"]
    : ["1993", "LVI-insinööritoimisto Mikroplast Oy", "1990s", "2000s", "2010s", "Fimpec Talotekniikka Oy"];
  expected.forEach(term => assert.ok(company.includes(term), locale + " company text missing " + term));
}
console.log("JKP_RELEASE_MEDIA_SUMMARY=" + JSON.stringify({ passed: true, imageFiles: 11, galleryImages: 9, serviceImages: 3, companyPages: 2 }));

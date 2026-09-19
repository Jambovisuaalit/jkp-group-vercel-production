import assert from "node:assert/strict";

const base = (process.env.JKP_BASE_URL || "https://www.jkpgroup.fi").replace(/\\/$/, "");
const routes = ["", "/yritys", "/talotekniikka", "/lvia-valvonta", "/vuokraus", "/referenssit"];
const origin = "https://www.jkpgroup.fi";
const findings = [];

function attr(tag, name) {
  return tag.match(new RegExp(name + '="([^"]*)"'))?.[1] ?? null;
}

for (const route of routes) {
  const fi = origin + route;
  const en = origin + "/en" + route;
  for (const [locale, path, expectedCanonical, expectedOg] of [
    ["fi", route, fi, "fi_FI"],
    ["en", "/en" + route, en, "en_GB"],
  ]) {
    const url = base + path;
    const response = await fetch(url, { redirect: "follow" });
    assert.equal(response.status, 200, url + " returned non-200");
    const html = await response.text();
    const normalize = value => value?.replace(/\\/$/, "") ?? value;
    const canonicals = [...html.matchAll(/<link\\b[^>]*rel="canonical"[^>]*>/gi)].map(m => attr(m[0], "href"));
    assert.equal(canonicals.length, 1, url + " must have exactly one canonical");
    assert.equal(normalize(canonicals[0]), normalize(expectedCanonical), url + " wrong canonical");
    const ogTags = [...html.matchAll(/<meta\\b[^>]*property="og:locale"[^>]*>/gi)];
    assert.equal(ogTags.length, 1, url + " must have one og:locale");
    assert.equal(attr(ogTags[0][0], "content"), expectedOg, url + " wrong og:locale");
    const languages = Object.fromEntries([...html.matchAll(/<link\\b[^>]*rel="alternate"[^>]*>/gi)]
      .map(m => [attr(m[0], "hrefLang") || attr(m[0], "hreflang"), attr(m[0], "href")]));
    assert.equal(normalize(languages.fi), normalize(fi), url + " wrong fi hreflang");
    assert.equal(normalize(languages.en), normalize(en), url + " wrong en hreflang");
    assert.match(html, /<meta\\b[^>]*name="robots"[^>]*content="index, follow"[^>]*>/i, url + " unexpectedly noindex");
    findings.push({ path, canonical: canonicals[0], ogLocale: expectedOg, hreflang: languages });
    console.log("PASS " + JSON.stringify(findings.at(-1)));
  }
}
console.log("JKP_SEO_SUMMARY=" + JSON.stringify({ passed: true, pages: findings.length, pairs: routes.length }));

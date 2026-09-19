import assert from "node:assert/strict";

const base = (process.env.JKP_BASE_URL || "https://www.jkpgroup.fi").replace(/\/$/, "");
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
    assert.match(html, new RegExp(`<html\\s+lang="${locale}"`), url + " wrong HTML language");
    const normalize = value => value?.replace(/\/$/, "") ?? value;
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/gi)].map(m => attr(m[0], "href"));
    assert.equal(canonicals.length, 1, url + " must have exactly one canonical");
    assert.equal(normalize(canonicals[0]), normalize(expectedCanonical), url + " wrong canonical");
    const ogTags = [...html.matchAll(/<meta\b[^>]*property="og:locale"[^>]*>/gi)];
    assert.equal(ogTags.length, 1, url + " must have one og:locale");
    assert.equal(attr(ogTags[0][0], "content"), expectedOg, url + " wrong og:locale");
    const languages = Object.fromEntries([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)]
      .map(m => [attr(m[0], "hrefLang") || attr(m[0], "hreflang"), attr(m[0], "href")]));
    assert.equal(normalize(languages.fi), normalize(fi), url + " wrong fi hreflang");
    assert.equal(normalize(languages.en), normalize(en), url + " wrong en hreflang");
    assert.match(html, /<meta\b[^>]*name="robots"[^>]*content="index, follow"[^>]*>/i, url + " unexpectedly noindex");
    findings.push({ path, canonical: canonicals[0], ogLocale: expectedOg, hreflang: languages });
    console.log("PASS " + JSON.stringify(findings.at(-1)));
  }
}

// Legal-notice pages use asymmetric FI/EN slugs but reciprocal hreflang.
for (const [locale, path, canonical, alternate] of [
  ["fi", "/tietosuoja", origin + "/tietosuoja", origin + "/en/privacy"],
  ["en", "/en/privacy", origin + "/en/privacy", origin + "/tietosuoja"],
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path + " must return 200");
  const html = await response.text();
  assert.ok(html.includes('<html lang="' + locale + '"'), path + " HTML language incorrect");
  assert.ok(html.includes('<link rel="canonical" href="' + canonical + '"'), path + " canonical incorrect");
  assert.ok(html.includes('hrefLang="' + (locale === "fi" ? "en" : "fi") + '" href="' + alternate + '"'), path + " reciprocal hreflang absent");
  assert.ok(html.includes('property="og:locale" content="' + (locale === "fi" ? "fi_FI" : "en_GB") + '"'), path + " Open Graph locale incorrect");
}

console.log("JKP_SEO_SUMMARY=" + JSON.stringify({ passed: true, pages: findings.length, pairs: routes.length }));

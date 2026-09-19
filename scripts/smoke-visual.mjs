import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.JKP_BASE_URL || "https://www.jkpgroup.fi";
const output = "qa-screenshots";
const sizes = [{ width: 390, height: 844 }, { width: 1200, height: 750 }, { width: 1440, height: 900 }];
const paths = ["/", "/yritys", "/lvia-valvonta", "/vuokraus", "/referenssit"];
const rentalImage = "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg";
const expectedReferences = ["GOOGLE Oy", "HELEN Oy", "UPM BIOCHEMICALS GmbH", "METSÄ FIBRE OY", "AGNICO EAGLE", "LAHTI ENERGY", "FINAVIA", "FIMPEC"];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const errors = [];
const results = [];

try {
  for (const size of sizes) {
    const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1, reducedMotion: "reduce" });
    for (const route of paths) {
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      let result = { route, viewport: size.width };
      try {
        const response = await page.goto(base + route, { waitUntil: "networkidle", timeout: 90000 });
        const state = await page.evaluate(({route, rentalImage, expectedReferences}) => {
          const header = document.querySelector("header");
          const hero = document.querySelector(".hero, .subhero");
          const h1 = document.querySelector("h1");
          const all = [...document.querySelectorAll("img")];
          const photos = all.filter((im) => new URL(im.src).pathname === rentalImage);
          const bg = (el) => el ? getComputedStyle(el).backgroundColor : null;
          const bodyBackground = bg(document.body);
          const heroPhoto = hero ? getComputedStyle(hero).backgroundImage.includes("jkp-teollisuus-hero-asiakkaan-kuva.jpeg") : false;
          const headlineFont = h1 ? getComputedStyle(h1).fontFamily : "";
          const headerBackground = bg(header);
          const heroBackground = bg(hero);
          const documentWidth = document.documentElement.scrollWidth;
          const viewportWidth = window.innerWidth;
          return {
            bodyBackground, headerBackground, heroBackground, heroPhoto, headlineFont,
            heroButtonCount: document.querySelectorAll(".client-home-actions .button").length,
            documentWidth, viewportWidth,
            title: document.title, h1: h1?.textContent?.trim() || "",
            images: all.map((im) => ({ src: im.currentSrc, loaded: im.complete && im.naturalWidth > 0, width: im.naturalWidth, height: im.naturalHeight })),
            rentalPhotos: photos.map((im) => ({ loaded: im.complete && im.naturalWidth > 0, width: im.naturalWidth, height: im.naturalHeight })),
            oldReferenceCount: document.body.innerText.includes("Kiipulasäätiö") ? 1 : 0,
            referencesPresent: route === "/referenssit" ? expectedReferences.map((s) => document.body.innerText.includes(s)) : [],
            lviaPhases: route === "/lvia-valvonta" ? document.querySelectorAll(".lvia-phase").length : 0,
          };
        }, { route, rentalImage, expectedReferences });
        result = { ...result, status: response?.status() ?? null, ...state, pageErrors };
        await page.screenshot({ path: path.join(output, (route === "/" ? "home" : route.slice(1)) + "-" + size.width + ".png"), fullPage: false });
        if (result.status !== 200) errors.push(route + " " + size.width + ": status " + result.status);
        if (result.documentWidth > result.viewportWidth + 1) errors.push(route + " " + size.width + ": horizontal overflow " + result.documentWidth + " > " + result.viewportWidth);
        if (!result.h1) errors.push(route + " " + size.width + ": missing H1");
        if (result.headerBackground !== "rgb(255, 255, 255)") errors.push(route + " " + size.width + ": header not white: " + result.headerBackground);
        if (result.heroBackground !== "rgb(255, 255, 255)") errors.push(route + " " + size.width + ": hero not white: " + result.heroBackground);
        if (pageErrors.length) errors.push(route + " " + size.width + ": page errors " + pageErrors.join("; "));
        if (route === "/" && (!result.heroPhoto || result.heroButtonCount !== 2 || /Georgia|Times/i.test(result.headlineFont))) {
          errors.push(route + " " + size.width + ": screenshot-based photo hero, two CTAs or sans-serif typography missing");
        }
        if (route === "/vuokraus" && (result.rentalPhotos.length !== 2 || result.rentalPhotos.some((p) => !p.loaded || p.width < 1200))) {
          errors.push(route + " " + size.width + ": expected two loaded original customer photos at >=1200px");
        }
        if (route === "/referenssit" && (result.oldReferenceCount || result.referencesPresent.some((v) => !v))) {
          errors.push(route + " " + size.width + ": reference list mismatch");
        }
        if (route === "/lvia-valvonta" && result.lviaPhases !== 4) {
          errors.push(route + " " + size.width + ": expected 4 LVIA phases");
        }
      } catch (error) {
        errors.push(route + " " + size.width + ": " + error.message);
        result = { ...result, error: error.message };
      }
      results.push(result);
      console.log(JSON.stringify(result));
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log("JKP_390_1440_SUMMARY=" + JSON.stringify({ passed: errors.length === 0, checks: results.length, errors }));
if (errors.length) process.exitCode = 1;

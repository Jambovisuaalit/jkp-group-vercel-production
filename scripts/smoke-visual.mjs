import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.JKP_BASE_URL || "https://www.jkpgroup.fi";
const output = "qa-screenshots";
const sizes = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1200, height: 750 }, { width: 1440, height: 900 }];
const paths = ["/", "/yritys", "/talotekniikka", "/lvia-valvonta", "/vuokraus", "/referenssit", "/en", "/en/yritys", "/en/talotekniikka", "/en/lvia-valvonta", "/en/vuokraus", "/en/referenssit"];
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
          const hero = document.querySelector(".hero, .subhero, .company-intro");
          const h1 = document.querySelector("h1");
          const all = [...document.querySelectorAll("img")];
          const photos = all.filter((im) => new URL(im.src).pathname === rentalImage);
          const serviceImages = [...document.querySelectorAll(".home-service-tile > img")];
          const contactLinks = [...document.querySelectorAll(".home-contact-details .contact-email")];
          const heroOverlay = hero?.matches(".client-home-hero") ? getComputedStyle(hero, "::before").backgroundColor : "";
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
            forms: document.querySelectorAll("main form.contact-form").length,
            services: document.querySelectorAll(".home-service-tile").length,
            hasDropdown: Boolean(document.querySelector(".service-menu summary")),
            documentWidth, viewportWidth,
            title: document.title, h1: h1?.textContent?.trim() || "",
            images: all.map((im) => ({ src: im.currentSrc, loaded: im.complete && im.naturalWidth > 0, width: im.naturalWidth, height: im.naturalHeight })),
            rentalPhotos: photos.map((im) => ({ loaded: im.complete && im.naturalWidth > 0, width: im.naturalWidth, height: im.naturalHeight })),
            servicePhotos: serviceImages.map((im) => ({ src: im.getAttribute("src"), loaded: im.complete && im.naturalWidth > 0 })),
            servicePlaceholders: document.querySelectorAll(".home-image-placeholder").length,
            referenceGalleryPhotos: document.querySelectorAll(".home-reference-gallery img").length,
            heroOverlay,
            separatedContactLinks: contactLinks.length === 2 && contactLinks[1].getBoundingClientRect().top > contactLinks[0].getBoundingClientRect().bottom,
            oldReferenceCount: document.body.innerText.includes("Kiipulasäätiö") ? 1 : 0,
            referencesPresent: route.endsWith("/referenssit") ? expectedReferences.map((s) => document.body.innerText.includes(s)) : [],
            lviaPhases: (route === "/lvia-valvonta" || route === "/en/lvia-valvonta") ? document.querySelectorAll(".lvia-phase").length : 0,
          };
        }, { route, rentalImage, expectedReferences });
        result = { ...result, status: response?.status() ?? null, ...state, pageErrors };
        await page.screenshot({ path: path.join(output, (route === "/" ? "home" : route.slice(1)) + "-" + size.width + ".png"), fullPage: false });
        if (result.status !== 200) errors.push(route + " " + size.width + ": status " + result.status);
        if (!result.hasDropdown) errors.push(route + " " + size.width + ": service dropdown missing");
        if ((route === "/vuokraus" || route === "/en/vuokraus") && result.forms !== 2) {
          errors.push(route + " " + size.width + ": commercial and apartment forms must both exist");
        }
        if (route === "/talotekniikka" && !(await page.locator("main").innerText()).includes("Suunnittelijoiden ja urakoitsijoiden valinta ja ohjaus")) {
          errors.push(route + " " + size.width + ": customer red-marked HVAC copy missing");
        }
        if (route === "/referenssit" && !result.referencesPresent.every(Boolean)) errors.push(route + " " + size.width + ": customer project references missing");
        if (route === "/" && result.services !== 3) errors.push(route + " " + size.width + ": customer service image cards missing");
        if (route === "/" || route === "/en") {
          if (result.servicePhotos.length !== 3 || result.servicePhotos.some(p => !p.loaded) || result.servicePlaceholders) {
            errors.push(route + " " + size.width + ": 3 approved service images must load without placeholders");
          }
          if (result.referenceGalleryPhotos !== 0) errors.push(route + " " + size.width + ": unapproved reference gallery exposed");
          if (!result.separatedContactLinks) errors.push(route + " " + size.width + ": email and phone must be on separate lines");
          const expectedOverlay = size.width <= 640 ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.62)";
          if (result.heroOverlay !== expectedOverlay) errors.push(route + " " + size.width + ": unexpected hero overlay " + result.heroOverlay);
        }
        if ((route === "/" || route === "/en") && (size.width === 390 || size.width === 1440)) {
          const menu = page.locator(".service-menu summary");
          await menu.click();
          const optionCount = await page.locator(".service-menu-options a:visible").count();
          if (optionCount !== 3) errors.push(route + " " + size.width + ": dropdown must expose 3 options, got " + optionCount);
          const widthWithMenu = await page.evaluate(() => document.documentElement.scrollWidth);
          if (widthWithMenu > size.width + 1) errors.push(route + " " + size.width + ": dropdown horizontal overflow");
          await menu.click();
        }
        if (result.documentWidth > result.viewportWidth + 1) errors.push(route + " " + size.width + ": horizontal overflow " + result.documentWidth + " > " + result.viewportWidth);
        if (!result.h1) errors.push(route + " " + size.width + ": missing H1");
        if (result.headerBackground !== "rgb(255, 255, 255)") errors.push(route + " " + size.width + ": header not white: " + result.headerBackground);
        if (result.heroBackground !== "rgb(255, 255, 255)") errors.push(route + " " + size.width + ": hero not white: " + result.heroBackground);
        if (pageErrors.length) errors.push(route + " " + size.width + ": page errors " + pageErrors.join("; "));
        if ((route === "/" || route === "/en") && (!result.heroPhoto || result.heroButtonCount !== 2 || result.services !== 3 || /Georgia|Times/i.test(result.headlineFont))) {
          errors.push(route + " " + size.width + ": screenshot-based photo hero, two CTAs or sans-serif typography missing");
        }
        if (route === "/vuokraus" && (result.rentalPhotos.length !== 2 || result.rentalPhotos.some((p) => !p.loaded || p.width < 1200))) {
          errors.push(route + " " + size.width + ": expected two loaded original customer photos at >=1200px");
        }
        if ((route === "/referenssit" || route === "/en/referenssit") && (result.oldReferenceCount || result.referencesPresent.some((v) => !v))) {
          errors.push(route + " " + size.width + ": reference list mismatch");
        }
        if ((route === "/lvia-valvonta" || route === "/en/lvia-valvonta") && result.lviaPhases !== 4) {
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

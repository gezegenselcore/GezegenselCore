/**
 * Mobil düzen ölçümü + #apps bölümü PNG (Playwright).
 * Kullanım: npx playwright install chromium
 *          node tools/mobile-layout-snapshot.mjs [url]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const outDir = path.join(ROOT, "tools", "_layout-verify");
const url = process.argv[2] || "https://gezegenselcore.com/tr/index.html";
const slug = url.replace(/^https?:\/\//, "").replace(/[^\w.-]+/g, "_");

import { chromium } from "playwright";

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
await new Promise((r) => setTimeout(r, 800));
await page.locator("#apps").scrollIntoViewIfNeeded();
await new Promise((r) => setTimeout(r, 400));

const metrics = await page.evaluate(() => {
  const apps = document.querySelector("#apps");
  const h2 = apps?.querySelector("h2");
  const card = apps?.querySelector(".gc-app-card");
  const hr = apps?.querySelector("hr.star-primary");
  const nav = document.querySelector(".gc-navbar-head-cluster");
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), height: Math.round(b.height) };
  };
  let gapH2Card = null;
  let gapHrCard = null;
  if (h2 && card) {
    const a = h2.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    gapH2Card = Math.round(c.top - a.bottom);
  }
  if (hr && card) {
    const h = hr.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    gapHrCard = Math.round(c.top - h.bottom);
  }
  let hrLayout = null;
  if (hr) {
    const s = getComputedStyle(hr);
    const as = getComputedStyle(hr, "::after");
    hrLayout = {
      hrHeight: s.height,
      hrLineHeight: s.lineHeight,
      afterPosition: as.position,
      afterDisplay: as.display,
      afterFontSize: as.fontSize,
    };
  }
  return {
    scrollY: Math.round(window.scrollY),
    gapH2CardPx: gapH2Card,
    gapHrCardPx: gapHrCard,
    hrBox: r(hr),
    h2Box: r(h2),
    cardBox: r(card),
    navCluster: r(nav),
    hrLayout,
  };
});

const appsEl = page.locator("#apps");
const box = await appsEl.boundingBox();
if (box) {
  const pad = 40;
  const y = Math.max(0, Math.min(box.y - pad, 2000));
  const h = Math.min(Math.max(box.height + pad * 2, 120), 844);
  await page.screenshot({
    path: path.join(outDir, `mobile-apps-region__${slug}.png`),
    clip: {
      x: 0,
      y,
      width: Math.min(390, 800),
      height: h,
    },
  });
} else {
  await page.screenshot({
    path: path.join(outDir, `mobile-viewport__${slug}.png`),
    fullPage: false,
  });
}

await browser.close();
console.log(JSON.stringify({ url, metrics }, null, 2));
console.log("PNG:", path.join(outDir, `mobile-apps-region__${slug}.png`));

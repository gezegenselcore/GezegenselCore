/**
 * ReFollow i18n → site (yalnızca okuma; SSOT: ../ReFollow).
 * Gizlilik metni: src/i18n/locales/{tr,en}.json → settings.privacyPolicyContent
 * Destek e-postası: src/config/links.ts → SUPPORT_EMAIL
 *
 * node tools/import-refollow-legal-content.mjs [path/to/ReFollow]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_REFOLLOW = path.join(ROOT, "..", "ReFollow");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkifyEmails(htmlEscaped) {
  return htmlEscaped.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1">$1</a>'
  );
}

function formatPara(text) {
  return `<p>${linkifyEmails(escapeHtml(text).replace(/\n/g, "<br />"))}</p>`;
}

/** Uygulama içi düz metni h3/p HTML'e çevirir. */
export function parsePrivacyPolicyContent(raw) {
  const blocks = String(raw)
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\n+/);
  const sections = [];
  let updatedLabel = null;
  const trail = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");
    const first = lines[0].trim();

    if (/^(Son güncelleme|Last updated)\s*:/i.test(first)) {
      updatedLabel = first;
      if (lines.length > 1) trail.push(lines.slice(1).join("\n").trim());
      continue;
    }

    const numbered = first.match(/^(\d+)\.\s+(.+)$/);
    if (numbered) {
      const title = `${numbered[1]}. ${numbered[2].trim()}`;
      const body = lines.slice(1).join("\n").trim();
      sections.push({ title, paras: body ? [body] : [] });
      continue;
    }

    if (sections.length === 0) {
      sections.push({ title: first, paras: lines.slice(1).join("\n").trim() ? [lines.slice(1).join("\n").trim()] : [] });
      continue;
    }

    if (/^(Bu uygulama|This app is not)/i.test(first)) {
      trail.push(trimmed);
      continue;
    }

    sections[sections.length - 1].paras.push(trimmed);
  }

  return { sections, updatedLabel, trail };
}

function renderLocaleBlock(langClass, h2, parsed) {
  const parts = [`<div class="${langClass} lang-block">`, `      <h2>${escapeHtml(h2)}</h2>`, ``];
  for (const sec of parsed.sections) {
    parts.push(`      <h3>${escapeHtml(sec.title)}</h3>`);
    for (const p of sec.paras) {
      parts.push(`      ${formatPara(p)}`);
    }
    parts.push(``);
  }
  for (const t of parsed.trail) {
    parts.push(`      ${formatPara(t)}`);
  }
  parts.push(`    </div>`);
  return parts.join("\n");
}

function readLocalePrivacy(refollowRoot, localeFile) {
  const p = path.join(refollowRoot, "src", "i18n", "locales", localeFile);
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  const content = json?.settings?.privacyPolicyContent;
  if (!content || typeof content !== "string") {
    throw new Error("Missing settings.privacyPolicyContent in " + p);
  }
  return content;
}

function readSupportEmail(refollowRoot) {
  const p = path.join(refollowRoot, "src", "config", "links.ts");
  const src = fs.readFileSync(p, "utf8");
  const m = src.match(/export\s+const\s+SUPPORT_EMAIL\s*=\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error("SUPPORT_EMAIL not found in " + p);
  return m[1];
}

function patchPrivacyPage(html, trBlock, enBlock, updatedLine) {
  const next = html.replace(
    /<div class="policy-locale-tr lang-block">[\s\S]*?<div class="policy-locale-en lang-block">[\s\S]*?<\/div>\s*<p class="gc-updated">[^<]*<\/p>/,
    `${trBlock}\n\n    ${enBlock}\n\n      <p class="gc-updated">${escapeHtml(updatedLine)}</p>`
  );
  if (next === html) throw new Error("Failed to patch pages/refollow/policies/privacy.html");
  return next;
}

function patchSupportEmails(html, email, updatedLine) {
  return html
    .replace(/support@gezegenselcore\.com/g, email)
    .replace(/gezegenselcore@gmail\.com/g, email)
    .replace(/<p class="gc-updated">[^<]*<\/p>/, `<p class="gc-updated">${escapeHtml(updatedLine)}</p>`);
}

export function importRefollowLegal(refollowRootArg) {
  const refollowRoot = refollowRootArg ? path.resolve(refollowRootArg) : DEFAULT_REFOLLOW;
  if (!fs.existsSync(refollowRoot)) {
    throw new Error("ReFollow repo not found: " + refollowRoot);
  }

  const trRaw = readLocalePrivacy(refollowRoot, "tr.json");
  const enRaw = readLocalePrivacy(refollowRoot, "en.json");
  const email = readSupportEmail(refollowRoot);

  const trParsed = parsePrivacyPolicyContent(trRaw);
  const enParsed = parsePrivacyPolicyContent(enRaw);
  const updatedLine = trParsed.updatedLabel || "Son güncelleme: 12 Temmuz 2026";

  const trBlock = renderLocaleBlock("policy-locale-tr", "Türkçe", trParsed);
  const enBlock = renderLocaleBlock("policy-locale-en", "English", enParsed);

  const privacyPath = path.join(ROOT, "pages", "refollow", "policies", "privacy.html");
  const privacyHtml = fs.readFileSync(privacyPath, "utf8");
  const privacyNext = patchPrivacyPage(privacyHtml, trBlock, enBlock, updatedLine);
  if (privacyNext === privacyHtml) {
    console.log("unchanged pages/refollow/policies/privacy.html");
  } else {
    fs.writeFileSync(privacyPath, privacyNext, "utf8");
    console.log("updated pages/refollow/policies/privacy.html ← ReFollow i18n");
  }

  const supportPath = path.join(ROOT, "pages", "refollow", "policies", "support.html");
  const supportHtml = fs.readFileSync(supportPath, "utf8");
  const supportNext = patchSupportEmails(supportHtml, email, updatedLine);
  if (supportNext === supportHtml) {
    console.log("unchanged pages/refollow/policies/support.html");
  } else {
    fs.writeFileSync(supportPath, supportNext, "utf8");
    console.log("updated pages/refollow/policies/support.html ← SUPPORT_EMAIL " + email);
  }

  return { refollowRoot, email, updatedLine };
}

function main() {
  importRefollowLegal(process.argv[2]);
  console.log("Done. Run: node tools/sync-refollow-policies.mjs");
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) main();

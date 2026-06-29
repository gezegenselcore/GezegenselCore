/**
 * One-shot text rebrand: AURA → Anima across site source files.
 * node tools/rebrand-aura-to-anima.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SKIP_DIRS = new Set(["node_modules", ".git", "assets/freelancer"]);
const EXT = new Set([".html", ".css", ".js", ".mjs", ".md", ".xml", ".txt"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(ent.name).toLowerCase())) out.push(p);
  }
  return out;
}

function transform(content) {
  let s = content;
  // Preserve Play package id and legacy infra
  s = s.replace(/com\.gezegenselcore\.aura/g, "__PKG_AURA__");
  // Paths and identifiers (longer first)
  s = s.replace(/AuraEkranGoruntuleri/g, "AnimaEkranGoruntuleri");
  s = s.replace(/aura-privacy\.master/g, "anima-privacy.master");
  s = s.replace(/aura-terms\.master/g, "anima-terms.master");
  s = s.replace(/aura-support\.master/g, "anima-support.master");
  s = s.replace(/aura-legal-master-shell/g, "anima-legal-master-shell");
  s = s.replace(/import-aura-legal-content/g, "import-anima-legal-content");
  s = s.replace(/sync-aura-legal-content/g, "sync-anima-legal-content");
  s = s.replace(/sync-aura-legal-masters/g, "sync-anima-legal-masters");
  s = s.replace(/migrate-aura-legal-chrome/g, "migrate-anima-legal-chrome");
  s = s.replace(/aura-seo\.mjs/g, "anima-seo.mjs");
  s = s.replace(/aura-legal-pages/g, "anima-legal-pages");
  s = s.replace(/pages\/aura\//g, "pages/anima/");
  s = s.replace(/\/aura\//g, "/anima/");
  s = s.replace(/\btr\/aura\b/g, "tr/anima");
  s = s.replace(/\ben\/aura\b/g, "en/anima");
  s = s.replace(/\bhref="aura\//g, 'href="anima/');
  s = s.replace(/\bhref="\.\.\/aura\//g, 'href="../anima/');
  s = s.replace(/\bhref="\.\.\/\.\.\/aura\//g, 'href="../../anima/');
  s = s.replace(/ensureAuraMasters/g, "ensureAnimaMasters");
  s = s.replace(/processAuraLegal/g, "processAnimaLegal");
  s = s.replace(/injectDesignSystemAuraRoot/g, "injectDesignSystemAnimaRoot");
  s = s.replace(/aura-launch/g, "anima-launch");
  s = s.replace(/aura-block/g, "anima-block");
  s = s.replace(/aura-legal/g, "anima-legal");
  s = s.replace(/AURA\.png/g, "Anima.png");
  s = s.replace(/\bANIMA\b/g, "Anima");
  s = s.replace(/\bAURA\b/g, "Anima");
  // Title-case stray "Aura" in product copy when not part of package id
  s = s.replace(/\bAura\b/g, "Anima");
  s = s.replace(/__PKG_AURA__/g, "com.gezegenselcore.aura");
  return s;
}

let changed = 0;
for (const file of walk(ROOT)) {
  if (file.endsWith("rebrand-aura-to-anima.mjs")) continue;
  const raw = fs.readFileSync(file, "utf8");
  const next = transform(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    changed++;
    console.log("patched", path.relative(ROOT, file));
  }
}
console.log(`Done, ${changed} files.`);

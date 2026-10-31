/**
 * ReFollow sayfalarını SSOT'tan siteye aktarır (tek komut) — uygulamadaki TÜM diller.
 * Kaynak (yalnızca okuma): D:\\GezegenselCore\\ReFollow
 *   - src/i18n/locales/*.json → ürün metinleri + settings.privacyPolicyContent / termsOfUseContent
 *   - src/config/links.ts → PLAY_STORE_URL, SUPPORT_EMAIL
 *
 * node tools/sync-refollow-policies.mjs
 * node tools/sync-refollow-policies.mjs "D:/GezegenselCore/ReFollow"
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const refollowArg = process.argv[2] ? `"${process.argv[2]}"` : "";

function run(label, script, extra = "") {
  const cmd = `node "${path.join(__dirname, script)}"${extra ? " " + extra : ""}`;
  console.log("\n→", label);
  const r = spawnSync(cmd, { cwd: ROOT, shell: true, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("Rebuild tr/ and en/ site pages + sitemap", "build-locale-pages.mjs");
run("Build ReFollow pages in all app languages (read-only SSOT)", "build-refollow-site.mjs", refollowArg);
run("Apply shared header/footer/theme chrome", "apply-shared-chrome.mjs");
console.log("\nReFollow pages synced from D:\\GezegenselCore\\ReFollow");

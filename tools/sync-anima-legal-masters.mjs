/**
 * @deprecated Anima artık doğrudan legal-public'tan okunur.
 * node tools/sync-anima-policies.mjs
 */
import { importAnimaLegal } from "./import-anima-legal-content.mjs";

importAnimaLegal(process.argv[2]);
console.log("Done. Prefer: node tools/sync-anima-policies.mjs");

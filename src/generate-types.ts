/**
 * Generates a TypeScript type from the JSON Schema.
 * Demonstrates "schema as single source of truth" → no manual TS interfaces
 * to drift out of sync.
 *
 * Run:  bun run src/generate-types.ts
 */
import { compileFromFile } from "json-schema-to-typescript";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

async function main() {
  const ts = await compileFromFile(join(ROOT, "schemas/user.schema.json"), {
    bannerComment: "/** Auto-generated from schemas/user.schema.json. Do not edit by hand. */",
  });
  const outPath = join(ROOT, "src/types/user.ts");
  writeFileSync(outPath, ts);
  console.log(`✓ Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

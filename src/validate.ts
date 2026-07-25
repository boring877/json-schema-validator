/**
 * Loads the JSON Schemas from ./schemas, validates the sample documents in
 * ./data, and prints a human-readable report. Demonstrates the full
 * validate → reject-with-errors loop.
 *
 * Run:  bun run src/validate.ts   (or:  npx tsx src/validate.ts)
 */
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ValidateFunction } from "ajv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJson(relPath: string) {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf-8"));
}

// -- 1. Compile schemas -----------------------------------------------------
// Ajv 2020 build gives us Draft 2020-12 support ($defs, prefixItems, etc.)
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv); // email, uuid, date-time, ...

// Register address first so user.$ref can resolve via its $id.
const addressSchema = loadJson("schemas/address.schema.json");
const userSchema = loadJson("schemas/user.schema.json");
ajv.addSchema(addressSchema);
const validateUser: ValidateFunction = ajv.compile(userSchema);

// -- 2. Run validation over the sample data --------------------------------
function validateDir(dir: string, label: string) {
  const dirPath = join(ROOT, dir);
  const files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  let pass = 0;
  let fail = 0;

  console.log(`\n=== ${label} ===`);
  for (const file of files) {
    const data = loadJson(`${dir}/${file}`);
    const ok = validateUser(data);
    if (ok) {
      console.log(`  ✓ ${file}`);
      pass++;
    } else {
      console.log(`  ✗ ${file}`);
      for (const err of validateUser.errors ?? []) {
        const at = err.instancePath || "(root)";
        console.log(`      • [${at}] ${err.message}`);
        if (err.params) console.log(`        params: ${JSON.stringify(err.params)}`);
      }
      fail++;
    }
  }
  return { pass, fail };
}

const valid = validateDir("data/valid", "Should PASS");
const invalid = validateDir("data/invalid", "Should FAIL");

// -- 3. Summary -------------------------------------------------------------
const totalPass = valid.pass + invalid.fail; // invalid failing is a pass for us
const totalFail = valid.fail + invalid.pass;
console.log(`\n=== Summary ===`);
console.log(`  Expected passes: ${totalPass}`);
console.log(`  Unexpected failures: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);

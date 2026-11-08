import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("bundles deterministic Python source, provenance, and its license", () => {
  const output = mkdtempSync(join(tmpdir(), "ha-plus-frontend-"));
  try {
    const command = fileURLToPath(new URL("../bin/vendor.js", import.meta.url));
    execFileSync(process.execPath, [command, output]);
    const source = readFileSync(join(output, "__init__.py"), "utf8");
    const original = readFileSync(new URL("../ha_plus_frontend/__init__.py", import.meta.url), "utf8");
    assert.ok(source.endsWith(original));
    const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
    assert.equal(JSON.parse(readFileSync(join(output, "SOURCE.json"))).version, manifest.version);
    assert.equal(readFileSync(join(output, "LICENSE"), "utf8"), readFileSync(new URL("../LICENSE", import.meta.url), "utf8"));
    execFileSync(process.execPath, [command, output]);
    assert.equal(readFileSync(join(output, "__init__.py"), "utf8"), source);
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});

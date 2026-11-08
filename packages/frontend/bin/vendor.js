#!/usr/bin/env node
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const destination = process.argv[2];
if (!destination || process.argv.length !== 3) {
  throw new Error("Usage: ha-plus-frontend-vendor OUTPUT_MODULE_DIRECTORY");
}
const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const source = readFileSync(new URL("../ha_plus_frontend/__init__.py", import.meta.url), "utf8");
mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, "__init__.py"),
  `# Bundled from ${manifest.name} ${manifest.version}. Rebuild with ha-plus-frontend-vendor.\n${source}`);
copyFileSync(new URL("../LICENSE", import.meta.url), resolve(destination, "LICENSE"));
writeFileSync(resolve(destination, "SOURCE.json"), JSON.stringify({
  package: manifest.name,
  version: manifest.version,
  repository: manifest.repository.url,
}, null, 2) + "\n");

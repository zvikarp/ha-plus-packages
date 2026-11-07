#!/usr/bin/env node
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const destination = process.argv[2];
if (!destination || process.argv.length !== 3) {
  throw new Error('Usage: ha-plus-ui-licenses OUTPUT_DIRECTORY');
}
mkdirSync(destination, { recursive:true });
for (const name of ['LICENSE', 'LICENSE-APACHE-2.0', 'NOTICE']) {
  copyFileSync(new URL(`../${name}`, import.meta.url), resolve(destination, `ha-plus-ui.${name}`));
}

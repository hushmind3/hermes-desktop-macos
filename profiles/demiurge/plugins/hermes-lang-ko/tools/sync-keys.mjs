#!/usr/bin/env node
// Align locales/ko.desktop.yaml with the Desktop key set of a hermes-agent version.
// Usage: node tools/sync-keys.mjs --keys <hermes-agent>/locales/_keys.desktop.json [--fix] [--missing <out.txt>]
//   Reports keys the target no longer has (stale) and keys the pack does not translate yet (missing).
//   --fix drops stale keys and rewrites the header counts; translations are never added automatically.
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";

const { values: a } = parseArgs({
  options: {
    keys: { type: "string" },
    fix: { type: "boolean", default: false },
    missing: { type: "string" },
    pack: { type: "string", default: "locales/ko.desktop.yaml" },
  },
});
if (!a.keys) {
  console.error("--keys <_keys.desktop.json> is required");
  process.exit(1);
}

const packPath = resolve(a.pack);
const lines = readFileSync(packPath, "utf8").split("\n");
const header = lines.filter((l) => l.startsWith("#"));
// Entries are one per line: JSON-quoted key and value (valid YAML).
const entries = lines
  .filter((l) => l.startsWith('"'))
  .map((l) => {
    const i = l.indexOf('": ');
    return [JSON.parse(l.slice(0, i + 1)), JSON.parse(l.slice(i + 3))];
  });
const keysPath = resolve(a.keys);
const target = JSON.parse(readFileSync(keysPath, "utf8")).keys;
const allowed = new Set(target),
  have = new Set(entries.map(([k]) => k));
const stale = entries.filter(([k]) => !allowed.has(k)).map(([k]) => k);
const missing = target.filter((k) => !have.has(k));

console.log(
  JSON.stringify(
    {
      targetKeys: target.length,
      translated: entries.length - stale.length,
      stale: stale.length,
      missing: missing.length,
    },
    null,
    1,
  ),
);
if (a.missing) writeFileSync(resolve(a.missing), missing.join("\n") + "\n");

if (a.fix) {
  let rev = "unknown";
  try {
    rev = execFileSync(
      "git",
      ["-C", dirname(dirname(keysPath)), "rev-parse", "--short=10", "HEAD"],
      { encoding: "utf8" },
    ).trim();
  } catch {}
  const kept = entries
    .filter(([k]) => allowed.has(k))
    .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0));
  const newHeader = header.map((l) =>
    l.startsWith("# keys:")
      ? `# keys: ${target.length} Desktop keys from hermes-agent ${rev}`
      : l.startsWith("# translated:")
        ? `# translated: ${kept.length}`
        : l,
  );
  writeFileSync(
    packPath,
    newHeader.join("\n") +
      "\n\n" +
      kept
        .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join("\n") +
      "\n",
  );
  console.log(
    `rewrote ${basename(packPath)}: dropped ${stale.length} stale keys`,
  );
}

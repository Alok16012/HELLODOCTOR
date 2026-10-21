import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const directory = mkdtempSync(join(tmpdir(), "predico-import-"));
const source = "https://app.predico.co.in/institutions";
const row = [1, "Test College", "Karnataka", "ANAESTHESIOLOGY", "2AG", ["PWD"], "KAR Govt Quota-Open", "STATE", 783108, null, 24104, 23724, null];
function run(years, name) {
  const input = join(directory, `${name}-input.json`);
  const out = join(directory, name);
  writeFileSync(input, JSON.stringify({ source, exam: "pg", capturedAt: "2026-10-21", years }));
  const result = spawnSync(process.execPath, ["scripts/import-predico.mjs", input, out], { encoding: "utf8" });
  return { ...result, out };
}

test("writes compact per-year rows with dictionaries, tags and missing ranks", () => {
  const { status, out, stderr } = run({ 2025: { total: 1, rounds: ["R1", "R2", "R3"], rows: [row] } }, "ok");
  assert.equal(status, 0, stderr);
  const year = JSON.parse(readFileSync(join(out, "pg-2025.json"), "utf8"));
  const index = JSON.parse(readFileSync(join(out, "pg.json"), "utf8"));
  assert.deepEqual(year.rows[0], [0, 0, 0, 0, 0, 1, 1, 783108, 24104, 23724, null]);
  assert.equal(year.d.quota[0], "KAR Govt Quota-Open");
  assert.deepEqual(index.tags, ["PWD"]);
  assert.deepEqual(index.years, [{ year: 2025, total: 1, rounds: ["R1", "R2", "R3"] }]);
});

test("rejects an incomplete capture", () => {
  const result = run({ 2025: { total: 2, rounds: ["R1", "R2", "R3"], rows: [row] } }, "partial");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /captured 1 of 2/);
});

test("rejects invalid ranks", () => {
  const bad = [...row]; bad[10] = -5;
  const result = run({ 2025: { total: 1, rounds: ["R1", "R2", "R3"], rows: [bad] } }, "invalid");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid closing rank/);
});

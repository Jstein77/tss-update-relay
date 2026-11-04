import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig, packageUrl, resolveOrigin, validateConfig } from "../src/relay.js";

test("checked-in config passes validation", () => {
  assert.deepEqual(validateConfig(), []);
});

test("every region resolves to an origin host", () => {
  const config = loadConfig();
  for (const region of Object.keys(config.regions)) {
    assert.match(resolveOrigin(region, config).host, /\.update-relay\.example$/);
  }
});

test("package URLs use the region's origin host", () => {
  const config = {
    regions: { "xx-test-1": { origin: "origin-pool-t" } },
    origins: { "origin-pool-t": { host: "origin-pool-t.update-relay.example", status: "active" } },
  };
  assert.equal(
    packageUrl("xx-test-1", "pattern-26.311.zip", config),
    "https://origin-pool-t.update-relay.example/packages/pattern-26.311.zip",
  );
});

test("regions pointing at a retired origin are rejected", () => {
  const config = {
    regions: { "xx-test-1": { origin: "origin-pool-r" } },
    origins: { "origin-pool-r": { host: "origin-pool-r.update-relay.example", status: "retired" } },
  };
  assert.deepEqual(validateConfig(config), ['xx-test-1: origin "origin-pool-r" is retired']);
});

test("unknown origins are rejected", () => {
  const config = { regions: { "xx-test-1": { origin: "origin-pool-z" } }, origins: {} };
  assert.deepEqual(validateConfig(config), ['xx-test-1: unknown origin "origin-pool-z"']);
});

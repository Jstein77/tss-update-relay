import { readFileSync } from "node:fs";

const configDir = new URL("../config/", import.meta.url);

function readJson(name) {
  return JSON.parse(readFileSync(new URL(name, configDir), "utf8"));
}

export function loadConfig() {
  return { regions: readJson("regions.json"), origins: readJson("origins.json") };
}

export function resolveOrigin(region, config = loadConfig()) {
  const entry = config.regions[region];
  if (!entry) {
    throw new Error(`Unknown region: ${region}`);
  }
  const origin = config.origins[entry.origin];
  if (!origin) {
    throw new Error(`Region ${region} points at unknown origin ${entry.origin}`);
  }
  return { region, origin: entry.origin, host: origin.host, status: origin.status };
}

export function packageUrl(region, packageName, config = loadConfig()) {
  const { host } = resolveOrigin(region, config);
  return `https://${host}/packages/${packageName}`;
}

export function validateConfig(config = loadConfig()) {
  const problems = [];
  for (const [region, entry] of Object.entries(config.regions)) {
    if (!config.origins[entry.origin]) {
      problems.push(`${region}: unknown origin "${entry.origin}"`);
    }
  }
  for (const [name, origin] of Object.entries(config.origins)) {
    if (!/^[a-z0-9.-]+$/.test(origin.host ?? "")) {
      problems.push(`${name}: invalid host "${origin.host}"`);
    }
  }
  return problems;
}

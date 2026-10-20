import { appendFileSync } from "node:fs";
import { loadConfig, validateConfig } from "../src/relay.js";

const config = loadConfig();
const problems = validateConfig(config);

const rows = Object.keys(config.regions)
  .sort()
  .map((region) => {
    const name = config.regions[region].origin;
    const origin = config.origins[name];
    return `| ${region} | ${name} | ${origin?.status ?? "unknown"} | ${origin?.host ?? "-"} |`;
  });

const summary = [
  "### update-relay routing plan",
  "",
  "| Region | Origin | Origin status | Host |",
  "| --- | --- | --- | --- |",
  ...rows,
  "",
  problems.length === 0
    ? "Config checks passed."
    : [`Config checks found ${problems.length} problem(s):`, ...problems.map((p) => `- ${p}`)].join("\n"),
].join("\n");

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}
process.exitCode = problems.length === 0 ? 0 : 1;

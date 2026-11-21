// Bundles the service worker and copies the static files into dist/, which is
// the folder Chrome loads with "Load unpacked". The worker's file name and the
// oldest Chrome it targets are read from the manifest, so they have one source.
import { build } from "esbuild";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { basename } from "node:path";

const OUTDIR = "dist";
const STATIC_DIR = "static";
const WORKER_SOURCE = "src/main.ts";
const WORKER_EXTENSION = ".js";

const manifest = JSON.parse(
  await readFile(`${STATIC_DIR}/manifest.json`, "utf8"),
);
const workerName = basename(
  manifest.background.service_worker,
  WORKER_EXTENSION,
);

await rm(OUTDIR, { recursive: true, force: true });
await mkdir(OUTDIR, { recursive: true });
await build({
  entryPoints: { [workerName]: WORKER_SOURCE },
  outdir: OUTDIR,
  bundle: true,
  format: "iife",
  target: `chrome${manifest.minimum_chrome_version}`,
  minify: false,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});
await cp(STATIC_DIR, OUTDIR, { recursive: true });

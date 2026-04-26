import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(scriptDir, "..", "dist");
const indexPath = join(distDir, "index.html");
const fallbackPath = join(distDir, "404.html");
const staticRoutes = ["mobile", "camera", "sentry", "calibration", "events", "settings"];

if (existsSync(indexPath)) {
  copyFileSync(indexPath, fallbackPath);
  for (const route of staticRoutes) {
    const routeDir = join(distDir, route);
    mkdirSync(routeDir, { recursive: true });
    copyFileSync(indexPath, join(routeDir, "index.html"));
  }
}

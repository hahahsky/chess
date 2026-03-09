import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const requiredPaths = ["dist/main/index.js", "dist/preload/index.js", "dist/renderer/index.html"];
const missing = requiredPaths.filter((path) => !existsSync(path));

if (missing.length > 0) {
  console.error("Missing required build artifacts:", missing.join(", "));
  process.exit(1);
}

const winDir = resolve("dist", "win-unpacked");
if (!existsSync(winDir)) {
  console.error("Missing Windows unpacked artifact directory: dist/win-unpacked");
  process.exit(1);
}

const executables = readdirSync(winDir).filter((entry) => entry.toLowerCase().endsWith(".exe"));
if (executables.length === 0) {
  console.error("No executable found in dist/win-unpacked");
  process.exit(1);
}

console.log("Build artifacts verified:", requiredPaths.join(", "));

import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRendererDir = resolve(process.cwd(), "dist/renderer");
const fallbackRendererDir = resolve(process.cwd(), "../../dist/renderer");

if (existsSync(projectRendererDir)) {
  process.exit(0);
}

if (existsSync(fallbackRendererDir)) {
  mkdirSync(resolve(process.cwd(), "dist"), { recursive: true });
  rmSync(projectRendererDir, { recursive: true, force: true });
  cpSync(fallbackRendererDir, projectRendererDir, { recursive: true });
  process.exit(0);
}

console.error("Renderer output not found in expected paths.");
process.exit(1);

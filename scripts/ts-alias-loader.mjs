import { existsSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), "../src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const base = resolvePath(SRC, rel);
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, resolvePath(base, "index.ts")];
    for (const file of candidates) {
      if (existsSync(file)) {
        return { shortCircuit: true, url: pathToFileURL(file).href };
      }
    }
  }
  return nextResolve(specifier, context);
}

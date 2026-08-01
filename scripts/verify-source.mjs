import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const selfPath = "scripts/verify-source.mjs";

const requiredFiles = [
  "app/page.tsx",
  "app/admin/page.tsx",
  "app/api/contact/route.ts",
  "lib/auth.ts",
  "lib/supabase/admin.ts",
  "supabase/migrations/202607310001_jkp_primary_backend.sql",
  "vercel.json",
];

for (const relative of requiredFiles) {
  try {
    await stat(path.join(root, relative));
  } catch {
    errors.push(`Missing required file: ${relative}`);
  }
}

const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
if (vercel.framework !== "nextjs") errors.push("vercel.json must set framework=nextjs");
for (const key of ["outputDirectory", "buildCommand", "installCommand"]) {
  if (key in vercel) errors.push(`vercel.json must not override ${key}`);
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
for (const group of ["dependencies", "devDependencies"]) {
  for (const [name, version] of Object.entries(packageJson[group] || {})) {
    if (typeof version !== "string" || /^[~^*]|\s|\|\||[<>]/.test(version)) {
      errors.push(`${group}.${name} must use an exact version, found: ${version}`);
    }
  }
}

const envExample = await readFile(path.join(root, ".env.example"), "utf8");
if (!envExample.includes("SITE_INDEXING_ENABLED=false")) {
  errors.push(".env.example must default SITE_INDEXING_ENABLED=false");
}

const legacy = (...parts) => new RegExp(parts.join(""), "gi");
const forbiddenPatterns = [
  ["legacy cache backend", legacy("UPSTASH", "_REDIS")],
  ["legacy admin password", legacy("ADMIN", "_PASSWORD")],
  ["legacy session secret", legacy("SESSION", "_SECRET")],
  ["legacy admin cookie", legacy("ADMIN", "_COOKIE")],
  ["legacy Supabase helper", legacy("supabase", "Request")],
  ["browser-only CMS storage", legacy("local", "Storage")],
  ["committed Supabase secret", legacy("sb", "_secret_", "[A-Za-z0-9_-]{12,}")],
];

const scanExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".sql", ".yml", ".yaml"]);
const ignoredDirectories = new Set([".git", ".next", "node_modules", "coverage", "out", "build"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(absolute);
      continue;
    }
    if (!scanExtensions.has(path.extname(entry.name)) && entry.name !== ".env.example") continue;

    const relative = path.relative(root, absolute);
    if (relative === selfPath) continue;

    const source = await readFile(absolute, "utf8");
    for (const [label, pattern] of forbiddenPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(source)) errors.push(`${relative}: forbidden ${label}`);
    }
  }
}

await walk(root);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK: production source integrity checks passed.");

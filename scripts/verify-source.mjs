import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

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

const forbiddenPatterns = [
  ["personal email", /visualjambo@gmail\.com/gi],
  ["personal name", /Jami Harju/gi],
  ["legacy Upstash", /UPSTASH_REDIS/gi],
  ["legacy admin password", /ADMIN_PASSWORD/gi],
  ["legacy session secret", /SESSION_SECRET/gi],
  ["legacy admin cookie", /ADMIN_COOKIE/gi],
  ["legacy Supabase helper", /supabaseRequest/gi],
  ["browser localStorage CMS", /localStorage/gi],
  ["committed Supabase secret", /sb_secret_[A-Za-z0-9_-]{12,}/g],
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

    const source = await readFile(absolute, "utf8");
    const relative = path.relative(root, absolute);
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

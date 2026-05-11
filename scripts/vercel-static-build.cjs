/**
 * Копирует статику в public/ для Vercel, когда Output Directory = public.
 * Папка api/ остаётся в корне репозитория — серверless подхватывается отдельно.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "public");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "public",
  "data",
  "api",
  "scripts",
  ".vercel",
  ".cursor",
  "mcps",
  "netlify",
]);

const SKIP_FILES = new Set([
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.gallery.config.ts",
  "dev-server.cjs",
  ".gitignore",
  "vercel.json",
  "netlify.toml",
]);

const ROOT_FILE_EXT = new Set([
  ".html",
  ".css",
  ".js",
  ".webmanifest",
  ".svg",
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".json",
]);

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyTree(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const names = fs.readdirSync(srcDir);
  for (let i = 0; i < names.length; i++) {
    var name = names[i];
    if (name.startsWith(".")) continue;
    var sp = path.join(srcDir, name);
    var dp = path.join(destDir, name);
    var st = fs.statSync(sp);
    if (st.isDirectory()) {
      copyTree(sp, dp);
    } else {
      copyFile(sp, dp);
    }
  }
}

rmrf(outDir);
fs.mkdirSync(outDir, { recursive: true });

var entries = fs.readdirSync(root);
for (var j = 0; j < entries.length; j++) {
  var name = entries[j];
  if (name.startsWith(".")) continue;
  var full = path.join(root, name);
  var st = fs.statSync(full);
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(name)) continue;
    copyTree(full, path.join(outDir, name));
    continue;
  }
  if (SKIP_FILES.has(name)) continue;
  var ext = path.extname(name).toLowerCase();
  if (!ROOT_FILE_EXT.has(ext)) continue;
  copyFile(full, path.join(outDir, name));
}

console.log("vercel-static-build: copied site to public/");

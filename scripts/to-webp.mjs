import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const ASSETS = "src/assets";
const QUALITY = 82;

const files = await readdir(ASSETS);
const images = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

for (const file of images) {
  const src = join(ASSETS, file);
  const out = join(ASSETS, basename(file, extname(file)) + ".webp");
  const { size: before } = await import("fs").then((m) => m.promises.stat(src));
  await sharp(src).webp({ quality: QUALITY }).toFile(out);
  const { size: after } = await import("fs").then((m) => m.promises.stat(out));
  console.log(`${file} → ${basename(out)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
}

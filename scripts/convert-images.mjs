import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const conversions = [
  {
    input: path.join(rootDir, "src", "assets", "loading.jpg"),
    output: path.join(rootDir, "src", "assets", "loading.webp"),
    options: { quality: 82 },
  },
];

for (const { input, output, options } of conversions) {
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(input).webp(options).toFile(output);
  console.log(`Converted ${path.relative(rootDir, input)} -> ${path.relative(rootDir, output)}`);
}

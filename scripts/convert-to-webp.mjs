import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'src', 'assets');
const publicDir = path.join(projectRoot, 'public');

async function convertDir(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await convertDir(fullPath);
        } else if (/\.(png|jpe?g)$/i.test(file)) {
            const ext = path.extname(file);
            const name = path.basename(file, ext);
            const outputPath = path.join(dir, `${name}.webp`);

            console.log(`Converting ${fullPath} to ${outputPath}...`);
            try {
                await sharp(fullPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Successfully converted ${file}`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
}

async function main() {
    console.log('Starting conversion to WebP...');
    await convertDir(assetsDir);
    await convertDir(publicDir);
    console.log('Conversion finished!');
}

main();

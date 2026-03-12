import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'src', 'assets');
const publicDir = path.join(projectRoot, 'public');

function removeFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            removeFiles(fullPath);
        } else if (/\.(png|jpe?g)$/i.test(file)) {
            const webpPath = path.join(dir, `${path.basename(file, path.extname(file))}.webp`);
            if (fs.existsSync(webpPath)) {
                console.log(`Removing original image ${fullPath}...`);
                fs.unlinkSync(fullPath);
            } else {
                console.log(`Skipping removal of ${file} as no WebP version exists.`);
            }
        }
    }
}

console.log('Starting original image removal...');
removeFiles(assetsDir);
removeFiles(publicDir);
console.log('Original image removal finished!');

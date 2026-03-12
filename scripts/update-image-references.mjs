import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const publicDir = path.join(projectRoot, 'public');

const extensionsToUpdate = ['.jsx', '.js', '.css', '.html'];
const imageExtensions = /\.(png|jpe?g)/gi;

function updateFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
            updateFiles(fullPath);
        } else if (extensionsToUpdate.includes(path.extname(file))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (imageExtensions.test(content)) {
                console.log(`Updating references in ${fullPath}...`);
                const newContent = content.replace(imageExtensions, '.webp');
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Successfully updated ${file}`);
                }
            }
        }
    }
}

console.log('Starting reference updates...');
updateFiles(srcDir);
updateFiles(projectRoot); // To include index.html and potentially other root files
console.log('Reference updates finished!');

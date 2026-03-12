/**
 * Izhaar — Auto-migrate all local asset imports → Cloudinary CDN URLs
 * --------------------------------------------------------------------
 * Run: node scripts/migrate-to-cloudinary.mjs
 *
 * Scans every .jsx/.js file in src/ and replaces:
 *   import X from "...assets/services/songs.webp"
 * with:
 *   const X = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/services/songs"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '../src');

// Load the generated URL map
const urlMapPath = path.join(__dirname, '../src/cloudinaryUrls.js');
const urlMapContent = fs.readFileSync(urlMapPath, 'utf-8');

// Parse the URL map object from the JS file
const urlMapMatch = urlMapContent.match(/const cloudinaryUrls = ({[\s\S]*?});/);
const urlMap = JSON.parse(urlMapMatch[1]);

// Build a lookup: filename (e.g. "songs.webp") → full cloudinary URL
// Key: the relative asset path like "services/songs.webp"
// Value: cloudinary URL

function getAllFiles(dir, results = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'cloudinaryUrls.js') {
            getAllFiles(full, results);
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
            results.push(full);
        }
    }
    return results;
}

const files = getAllFiles(SRC_DIR);
let totalUpdated = 0;
let totalReplacements = 0;

for (const filePath of files) {
    // Skip the cloudinaryUrls.js file itself
    if (filePath.includes('cloudinaryUrls')) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    let fileReplacements = 0;

    // Match: import varName from "...assets/path/to/file.webp"
    // Also matches: import varName from '...' with single quotes
    const importRegex = /import\s+(\w+)\s+from\s+['"`]([^'"`]*assets[^'"`]*\.webp)['"`]/g;

    let match;
    const replacements = [];

    while ((match = importRegex.exec(content)) !== null) {
        const [fullMatch, varName, importPath] = match;

        // Extract the relative asset key (e.g. "services/songs.webp")
        const assetKey = importPath.replace(/.*assets\//, '').replace(/\\/g, '/');

        // Look up URL - try exact match first, then case-insensitive
        let cdnUrl = urlMap[assetKey];
        if (!cdnUrl) {
            const lowerKey = assetKey.toLowerCase();
            const foundKey = Object.keys(urlMap).find(k => k.toLowerCase() === lowerKey);
            if (foundKey) cdnUrl = urlMap[foundKey];
        }

        if (cdnUrl) {
            replacements.push({ fullMatch, varName, cdnUrl });
        }
    }

    for (const { fullMatch, varName, cdnUrl } of replacements) {
        const replacement = `const ${varName} = "${cdnUrl}"`;
        content = content.replace(fullMatch, replacement);
        fileReplacements++;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        totalUpdated++;
        totalReplacements += fileReplacements;
        const rel = path.relative(SRC_DIR, filePath);
        console.log(`✅ ${rel} (${fileReplacements} image${fileReplacements > 1 ? 's' : ''} → CDN)`);
    }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Migration Complete!
   Files updated    : ${totalUpdated}
   Imports replaced : ${totalReplacements}

All images now load from Cloudinary CDN 🌍
Fast on Hostinger, fast everywhere!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

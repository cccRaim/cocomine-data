// decrypt-dir.ts
import fs from 'fs';
import path from 'path';
import { decryptAesCbc } from "./aes";
import {assetIvHex, assetKeyHex, version} from "./config";

const INPUT_DIR = `../dumped/${version}/TextAsset`;
const OUTPUT_DIR = '../data';

function ensureDirExists(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processFile(filePath: string, relativePath: string): void {
    const outputPath = path.join(OUTPUT_DIR, relativePath);
    const outputDir = path.dirname(outputPath);

    try {
        ensureDirExists(outputDir);

        const encrypted = fs.readFileSync(filePath, 'utf-8');
        const decrypted = decryptAesCbc(
            encrypted,
            Buffer.from(assetKeyHex, 'hex'),
            Buffer.from(assetIvHex, 'hex')
        );

        fs.writeFileSync(outputPath.replace('.bytes', '').replace(/#\d+/, ''), JSON.stringify(JSON.parse(decrypted), null, 2));
        console.log(`✅ Decrypted: ${relativePath}`);
    } catch (err: any) {
        console.error(`❌ Failed to decrypt ${relativePath}: ${err.message}`);
    }
}

function walkDir(currentDir: string, baseDir = ''): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            walkDir(fullPath, relativePath);
        } else if (entry.isFile()) {
            processFile(fullPath, relativePath);
        }
    }
}

function main(): void {
    console.log(`🔍 Scanning directory: ${INPUT_DIR}`);
    ensureDirExists(OUTPUT_DIR);
    walkDir(INPUT_DIR);
    console.log('✅ All files processed.');
}

main();

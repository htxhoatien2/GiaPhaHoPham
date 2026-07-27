import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const landingDir = path.join(__dirname, '..', 'src', 'app', '(landing)');

const conflictingFolders = ['council', 'ancestral-hall', 'youtube'];

for (const folder of conflictingFolders) {
  const targetPath = path.join(landingDir, folder);
  if (fs.existsSync(targetPath)) {
    console.log(`[prebuild] Removing conflicting landing route: ${targetPath}`);
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

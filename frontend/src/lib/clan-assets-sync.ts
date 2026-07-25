/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/lib/clan-assets-sync.ts
 * @description Auto-sync official logo and banner image files to frontend public and base64 constants
 */

import fs from 'fs';
import path from 'path';

export function findMediaFile(targetName: string): string | null {
  const primaryPath = `C:\\Users\\pctua\\.gemini\\antigravity-ide\\brain\\ab8529bd-557b-467b-b432-2f7f658c5d42\\${targetName}`;
  if (fs.existsSync(primaryPath) && fs.statSync(primaryPath).size > 0) {
    return primaryPath;
  }

  const brainDir = 'C:\\Users\\pctua\\.gemini\\antigravity-ide\\brain';
  if (!fs.existsSync(brainDir)) return null;

  try {
    const subdirs = fs.readdirSync(brainDir);
    for (const dir of subdirs) {
      const dirPath = path.join(brainDir, dir);
      if (fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (
            file === targetName ||
            (targetName.includes('1784815468249') && file.includes('1784815468249')) ||
            (targetName.includes('1784816156457') && file.includes('1784816156457'))
          ) {
            const found = path.join(dirPath, file);
            if (fs.statSync(found).size > 0) return found;
          }
        }
      }
    }
  } catch {
    // Ignore read errors
  }
  return null;
}

export function syncClanAssets() {
  if (typeof window !== 'undefined') return; // Only run on server / Node side

  try {
    const srcLogo = findMediaFile('media__1784815468249.jpg');
    const srcBanner = findMediaFile('media__1784816156457.jpg');

    // Find frontend root directory
    let baseDir = process.cwd();
    if (!fs.existsSync(path.join(baseDir, 'public')) && fs.existsSync(path.join(baseDir, 'frontend', 'public'))) {
      baseDir = path.join(baseDir, 'frontend');
    }

    const publicDir = path.join(baseDir, 'public');
    const commonDir = path.join(baseDir, 'src', 'components', 'common');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    if (!fs.existsSync(commonDir)) {
      fs.mkdirSync(commonDir, { recursive: true });
    }

    // Sync Logo
    if (srcLogo && fs.existsSync(srcLogo)) {
      const logoBuffer = fs.readFileSync(srcLogo);
      fs.writeFileSync(path.join(publicDir, 'clan-logo.png'), logoBuffer);
      fs.writeFileSync(path.join(publicDir, 'clan-logo.jpg'), logoBuffer);
      fs.writeFileSync(path.join(publicDir, 'logo.png'), logoBuffer);
      fs.writeFileSync(path.join(publicDir, 'favicon.ico'), logoBuffer);

      const logoB64 = logoBuffer.toString('base64');
      const logoTs = `/**\n * Official Base64 Data URL for Tộc Phạm Văn An Trạch Logo\n */\nexport const CLAN_LOGO_BASE64 = 'data:image/jpeg;base64,${logoB64}';\n`;
      fs.writeFileSync(path.join(commonDir, 'clan-logo-base64.ts'), logoTs, 'utf8');
    }

    // Sync Banner
    if (srcBanner && fs.existsSync(srcBanner)) {
      const bannerBuffer = fs.readFileSync(srcBanner);
      fs.writeFileSync(path.join(publicDir, 'clan-banner.jpg'), bannerBuffer);
      fs.writeFileSync(path.join(publicDir, 'clan-banner.png'), bannerBuffer);
      fs.writeFileSync(path.join(publicDir, 'banner.jpg'), bannerBuffer);

      const bannerB64 = bannerBuffer.toString('base64');
      const bannerTs = `/**\n * Official Base64 Data URL for Tộc Phạm Văn An Trạch Banner\n */\nexport const CLAN_BANNER_BASE64 = 'data:image/jpeg;base64,${bannerB64}';\n`;
      fs.writeFileSync(path.join(commonDir, 'clan-banner-base64.ts'), bannerTs, 'utf8');
    }
  } catch (err) {
    console.error('[AssetsSync] Error auto-syncing clan assets:', err);
  }
}

// Execute auto-sync immediately when loaded on server side
if (typeof window === 'undefined') {
  syncClanAssets();
}

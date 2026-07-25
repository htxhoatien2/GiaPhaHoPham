/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/api/clan-logo/route.ts
 * @description Dynamic API endpoint serving official Clan Logo image
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { syncClanAssets, findMediaFile } from '@/lib/clan-assets-sync';

export async function GET() {
  try {
    syncClanAssets();

    let baseDir = process.cwd();
    if (!fs.existsSync(path.join(baseDir, 'public')) && fs.existsSync(path.join(baseDir, 'frontend', 'public'))) {
      baseDir = path.join(baseDir, 'frontend');
    }
    const publicLogoJpg = path.join(baseDir, 'public', 'clan-logo.jpg');
    const publicLogoPng = path.join(baseDir, 'public', 'clan-logo.png');
    const srcLogo = findMediaFile('media__1784815468249.jpg');

    let imgBuffer: Buffer | null = null;

    if (fs.existsSync(publicLogoJpg) && fs.statSync(publicLogoJpg).size > 0) {
      imgBuffer = fs.readFileSync(publicLogoJpg);
    } else if (fs.existsSync(publicLogoPng) && fs.statSync(publicLogoPng).size > 0) {
      imgBuffer = fs.readFileSync(publicLogoPng);
    } else if (srcLogo && fs.existsSync(srcLogo)) {
      imgBuffer = fs.readFileSync(srcLogo);
    }

    if (imgBuffer) {
      return new NextResponse(imgBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return new NextResponse('Logo image not found', { status: 404 });
  } catch (err) {
    console.error('Error serving logo image:', err);
    return new NextResponse('Server Error', { status: 500 });
  }
}

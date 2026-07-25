/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/api/clan-banner/route.ts
 * @description Dynamic API endpoint serving official Clan Banner image
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
    const publicBannerJpg = path.join(baseDir, 'public', 'clan-banner.jpg');
    const publicBannerPng = path.join(baseDir, 'public', 'clan-banner.png');
    const srcBanner = findMediaFile('media__1784816156457.jpg');

    let imgBuffer: Buffer | null = null;

    if (fs.existsSync(publicBannerJpg) && fs.statSync(publicBannerJpg).size > 0) {
      imgBuffer = fs.readFileSync(publicBannerJpg);
    } else if (fs.existsSync(publicBannerPng) && fs.statSync(publicBannerPng).size > 0) {
      imgBuffer = fs.readFileSync(publicBannerPng);
    } else if (srcBanner && fs.existsSync(srcBanner)) {
      imgBuffer = fs.readFileSync(srcBanner);
    }

    if (imgBuffer) {
      return new NextResponse(imgBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return new NextResponse('Banner image not found', { status: 404 });
  } catch (err) {
    console.error('Error serving banner image:', err);
    return new NextResponse('Server Error', { status: 500 });
  }
}

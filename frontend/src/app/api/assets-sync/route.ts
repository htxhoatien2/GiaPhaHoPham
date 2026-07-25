/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/api/assets-sync/route.ts
 * @description API endpoint to sync logo and banner image files to public directory and base64 constants
 */

import { NextResponse } from 'next/server';
import { syncClanAssets } from '@/lib/clan-assets-sync';

export async function GET() {
  syncClanAssets();
  return NextResponse.json({ success: true, message: 'Clan logo & banner assets synchronized.' });
}

export async function POST() {
  syncClanAssets();
  return NextResponse.json({ success: true, message: 'Clan logo & banner assets synchronized.' });
}

/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/(landing)/youtube/page.tsx
 * @description Public YouTube channel page — videos, playlists, heritage media
 * @version 1.0.0
 * @updated 2026-07-27
 */

import type { Metadata } from 'next';
import { YoutubeContent } from './youtube-content';

export const metadata: Metadata = {
  title: 'Kênh YouTube Tộc Phạm Văn — Gia Phả Điện Tử',
  description: 'Kênh YouTube chính thức của Tộc Phạm Văn An Trạch — Các thước phim tư liệu lễ tế giỗ tổ, từ đường và hoạt động dòng họ.',
  openGraph: {
    title: 'Kênh YouTube Tộc Phạm Văn — Gia Phả Điện Tử',
    description: 'Kênh YouTube chính thức của Tộc Phạm Văn An Trạch — Video tế lễ, khuyến học và di sản gia tộc',
    locale: 'vi_VN',
    type: 'website',
    url: 'https://giaphaphamvan.vercel.app/youtube',
  },
};

export default function YoutubePage() {
  return <YoutubeContent />;
}

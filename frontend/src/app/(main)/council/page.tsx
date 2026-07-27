/**
 * @project AncestorTree
 * @file src/app/(main)/council/page.tsx
 * @description Public council page with app sidebar — clan leadership, history, mission
 * @version 1.0.0
 * @updated 2026-07-27
 */

import type { Metadata } from 'next';
import { CouncilContent } from './council-content';

export const metadata: Metadata = {
  title: 'Hội đồng gia tộc — Gia Phả Tộc Phạm Văn',
  description: 'Ban quản trị, lịch sử và sứ mệnh dòng họ Tộc Phạm Văn An Trạch',
  openGraph: {
    title: 'Hội đồng gia tộc — Gia Phả Tộc Phạm Văn',
    description: 'Ban quản trị, lịch sử và sứ mệnh dòng họ Tộc Phạm Văn An Trạch',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function CouncilPage() {
  return <CouncilContent />;
}

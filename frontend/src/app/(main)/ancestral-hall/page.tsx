/**
 * @project AncestorTree
 * @file src/app/(main)/ancestral-hall/page.tsx
 * @description Public ancestral hall page with app sidebar — gallery, schedule, location
 * @version 1.1.0
 * @updated 2026-07-27
 */

import type { Metadata } from 'next';
import { AncestralHallContent } from './ancestral-hall-content';

export const metadata: Metadata = {
  title: 'Nhà thờ họ — Gia Phả Tộc Phạm Văn',
  description: 'Thông tin nhà thờ họ, hình ảnh, bản đồ và lịch tế lễ hàng năm Tộc Phạm Văn An Trạch',
  openGraph: {
    title: 'Nhà thờ họ — Gia Phả Tộc Phạm Văn',
    description: 'Thông tin nhà thờ họ, hình ảnh, bản đồ và lịch tế lễ hàng năm Tộc Phạm Văn An Trạch',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function AncestralHallPage() {
  return <AncestralHallContent />;
}
